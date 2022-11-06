import React, { useState } from 'react'
import { useAnimation } from '@/hooks/useAnimation'
import loadingSvg1 from '@/static/svg/loading1.json'
import loadingSvg2 from '@/static/svg/loading2.json'
import loadingSvg3 from '@/static/svg/loading3.json'
import loadingSvg4 from '@/static/svg/loading4.json'
import loadingSvg5 from '@/static/svg/loading5.json'
import loadingSvg6 from '@/static/svg/loading6.json'
import loadingSvg7 from '@/static/svg/loading7.json'
import styles from './index.module.scss'
import classnames from 'classnames'

const LOADING_SVG = [
  loadingSvg1,
  loadingSvg2,
  loadingSvg3,
  loadingSvg4,
  loadingSvg5,
  loadingSvg6,
  loadingSvg7,
]
const loadingSvgLength = LOADING_SVG.length

interface PageLoadingProps {
  style?: React.CSSProperties
  show?: boolean
}

const PageLoading = React.memo<PageLoadingProps>(({ style, show = true }) => {
  const [svgIdx] = useState(~~((Math.random() + 1) * LOADING_SVG.length) % loadingSvgLength)
  const { ref: animationDOM } = useAnimation(LOADING_SVG[svgIdx])

  return (
    <div
      className={classnames(styles.loading, {
        [styles['loading-hidden']]: !show,
      })}
    >
      <div className={styles.loadingAnimation} ref={animationDOM} style={style} />
    </div>
  )
})

export default PageLoading
