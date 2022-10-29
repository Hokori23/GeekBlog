import { useEffect, useRef } from 'react'
import { useRequest } from 'ahooks'
import { ArgumentTypes } from '@/utils/typeHelper'
// import LRU from 'lru-cache';

interface QueueItem {
  request: (...args: any[]) => Promise<unknown>
  rid: number
}

interface PromiseLimitOptions {
  doneCallback?: PromiseLimit['doneCallback']
}

/**
 * @description 有并发数量限制的Promise队列, 可以插队也可以脱离队列立即执行
 * @param { number } limit 限制数量
 * @returns { Function } add 推入队列
 * @returns { Function } jump 插队到第一个
 * @returns { Function } immediate 脱离队列立即执行
 */
export default class PromiseLimit {
  public done: boolean
  private limit: number
  private queue: QueueItem[]
  private pending: number
  private rid: number
  private doneCallback?: (...args: any[]) => any

  public constructor(limit: number, { doneCallback }: PromiseLimitOptions = {}) {
    this.rid = 1 // request id
    this.limit = limit
    this.queue = []
    this.pending = 0
    this.done = true
    this.doneCallback = doneCallback
  }

  public clear() {
    this.queue = []
    this.pending = 0
  }

  public add(request: QueueItem['request']) {
    const rid = this.rid
    this.queue.push({ request, rid })
    this.rid++
    this.done = false
    this.run()
    return rid
  }

  /**
   * TODO: // 按优先级排序添加
   */
  public priorityAdd(request: QueueItem['request']) {
    const rid = this.rid
    this.queue.unshift({ request, rid })
    this.rid++
    this.run()
    return rid
  }

  public run() {
    if (this.pending === this.limit) return
    const job = this.queue.shift()
    if (!job) return
    this.handleRun(job.request)
  }

  // 立即运行，不再维持在队列内
  public immediate(rid: number) {
    if (!rid) {
      return
    }
    const requestIdx = this.queue.findIndex((v) => v.rid === rid)
    if (requestIdx === -1) {
      return
    }
    const queueItem = this.queue.splice(requestIdx, 1)
    queueItem?.[0]?.request?.()
  }

  /**
   * @description 插到队列最前
   * @param { number | Function } rid
   */
  public jump(rid: number) {
    if (!rid) {
      return
    }
    if (typeof rid !== 'number') {
      this.queue.unshift(rid)
      return
    }

    const requestIdx = this.queue.findIndex((v) => v.rid === rid)
    if (requestIdx === -1) {
      return
    }
    const queueItem = this.queue.splice(requestIdx, 1) || []
    this.queue.unshift(...queueItem)
  }

  private async handleRun(request: QueueItem['request']) {
    this.pending++
    try {
      await request()
    } finally {
      this.handleAfterRun()
    }
  }

  private handleAfterRun() {
    this.pending--
    if (this.queue.length !== 0) {
      this.run()
    } else if (this.pending === 0) {
      // 没有任务了
      this.done = true
      this.doneCallback?.()
    }
  }
}

interface UseLimitRequestOptions {
  immediate?: boolean
  priority?: boolean
}

/**
 * 有并发数量限制的useRequest
 */
export const useLimitRequest = (
  requestFn: ArgumentTypes<typeof useRequest>['0'],
  options: NonNullable<ArgumentTypes<typeof useRequest>['1']> & UseLimitRequestOptions,
  queue: PromiseLimit,
) => {
  const rid = useRef<number>()
  const { manual = false, defaultParams, immediate, priority, ready } = options
  const requestInstance = useRequest(requestFn, {
    ...options,
    manual: false,
  })

  const enhanceRun = async (...params: any[]) =>
    new Promise((resolve) => {
      const add = (priority ? queue.priorityAdd : queue.add).bind(queue)
      rid.current = add(async () => {
        const res = await requestInstance.run(...params)
        resolve(res)
      })
    })
  const immediateRun = (...params: any[]) => requestInstance.run(...params)

  useEffect(() => {
    if (!manual && ready) {
      if (immediate) {
        immediateRun(defaultParams)
      } else {
        enhanceRun(defaultParams)
      }
    }
  }, [ready])
  const instance = {
    ...requestInstance,
    run: enhanceRun,
    jump() {
      queue.jump(rid.current!)
    },
    immediate() {
      queue.immediate(rid.current!)
    },
  }
  return instance
}
