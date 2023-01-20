import React, { useState } from 'react'
import { UPYUN_URL } from '@/utils/const'
import { uploaderRequestHandler } from '@/utils/Request/Upload'
import { IconImage, IconUpload } from '@douyinfe/semi-icons'
import { Button, Modal, Card, Avatar, Image, Notification } from '@douyinfe/semi-ui'
import Meta from '@douyinfe/semi-ui/lib/es/card/meta'
import Upload, { customRequestArgs } from '@douyinfe/semi-ui/lib/es/upload'
import { useRequest } from 'ahooks'
import styles from './index.module.scss'
import { useMobileSize } from '@/hooks/useScreenSize'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import { PostRequest } from '@/utils/Request/Post'
import Request from '@/utils/Request'
import { CodeDictionary } from '@/utils/Request/type'

const UploadBg = React.memo<{ coverUrl?: string }>(({ coverUrl }) => {
  const isMobileSize = useMobileSize()
  const { post } = useSelector((state: RootState) => state.postDetail)
  const dispatch = useSelector(() => store.dispatch.postDetail)
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const editPostService = useRequest(
    async (payload: PostRequest) => {
      const res = await Request.Post.EditByAdmin(payload)
      if (res?.code === CodeDictionary.SUCCESS && res?.data) {
        Notification.success({
          content: res.message,
        })
        dispatch.setPost(res.data)
      }
    },
    {
      manual: true,
    },
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { run: handleUpload, loading } = useRequest(
    async () => {
      if (loading || !selectedFile) {
        return
      }
      const uploadRes = await uploaderRequestHandler(selectedFile)
      if (!uploadRes) {
        return
      }
      const newSrc = `${UPYUN_URL}${uploadRes.url}`
      const tags = post?.tags?.map((v) => v.id!)
      editPostService.run({
        post: {
          ...post!,
          coverUrl: newSrc,
          tags,
        },
        tids: tags,
      })
      // onSuccess?.(newSrc)
    },
    {
      manual: true,
    },
  )

  return (
    <>
      <Button
        className={styles.uploadButton}
        icon={<IconImage />}
        theme='borderless'
        style={coverUrl ? { color: 'var(--semi-color-white' } : undefined}
        onClick={() => setUploadModalVisible(true)}
      >
        {isMobileSize ? null : '上传背景图'}
      </Button>
      <Modal
        size={isMobileSize ? 'full-width' : 'small'}
        visible={uploadModalVisible}
        title='上传背景图'
        onCancel={() => setUploadModalVisible(false)}
        onOk={() => handleUpload()}
        okButtonProps={{
          loading,
        }}
        cancelButtonProps={{
          disabled: loading,
        }}
      >
        {coverUrl && <Image className={styles.uploadImgPreview} src={coverUrl} />}

        <Upload
          draggable={true}
          // dragMainText='点击上传图片或拖拽图片到这里'
          // dragSubText='仅支持[jpg, jpeg, png]文件'
          accept='.jpg,.jpeg,.png'
          action=''
          showUploadList={false}
          customRequest={({ fileInstance }) => setSelectedFile(fileInstance)}
        >
          <Card shadows={isMobileSize ? undefined : 'hover'} style={{ width: '100%' }}>
            <Meta
              title='上传CDN'
              avatar={
                <Avatar alt='upload' size='default'>
                  <IconUpload />
                </Avatar>
              }
            />
          </Card>
        </Upload>
      </Modal>
    </>
  )
})

export default UploadBg
