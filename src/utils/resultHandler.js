import { notification } from 'antd'

// 错误码映射
const ERROR_CODES = {
    52001: '请求超时',
    52002: '系统错误',
    52003: '未授权用户',
    54000: '必填参数为空',
    54001: '签名错误',
    54003: '访问频率受限',
    54004: '账户余额不足',
    54005: '长query请求频繁',
    58000: '客户端IP非法',
    58001: '译文语言方向不支持',
    58002: '服务当前已关闭',
    90107: '认证未通过或未生效',
}

// 处理接口返回的数据
export const resultHandler = response => {
    let isSuccess = false
    let data = null
    
    if (response) { // 检验是否返回翻译结果
        const { trans_result } = response
        if (Array.isArray(trans_result)) {
            data = [...trans_result]
            isSuccess = true
        } else {
            const { error_code } = response
            notification.error({ message: ERROR_CODES[error_code] })
        }
    }

    return { isSuccess, data }
}