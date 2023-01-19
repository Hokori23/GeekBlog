import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react'
import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { ReactEditor, useEditor } from '@milkdown/react'
import {
  forceUpdate as _forceUpdate,
  getMarkdown as _getMarkdown,
  replaceAll,
} from '@milkdown/utils'
import { Title, Image, Hr, EmptyComponent } from '../CustomComponents'
import { gfm, paragraph, image, hr, heading } from '@milkdown/preset-gfm'
import { prism } from '@milkdown/plugin-prism'
import { useUpdateEffect } from 'ahooks'
import ErrorBoundary from '@/components/ErrorBoundary'

// plugins
import { tooltip } from '@milkdown/plugin-tooltip'
import { history } from '@milkdown/plugin-history'
import { clipboard } from '@milkdown/plugin-clipboard'
// import { emoji } from '@milkdown/plugin-emoji' // 资源在国外, 不好用
import { cursor } from '@milkdown/plugin-cursor'
import { menu, menuPlugin } from '@milkdown/plugin-menu'
import { indent } from '@milkdown/plugin-indent'
import { upload, uploadPlugin } from '@milkdown/plugin-upload'
import uploader from './uploader'

import './code.scss'
import 'material-icons/iconfont/material-icons.css'

interface EditorProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  defaultValue?: string
  readOnly?: boolean
  inline?: boolean
}

export interface EditorHandler {
  getValue: () => string
  refresh: () => void
}

const MilkdownEditor = React.memo(
  forwardRef<EditorHandler, EditorProps>(
    ({ defaultValue, readOnly = false, inline, ...props }, ref) => {
      const readOnlyRef = useRef<boolean>(readOnly)

      const [_defaultValue] = useState(defaultValue)

      const { editor } = useEditor((root, renderReact) => {
        const nodes = gfm
          .configure(paragraph, {
            className: () =>
              'semi-typography semi-typography-paragraph semi-typography-primary semi-typography-normal',
          })
          .configure(image, { view: renderReact(inline ? EmptyComponent : Image) })
          .configure(heading, { view: renderReact(Title) })
          .configure(hr, { view: renderReact(Hr) })

        return (
          Editor.make()
            .config((ctx) => {
              ctx.set(rootCtx, root)
              ctx.set(editorViewOptionsCtx, { editable: () => !readOnlyRef.current })
              defaultValue && ctx.set(defaultValueCtx, defaultValue)
            })
            .use(nord)
            .use(nodes)
            .use(menu.configure(menuPlugin, {}))
            .use(tooltip)
            .use(history)
            .use(prism)
            .use(clipboard)
            // .use(emoji)
            .use(cursor)
            .use(indent)
            .use(
              upload.configure(uploadPlugin, {
                uploader,
                enableHtmlFileUploader: true,
              }),
            )
        )
      })

      const editorInstance = editor.editor.current
      const getMarkdown = useCallback(() => {
        let markdownContent = ''
        editorInstance?.action((ctx) => {
          markdownContent = _getMarkdown()(ctx)
        })
        return markdownContent || ''
      }, [editorInstance])

      const forceUpdate = useCallback(() => {
        editorInstance?.action(_forceUpdate())
      }, [editorInstance])

      const refresh = useCallback(
        (markdown: string) => {
          editorInstance?.action(replaceAll(markdown))
        },
        [editorInstance],
      )

      useImperativeHandle(ref, () => ({
        getValue: () => getMarkdown(),
        refresh: () => refresh(defaultValue || ''),
      }))

      useEffect(() => {
        readOnlyRef.current = readOnly
      }, [])

      useUpdateEffect(() => {
        readOnlyRef.current = readOnly
        forceUpdate()
      }, [readOnly])

      return (
        <ErrorBoundary>
          <div {...props}>
            <ReactEditor editor={editor} />
          </div>
        </ErrorBoundary>
      )
    },
  ),
)

export default MilkdownEditor
