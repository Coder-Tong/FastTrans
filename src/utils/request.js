import request, { extend } from 'umi-request';
import { notification } from 'antd';

// 异常处理
const errorHandler = error => {
  const { response, name } = error || {}
  if (name === 'AbortError') {
    return { code: 0, aborted: true }
  }

  if (request.isCancel(error)) {
    notification.info({ message: '取消请求' })
  } else if (response && response.status) {
    notification.error({ message: response.status })
  } else {
    notification.error({ message: '未知错误' })
  }

  return response
}

// 配置默认请求参
const requestDefault = extend({
  errorHandler,
  timeout: 300 * 1000,
})

const requestBaiduTrans = (url, options) => requestDefault(url, options)

export default requestBaiduTrans
