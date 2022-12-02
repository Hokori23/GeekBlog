import React, { PropsWithChildren } from 'react'
import { Empty } from '@douyinfe/semi-ui'
import { IllustrationConstruction } from '@douyinfe/semi-illustrations'

interface ErrorBoundaryProps {
  fallback?: (...args: any[]) => any
}
export default class ErrorBoundary extends React.Component<
  PropsWithChildren<ErrorBoundaryProps>,
  {
    errorInfo: any
  }
> {
  public constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { errorInfo: null }
  }

  public componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      errorInfo,
    })
    // You can also log error messages to an error reporting service here
    console.error(error)
  }

  public render() {
    if (this.state.errorInfo) {
      return this.props.fallback ? (
        this.props.fallback()
      ) : (
        <Empty image={<IllustrationConstruction />} description='出了一些问题...' />
      )
    }
    // Normally, just render children
    return this.props.children
  }
}
