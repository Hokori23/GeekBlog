import { Request } from '.'
import { CodeDictionary, Restful, UploadRestful } from './type'
import { Notification } from '@douyinfe/semi-ui'

const baseUrl = '/api/upload'

export enum FileType {
  IMAGE = 0,
  VIDEO = 1,
}

export interface UploadConfig {
  url: string
  payload: any
}

export interface FileProps {
  fileName: string
  formData: FormData
}

export const GetAuthorizationAndPolicy = async (
  fileName: string,
  fileType: FileType,
  payload?: any,
) => {
  return await Request<Restful<UploadConfig>>({
    method: 'GET',
    url: `${baseUrl}/token`,
    params: {
      fileName,
      fileType,
      payload,
    },
  })
}

export const Upload = async (formData: FormData, payload: any, url: string) => {
  Reflect.ownKeys(payload).forEach((key) => {
    formData.append(key as string, payload[key])
  })
  return await Request<UploadRestful>({
    method: 'POST',
    url,
    data: formData,
  })
}

export const handleUpload = async ({ fileName, formData }: FileProps, type: FileType) => {
  // 请求Authorization和Policy
  const res = await GetAuthorizationAndPolicy(fileName, type)
  if (!res?.data) return
  const { url, payload } = res.data

  // 上传又拍云
  return await Upload(formData, payload, url)
}

export const uploaderRequestHandler = async (image: File) => {
  const formData = new FormData()
  formData.append('file', image)
  const uploadRes = await handleUpload({ fileName: image.name, formData }, FileType.IMAGE)
  if (uploadRes?.code !== CodeDictionary.UPYUN_SUCCESS) {
    Notification.error({
      title: '警告',
      content: `上传图片失败: ${image.name}`,
    })
    return null
  }
  return uploadRes
}
