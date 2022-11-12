import React, { FC, useMemo, useRef, useState } from 'react'
import { Button, Col, Row, ButtonGroup } from '@douyinfe/semi-ui'
import { RouteComponentProps } from 'react-router-dom'
import { RouteConfig } from '@/routes'
import useUrlParams from '@/hooks/useUrlParams'
import styles from './index.module.scss'
import useAuth from '@/hooks/useAuth'
import useRequest from './useRequest'

// components
import ScrollTop from '@/components/ScrollTop'
import Spin from '@/components/Spin'
import Banner from './Banner'
import Markdown, { EditorHandler } from '@/components/Markdown/Editor'

const PostDetail: FC<RouteComponentProps & RouteConfig> = (props) => {
  const { urlParams } = useUrlParams<{ id: string }>()
  const { id } = urlParams
  const { isAdmin } = useAuth()
  const [isEdit, setIsEdit] = useState(false)
  const { getPostService, savePostService } = useRequest({
    id: Number(id),
    onSave: () => setIsEdit(false),
  })
  const post = getPostService.data?.data

  const markdownRef = useRef<EditorHandler | null>(null)
  const Content = useMemo(
    () => <Markdown ref={markdownRef} defaultValue={post?.content} readOnly={!isEdit} />,
    [post?.content, isEdit],
  )

  return (
    <>
      <Row type='flex' justify='center' className={styles.postDetailWrapper}>
        <Col span={24}>
          {getPostService.loading ? (
            <Spin />
          ) : (
            post && (
              <Row type='flex' justify='center'>
                <Banner post={post} onEditMode={setIsEdit} />
                {/* TODO: 标签编辑 */}
                {/* TODO: 高级设置 */}
                <Col span={24} xl={18} xxl={16} style={{ position: 'relative' }}>
                  {Content}
                  {isEdit && (
                    <ButtonGroup className={styles['action-btns']}>
                      <Button
                        theme='solid'
                        loading={savePostService.loading}
                        disabled={!isAdmin}
                        onClick={() => savePostService.run(markdownRef.current?.getValue() || '')}
                      >
                        保存
                      </Button>
                      <Button
                        loading={savePostService.loading}
                        disabled={!isAdmin}
                        onClick={() => {
                          markdownRef.current?.refresh()
                          setIsEdit(false)
                        }}
                      >
                        取消
                      </Button>
                    </ButtonGroup>
                  )}
                </Col>
              </Row>
            )
          )}
        </Col>
      </Row>
      <ScrollTop />
    </>
  )
}
export default React.memo(PostDetail)
