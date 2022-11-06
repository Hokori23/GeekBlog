/* eslint-disable react/display-name */
import React, { FC, HTMLAttributes, useEffect, useState } from 'react'
import { Typography, Divider, Image } from '@douyinfe/semi-ui'
import classnames from 'classnames'
import Markdown from 'react-markdown'
import { Components } from 'react-markdown/lib/ast-to-react'
import styles from './index.module.scss'
import { setUpYunImg } from '@/utils/tools'

const { Text, Title, Paragraph } = Typography

// import { Element, Properties } from 'hast'
// import h from 'hastscript'

/**
 * plugins
 */

// @remark
import gfm from 'remark-gfm'

// @rehype
import rehypeRaw from 'rehype-raw'
import inspectUrls from '@jsdevtools/rehype-url-inspector'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Photos, imgRegExp } from '@/components/Markdown/Plugins/Photos'
/**
 *
 * okaidia(dark)
 * prism(light)
 * tomorrow(dark)
 * vs(ghcolors)(light)
 * darcula(dark)
 * atomDark
 */

interface RendererProps {
  className?: HTMLAttributes<HTMLElement>['className']
  content: string
  outline?: boolean // 是否只渲染概览内容
}

// interface ComponentsProps {
//   [key: string]: unknown
//   node: Element
//   children: React.ReactNode[]
//   inline?: boolean
//   className?: string
//   key: string
//   sourcePosition?: Position | null
//   index?: number
//   siblingCount?: number
// }
const CustomComponents = ({ outline }: { outline?: boolean }): Components => ({
  code({ node, children, inline, className, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter
        PreTag='div'
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, '')}
        language={match[1]}
        style={okaidia as any}
        {...props}
      />
    ) : (
      <code className={className} {...props} />
    )
  },
  h1: ({ node, ...props }) => <Title heading={1} {...props} />,
  h2: ({ node, ...props }) => <Title heading={2} {...props} />,
  h3: ({ node, ...props }) => <Title heading={3} {...props} />,
  h4: ({ node, ...props }) => <Title heading={4} {...props} />,
  h5: ({ node, ...props }) => <Title heading={5} {...props} />,
  h6: ({ node, ...props }) => <Title heading={6} {...props} />,
  p: ({ node, ...props }) => <Paragraph {...props} />,
  img: ({ node, src, ...props }) => (!outline && <Image {...(props as any)} />) as any,
  a: ({ node, ...props }) => (<Text link={props as any} />) as any,
  hr: () => <Divider margin={12} />,
})

export const Renderer: FC<RendererProps> = ({ content, className, outline }) => {
  return (
    <Markdown
        className={classnames(className, styles['markdown-renderer'])}
        components={CustomComponents({ outline })}
        rehypePlugins={[
          rehypeRaw,
          inspectUrls,
          Photos,
          // [
          //   rehypeComponents,
          //   {
          //     components: {
          //       test: (properties: Properties, children: Element[]) => {
          //         return h('.test', children)
          //       },
          //     },
          //   },
          // ],
        ]}
        remarkPlugins={[[gfm, { singleTilde: false }]]}
      >
        {content}
      </Markdown>
  )
}
