import requestBaiduTrans from '@/utils/request'

export async function getTransResult(params) {
    return requestBaiduTrans('/api/trans/vip/translate', {
        method: 'GET',
        params,
    })
}