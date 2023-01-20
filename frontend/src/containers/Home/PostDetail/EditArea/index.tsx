import { useMobileSize } from '@/hooks/useScreenSize'
import { IconAlertTriangle } from '@douyinfe/semi-icons'
import {
  Button,
  ButtonGroup,
  Divider,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
} from '@douyinfe/semi-ui'
import classnames from 'classnames'
import React, { useMemo } from 'react'
import PostTypeSelect from './components/PostTypeSelect'
import PriorityInput from './components/PriorityInput'
import TagSelect from './components/TagSelect'
import styles from './index.module.scss'

interface EditAreaProps {
  isEdit: boolean // 是否处于编辑模式
  loading: boolean
  onChange: (v: boolean) => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}

const EditArea = React.memo<EditAreaProps>(
  ({ isEdit, loading, onChange, onSave, onCancel, onDelete }) => {
    const isMobileSize = useMobileSize()
    const buttonSize = isMobileSize ? 'small' : 'default'
    const EditGroupButton = useMemo(() => {
      if (isEdit) {
        return (
          <>
            <Button theme='solid' size={buttonSize} loading={loading} onClick={onSave}>
              保存
            </Button>
            <Button size={buttonSize} disabled={loading} onClick={onCancel}>
              取消
            </Button>
          </>
        )
      }
      return (
        <>
          <Button size={buttonSize} theme='solid' onClick={() => onChange(true)}>
            编辑
          </Button>
          {isMobileSize ? (
            <Button
              size={buttonSize}
              theme='light'
              type='danger'
              onClick={() =>
                Modal.error({
                  size: 'full-width',
                  title: '确定要删除此文章？',
                  content: '此修改将不可逆',
                  onOk: onDelete,
                })
              }
            >
              删除
            </Button>
          ) : (
            <Popconfirm
              title='确定要删除此文章？'
              content='此修改将不可逆'
              okType='danger'
              icon={
                <IconAlertTriangle
                  style={{ color: 'var(--semi-color-danger)' }}
                  size='extra-large'
                />
              }
              position='leftTop'
              onConfirm={onDelete}
            >
              <Button size={buttonSize} theme='light' type='danger'>
                删除
              </Button>
            </Popconfirm>
          )}
        </>
      )
    }, [isEdit, loading, buttonSize])

    const PostForm = useMemo(() => {
      if (isMobileSize) {
        return (
          <div style={{ display: isEdit ? 'block' : 'none' }}>
            <Space wrap={true}>
              <TagSelect />
              <Divider layout='vertical' style={{ margin: '0 8px' }} />
              <PostTypeSelect />
              <Divider layout='vertical' style={{ margin: '0 8px' }} />
              <PriorityInput />
              <Divider layout='vertical' style={{ margin: '0 8px' }} />
              <Form.Checkbox field='post.isHidden' noLabel={true}>
                隐藏
              </Form.Checkbox>
              <Divider layout='vertical' style={{ margin: '0 8px' }} />
              <Form.Checkbox field='post.isLocked' noLabel={true}>
                封锁评论区
              </Form.Checkbox>
            </Space>
          </div>
        )
      }
      return (
        <div style={{ display: isEdit ? 'block' : 'none' }}>
          <Space wrap={true}>
            <TagSelect />
            <Divider layout='vertical' style={{ margin: '0 8px' }} />
            <PostTypeSelect />
            <Divider layout='vertical' style={{ margin: '0 8px' }} />
            <PriorityInput />
          </Space>
          <Row type='flex' align='middle' style={{ marginTop: 8 }}>
            <Form.Checkbox field='post.isHidden' noLabel={true}>
              隐藏
            </Form.Checkbox>
            <Divider layout='vertical' style={{ margin: '0 8px' }} />
            <Form.Checkbox field='post.isLocked' noLabel={true}>
              封锁评论区
            </Form.Checkbox>
          </Row>
        </div>
      )
    }, [isMobileSize, isEdit])

    return (
      <div
        className={classnames({
          [styles['edit-btns']]: true,
          [styles['edit-btns__edit']]: isEdit,
          [styles['edit-btns--mobile']]: isMobileSize,
        })}
      >
        {PostForm}
        <ButtonGroup className={styles.buttonGroup}>{EditGroupButton}</ButtonGroup>
      </div>
    )
  },
)

export default EditArea
