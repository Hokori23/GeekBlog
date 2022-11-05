import { FunctionComponent, ComponentClass } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { RouteConfig } from '@/routes'
export interface LayoutProps extends RouteComponentProps, RouteConfig {
  Component: ComponentClass<any> | FunctionComponent<any>
}
