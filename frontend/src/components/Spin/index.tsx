import React from 'react'
import { Spin as SemiSpin } from '@douyinfe/semi-ui'
import { SpinProps } from '@douyinfe/semi-ui/lib/es/spin'
import styles from './index.module.scss'

const Spin = React.memo<SpinProps>((props) => (
  <div className={styles.spin}>
    <SemiSpin {...props} />
  </div>
))

export default Spin
