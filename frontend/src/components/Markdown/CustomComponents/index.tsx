import React from 'react'
import { Typography, Divider } from '@douyinfe/semi-ui'
import { ReactEditor, useEditor, useNodeCtx } from '@milkdown/react'
import { setUpYunImg } from '@/utils/tools'
import Spin from '@/components/Spin'
import ImageComponent from '@/components/Image'
import styles from './index.module.scss'

const { Text, Title: SemiTitle, Paragraph: SemiParagraph } = Typography

export const Paragraph = React.memo(({ children }) => (
  <SemiParagraph component='div' className={styles.p}>
    {children}
  </SemiParagraph>
))

export const Image = React.memo(() => {
  const { node } = useNodeCtx()
  const { src, ...props } = node.attrs
  return <ImageComponent src={node.attrs.src} className={styles.img} {...props} />
})

export const Title = React.memo(({ children }) => {
  const { node } = useNodeCtx()
  return <SemiTitle heading={node.attrs.level}>{children}</SemiTitle>
})

export const Hr = React.memo(Divider)

export const EmptyComponent = React.memo(() => {
  return null
})

export const ListItem = React.memo(({ children }) => {
  const { node } = useNodeCtx()
  console.log(node, children)
  return children
})
