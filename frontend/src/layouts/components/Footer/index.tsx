import { Space, Col, Row, Typography, Image } from '@douyinfe/semi-ui'
import React, { FC, Fragment, useMemo } from 'react'
import classnames from 'classnames'
import { useMobileSize } from '@/hooks/useScreenSize'
import { RootState } from '@/store'
import styles from './index.module.scss'

// hooks
import useTimer from './useTimer'
import { useSelector } from 'react-redux'

const { Text } = Typography

interface FooterProps {
  id?: string
  className?: string
}

const Footer: FC<FooterProps> = ({ id, className }) => {
  const state = useSelector((state: RootState) => state.common)
  const isMobileSize = useMobileSize()

  const blogCreatedAt = useMemo(
    () => state.blogConfig?.find((v) => v.module === 'system' && v.key === 'createdAt')?.value,
    [state.blogConfig],
  )

  const blogName = useMemo(
    () => state.blogConfig?.find((v) => v.module === 'system' && v.key === 'blogName')?.value,
    [state.blogConfig],
  )

  const { dateText, yearText } = useTimer(Number(blogCreatedAt), blogName)
  return (
    <div className={styles.footer}>
      <div className={styles.col}>
        <Space vertical align='center'>
          <Text>{`© ${yearText}`}</Text>
          <Text>
            由<Text link={{ href: 'https://blog.hokori.online', target: '_blank' }}>Hokori</Text>
            提供技术支持
            {dateText && ` 博客已建 ${dateText}`}
          </Text>
        </Space>
      </div>
      {useMemo(
        () => (
          <div className={styles.col}>
            <Space vertical align='center'>
              <Text component='div' style={{ display: 'flex', alignItems: 'center' }}>
                本站由
                {/* TODO: 替换图片 */}
                <Image
                  height={25}
                  style={{ padding: '0 5px' }}
                  src='https://upyun.hokori.online/2021-03-07/upyun.png'
                />
                提供 CDN 加速 / 云存储服务
              </Text>
              <Text>
                互联网ICP备案：
                <Text link={{ href: 'http://www.beian.gov.cn', target: '_blank' }}>
                  粤ICP备19141609号
                </Text>
              </Text>
            </Space>
          </div>
        ),
        [],
      )}
      {/* <div className={styles.col}>
        <Space vertical align='center' />
      </div> */}
    </div>
  )
}

export default Footer
