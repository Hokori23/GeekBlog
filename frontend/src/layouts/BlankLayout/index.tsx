import PageLoading from '@/components/PageLoading'
import React, { Suspense } from 'react'
import { LayoutProps } from '../types'

const BlankLayout = React.memo<LayoutProps>(({ Component, ...props }) => (
  <Suspense fallback={<PageLoading />}>
    <Component {...props} />
  </Suspense>
))

export default BlankLayout
