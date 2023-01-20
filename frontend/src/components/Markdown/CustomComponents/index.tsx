import React, { PropsWithChildren, useContext, useRef, useState } from 'react'
import { Typography, Divider, Upload as SemiUpload, Popover, Button, Row } from '@douyinfe/semi-ui'
import { useNodeCtx } from '@milkdown/react'
import ImageComponent from '@/components/Image'
import styles from './index.module.scss'
import { UPYUN_URL } from '@/utils/const'
import { IconTick, IconUpload } from '@douyinfe/semi-icons'
import { Input } from '@douyinfe/semi-ui/lib/es/input'
import { useUpdateEffect } from 'ahooks'
import { uploaderRequestHandler } from '@/utils/Request/Upload'

const { Title: SemiTitle, Paragraph: SemiParagraph } = Typography

export const Paragraph = React.memo<PropsWithChildren>(({ children }) => (
  <SemiParagraph className={styles.p}>{children}</SemiParagraph>
))

interface UploadProps {
  onSuccess?: (src: string) => void
  show?: boolean
}

const Upload = React.forwardRef<SemiUpload, PropsWithChildren<UploadProps>>(
  ({ children, onSuccess, show = true }, ref) => (
    <SemiUpload
      ref={ref}
      className={styles.upload}
      style={{ display: show ? 'block' : 'none' }}
      draggable={true}
      dragMainText='点击上传图片或拖拽图片到这里'
      dragSubText='仅支持[jpg, jpeg, png]文件'
      accept='.jpg,.jpeg,.png'
      action=''
      // showUploadList={false}
      customRequest={async ({ fileInstance }) => {
        const uploadRes = await uploaderRequestHandler(fileInstance)
        if (!uploadRes) {
          return
        }
        const newSrc = `${UPYUN_URL}${uploadRes.url}`
        onSuccess?.(newSrc)
      }}
    >
      {children}
    </SemiUpload>
  ),
)
export const Image = () => {
  const { node, view } = useNodeCtx()
  const { src, ...props } = node.attrs

  const ref = useRef<SemiUpload | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [innerValue, setInnerValue] = useState(src)
  const [value, setValue] = useState(src)
  const [visible, setVisible] = useState(false)

  useUpdateEffect(() => {
    ;(node as any).attrs.src = value
    setRefresh(refresh + 1)
  }, [value])

  const onShow = () => view.editable && setVisible(true)

  const onHide = () => setVisible(false)

  const onSuccess = (src: string) => {
    setValue(src)
    setRefresh(refresh + 1)
    onHide()
  }

  if (!value) {
    // TODO: 点击时不要让原生的tooltip弹出来
    return <Upload onSuccess={onSuccess} />
  }

  return (
    <Popover
      trigger='custom'
      visible={visible}
      onClickOutSide={onHide}
      content={
        <Row style={{ padding: 10, minWidth: 300 }}>
          <Input
            prefix={<Button icon={<IconUpload />} onClick={() => ref.current?.openFileDialog()} />}
            suffix={<Button icon={<IconTick />} onClick={() => setValue(innerValue)} />}
            value={innerValue}
            onClear={() => setInnerValue(value)}
            onChange={setInnerValue}
            showClear
          />
        </Row>
      }
    >
      <div onClick={onShow}>
        <Upload ref={ref} onSuccess={onSuccess} show={false} />
        <ImageComponent src={node.attrs.src} className={styles.img} {...props} />
      </div>
    </Popover>
  )
}

export const Title = React.memo<PropsWithChildren>(({ children }) => {
  const { node } = useNodeCtx()
  return <SemiTitle heading={node.attrs.level}>{children}</SemiTitle>
})

export const Hr = React.memo(Divider)

export const EmptyComponent = React.memo(() => {
  return null
})
