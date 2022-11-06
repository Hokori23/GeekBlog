import React, { FC, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { PathName, RouteName } from '@/routes'
// import './index.less'
import { store } from '@/store'
import { useSelector } from 'react-redux'
import notFoundPageSvg from '@/static/svg/404.json'
import { useAnimation } from '@/hooks/useAnimation'
import InnerLink from '@/components/InnerLink'
import { useMobileSize } from '@/hooks/useScreenSize'

const NotFoundPage: FC<RouteComponentProps> = ({ history }) => {
  const { ref: animationDOM } = useAnimation(notFoundPageSvg)

  const isMobileSize = useMobileSize()

  return (
    <div className='not-found-404'>
      404
      {/* <div className='not-found-404__backward'>
        <Button
          aria-label='back'
          onClick={() => {
            history.goBack()
          }}
          // size="large"
          startIcon={<NavigateBeforeIcon />}
        >
          返回上一页
        </Button>
      </div>
      <div className={isMobileSize ? 'not-found-404__content--mobile' : 'not-found-404__content'}>
        <div className='not-found-404__text'>
          <Typography style={{ color: '#555e7e' }} variant={isMobileSize ? 'h4' : 'h3'}>
            Sorry, 找不到页面
          </Typography>
          <Button aria-label='home' style={{ marginTop: 20 }} variant='contained'>
            <InnerLink style={{ color: 'inherit' }} to={PathName.HOME}>
              返回首页
            </InnerLink>
          </Button>
        </div>
        <div className='not-found-404__animation' ref={animationDOM} />
      </div> */}
    </div>
  )
}
export default withRouter(NotFoundPage)
