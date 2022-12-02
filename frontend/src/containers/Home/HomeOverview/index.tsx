import React, { FC, useMemo } from 'react'
import { PathName, RouteConfig } from '@/routes'
import { usePostOverview } from '@/hooks/usePostOverview'
import Pagination from '@/components/Pagination'
import { Col, List, Row, Typography } from '@douyinfe/semi-ui'
import PostOverviewItem from '@/components/PostOverviewItem'
import styles from './index.module.scss'
import ScrollTop from '@/components/ScrollTop'
import { useNavigate } from 'react-router'

const HomeOverview = React.memo(() => {
  const navigate = useNavigate()
  const { loading, posts, pagination } = usePostOverview({ postTypes: [] })

  const paginationComponent = useMemo(
    () =>
      Boolean(posts?.length) && (
        <Row type='flex' justify='center'>
          <Col span={20} xl={12} xxl={14}>
            <Pagination {...pagination} style={{ padding: '0 12px', boxSizing: 'border-box' }} />
          </Col>
        </Row>
      ),
    [posts?.length, pagination],
  )

  return (
    <>
      <Row type='flex' justify='center' className={styles.overviewWrapper}>
        <Col span={24} xl={18} xxl={16}>
          <List
            className={styles.overviewContainer}
            loading={loading}
            dataSource={posts}
            renderItem={(post) => (
              <PostOverviewItem
                post={post}
                onClick={() => navigate(`${PathName.HOME_DETAIL}?id=${post.id}`)}
              />
            )}
            emptyContent={<Typography.Title>暂无文章或说说</Typography.Title>}
          />
        </Col>
      </Row>
      {paginationComponent}
      <ScrollTop />
    </>
  )
})
export default HomeOverview
