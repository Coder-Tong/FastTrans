import requestBaiduTrans from '@/utils/request'

export async function checkValid (params) {
  return requestBaiduTrans('/api/trans/vip/translate', {
    method: 'GET',
    params,
  })
}