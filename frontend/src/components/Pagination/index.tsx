import React from 'react'
import { Pagination as SemiPagination } from '@douyinfe/semi-ui'
import { PaginationProps } from '@douyinfe/semi-ui/lib/es/pagination'
import classnames from 'classnames'
import styles from './index.module.scss'

const Pagination = React.memo<PaginationProps>(({ className, style, ...props }) => {
  return (
    <div
      className={classnames(className, styles.pagination, 'semi-table-pagination-outer')}
      style={style}
    >
      <span className='semi-table-pagination-info'>
        {`显示第 ${(props.currentPage! - 1) * props.pageSize! + 1} 条-第 ${
          props.currentPage! * props.pageSize!
        } 条，共 ${props.total || 0} 条`}
      </span>
      <span className='semi-table-pagination-wrapper'>
        <SemiPagination
          {...props}
          showSizeChanger={true}
          style={{
            marginTop: 16,
            textAlign: 'right',
          }}
        />
      </span>
    </div>
  )
})

export default Pagination
