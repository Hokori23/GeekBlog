import React, { useEffect, useMemo } from 'react'
import Select, { SelectProps } from '@douyinfe/semi-ui/lib/es/select'
import { useRequest } from 'ahooks'
import { useMobileSize } from '@/hooks/useScreenSize'
import { Form } from '@douyinfe/semi-ui'
import { ExtractProps } from '@/utils/typeHelper'

type FormSelectProps = ExtractProps<typeof Form.Select>

interface RemoteSelectProps extends SelectProps {
  api: () => Promise<SelectProps['optionList']>
  lazy?: boolean
}

const RemoteSelect = React.memo<RemoteSelectProps>(({ api, lazy = true, ...props }) => {
  const isMobileSize = useMobileSize()
  const { run, loading, data, cancel } = useRequest(api, {
    manual: lazy,
  })

  const onFocus = lazy
    ? () => {
        if (!data) {
          run()
        }
      }
    : undefined

  useEffect(() => {
    if (!lazy) {
      run()
    }
    return () => {
      cancel()
    }
  }, [])

  return (
    <Select
      loading={loading}
      optionList={data}
      clickToHide={true}
      onFocus={onFocus}
      size={isMobileSize ? 'small' : 'default'}
      {...props}
    />
  )
})

interface FormRemoteSelectProps extends FormSelectProps {
  api: () => Promise<SelectProps['optionList']>
  lazy?: boolean
}

export const FormRemoteSelect = React.memo<FormRemoteSelectProps>(
  ({ api, lazy = true, field, ...props }) => {
    const isMobileSize = useMobileSize()
    const { run, loading, data, cancel } = useRequest(api, {
      manual: lazy,
    })

    const onFocus = lazy
      ? () => {
          if (!data) {
            run()
          }
        }
      : undefined

    useEffect(() => {
      if (!lazy) {
        run()
      }
      return () => {
        cancel()
      }
    }, [])

    return (
      <Form.Select
        field={field}
        loading={loading}
        optionList={data}
        clickToHide={true}
        onFocus={onFocus}
        size={isMobileSize ? 'small' : 'default'}
        {...props}
      />
    )
  },
)

export default RemoteSelect
