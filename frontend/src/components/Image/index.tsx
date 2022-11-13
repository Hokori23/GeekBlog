import React from 'react'
import { Image as SemiImage, Typography } from '@douyinfe/semi-ui'
import { ImageProps } from '@douyinfe/semi-ui/lib/es/image'
import { setUpYunImg } from '@/utils/tools'
import Spin from '@/components/Spin'
import { IconUploadError } from '@douyinfe/semi-icons'

const { Paragraph } = Typography
type ImageNativeProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'ref'
>

const Image = React.memo(
  React.forwardRef<SemiImage, ImageProps & ImageNativeProps>(({ src, ...props }, ref) => (
    <SemiImage
      ref={ref}
      src={setUpYunImg(src!, 'md')}
      preview={{ src: setUpYunImg(src!, 'origin') }}
      placeholder={<Spin />}
      fallback={
        <div
          style={{
            textAlign: 'center',
            width: '100%',
          }}
        >
          <IconUploadError size='extra-large' />
          <Paragraph type='secondary' strong={true}>
            图片加载失败
          </Paragraph>
        </div>
      }
      {...props}
    />
  )),
)

export default Image
