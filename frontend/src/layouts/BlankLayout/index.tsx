import React from 'react'
import { LayoutProps } from '../types'

const BlankLayout = React.memo<LayoutProps>(({ Component, ...props }) => <Component {...props} />)

export default BlankLayout
