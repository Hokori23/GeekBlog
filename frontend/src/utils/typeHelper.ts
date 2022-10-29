import React from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
any
  ? A
  : never
export type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.ComponentType<
  infer TProps
>
  ? TProps
  : TComponentOrTProps
