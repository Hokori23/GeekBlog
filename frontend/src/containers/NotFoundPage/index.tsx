import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PathName } from '@/routes'
import styles from './index.module.scss'
import notFoundPageSvg from '@/static/svg/404.json'
import { useAnimation } from '@/hooks/useAnimation'
import { Button, Typography } from '@douyinfe/semi-ui'
import { useMobileSize } from '@/hooks/useScreenSize'
import { IconArrowLeft } from '@douyinfe/semi-icons'

const { Title } = Typography

const NotFoundPage = React.memo(() => {
  const navigate = useNavigate()
  const { ref: animationDOM } = useAnimation(notFoundPageSvg)

  const isMobileSize = useMobileSize()

  return (
    <div className={styles['not-found-404']}>
      <div className={styles['not-found-404__backward']}>
        <Button
          aria-label='back'
          onClick={() => {
            navigate(-1)
          }}
          theme='borderless'
          icon={<IconArrowLeft />}
        >
          返回上一页
        </Button>
      </div>
      <div
        className={
          isMobileSize ? styles['not-found-404__content--mobile'] : styles['not-found-404__content']
        }
      >
        <div className={styles['not-found-404__text']}>
          <Title color='secondary' heading={isMobileSize ? 4 : 3}>
            Sorry, 找不到页面
          </Title>
          <Button
            theme='solid'
            aria-label='home'
            style={{ marginTop: 20 }}
            onClick={() => navigate(PathName.HOME)}
          >
            返回首页
          </Button>
        </div>
        <div className={styles['not-found-404__animation']} ref={animationDOM} />
      </div>
    </div>
  )
})

export default NotFoundPage
