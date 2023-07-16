import { memo, useEffect, useState } from 'react';
import { Input, Form, Button, notification } from 'antd';
import { router } from 'umi';
import md5 from 'blueimp-md5';
import { checkValid } from '@/services/login';
import { resultHandler } from '@/utils/resultHandler';
import styles from './index.less';

const Login = ({
  ...props
}) => {
  const { form: { getFieldDecorator, validateFields } } = props

  const [loading, setLoading] = useState(false) // 登录
  const [initValues, setInitValues] = useState({}) // 表单初始值

  // 处理表单提交事件
  const handleSubmit = e => {
    e.preventDefault()
    validateFields(async (err, values) => {
      if (!err) { // 校验appID 和 secret是否合法
        setLoading(true)

        const { appid, key } = values
        const q = 'apple', from = 'en', to = 'zh'
        const salt = (new Date()).getTime()
        const sign = md5(`${appid}${q}${salt}${key}`)
        const params = {
          q,
          from,
          to,
          appid,
          salt,
          sign,
        }
        const { isSuccess } = resultHandler(await checkValid(params))
         // 有翻译结果说明用户输入的appid和key是正确的，将appid和key进行缓存
        if (isSuccess) {
          window.localStorage.setItem('baidu_trans_appId', appid)
          window.localStorage.setItem('baidu_trans_key', key)
          notification.success({ message: '验证成功' })
        }
        setLoading(false)
        if (isSuccess) router.push('/')
      }
    })
  }

  // 初始化相关操作
  const init = () => {
    const appid = window.localStorage.getItem('baidu_trans_appId')
    const key = window.localStorage.getItem('baidu_trans_key')
    setInitValues({
      appid,
      key,
    })
  }

  // 获取表单初始值
  useEffect(() => {
    init()
  }, [])

  return (
    <div className={styles.loginContainer}>
      <div className={styles.title1}>欢迎使用“快翻”</div>
      <div className={styles.title2}>基于百度翻译API的国际化辅助工具</div>
      <div className={styles.formContainer}>
        <Form onSubmit={handleSubmit} className={styles.form}>
          {/* AppID */}
          <Form.Item>
            {getFieldDecorator('appid', { rules: [{ required: true, message: 'AppID不能为空' }], initialValue: initValues.appid })(
              <Input placeholder="请输入AppID" allowClear />
            )}
          </Form.Item>
          {/* secret */}
          <Form.Item>
            {getFieldDecorator('key', { rules: [{ required: true, message: '密钥不能为空' }], initialValue: initValues.key })(
              <Input placeholder="请输入密钥" allowClear />
            )}
          </Form.Item>
          {/* 提交按钮 */}
          <Form.Item>
            <Button icon="right" htmlType="submit" className={styles.loginBtn} loading={loading} />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

const WrappedLogin = Form.create({ name: 'login' })(Login)

export default memo(WrappedLogin)
