import { FunctionComponent, ComponentClass } from 'react'
import { RouteConfig } from '@/routes'
export interface LayoutProps extends RouteConfig {
  Component: ComponentClass<any> | FunctionComponent<any>
}
