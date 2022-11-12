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
import { Title, Paragraph, Image, Hr, EmptyComponent } from '../CustomComponents'
import { gfm, paragraph, image, hr, heading } from '@milkdown/preset-gfm'
import { prism } from '@milkdown/plugin-prism'
import './index.scss'

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
          .configure(paragraph, { view: renderReact(Paragraph) })
          .configure(image, { view: renderReact(inline ? EmptyComponent : Image) })
          .configure(heading, { view: renderReact(Title) })
          .configure(hr, { view: renderReact(Hr) })

        const _editor = Editor.make()
          .config((ctx) => {
            ctx.set(rootCtx, root)
            ctx.set(editorViewOptionsCtx, { editable: () => !readOnlyRef.current })
            defaultValue && ctx.set(defaultValueCtx, defaultValue)
          })
          .use(nord)
          .use(nodes)
          .use(prism)

        return _editor
      })

      const editorInstance = editor.editor.current
      const getMarkdown = useCallback(() => {
        const editorInstance = editor.editor.current
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
        forceUpdate()
      }, [readOnly])

      return (
        <div {...props}>
          <ReactEditor editor={editor} />
        </div>
      )
    },
  ),
)

export default MilkdownEditor
