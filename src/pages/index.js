import React, { memo, useEffect, useState, useRef } from 'react';
import { Radio, Input, Button, Icon, Tooltip, message } from 'antd';
import { router } from 'umi';
import md5 from 'blueimp-md5';
import copy from 'copy-to-clipboard';
import { resultHandler } from '@/utils/resultHandler';
import { getTransResult } from '@/services/trans';
import { templateStyleConfig, transConfig } from './config.js';
import styles from './index.less';

const { TextArea } = Input

const HomePage = () => {
  const orgTextRef = useRef()

  const [loading, setLoading] = useState(false) // 请求加载标识位
  const [curKey, setCurKey] = useState(null) // 开发者密钥
  const [curAppId, setCurAppId] = useState(null) // 开发者appid
  const [curTempType, setCurTempType] = useState(1) // 模板样式
  const [curTempField, setCurTempField] = useState(null) // 模板字段前缀
  const [chineseTrans, setChineseTrans] = useState('') // 中文翻译
  const [englishTrans, setEnglishTrans] = useState('') // 英文翻译

  // 处理模板样式改变事件
  const handleTempTypeChange = e => {
    const { value } = e.target
    setCurTempType(value)
  }

  // 处理模板字段前缀改变事件
  const handleTempAffixChange = e => {
    const { value } = e.target
    setCurTempField(value)
  }

  // 解析翻译后的数据
  const resolveTransData = data => {
    const trans_ch = []
    const trans_en = []

    switch (curTempType) {
      case 1:
        data.forEach(item => {
          const { src, dst } = item
          const varName = dst.split(' ').join('_').toUpperCase()
          trans_ch.push(`${varName}: '${src}',`)
          trans_en.push(`${varName}: '${dst}',`)
        }); break
      case 2:
        data.forEach(item => {
          const { src, dst } = item
          const varName = dst.split(' ').join('_').toLowerCase()
          trans_ch.push(`${varName}: '${src}',`)
          trans_en.push(`${varName}: '${dst}',`)
        }); break
      case 3:
        data.forEach((item, index) => {
          const { src, dst } = item
          let indexStr = ''
          switch (true) {
            case index < 10: indexStr = `000${index}`; break
            case index < 100: indexStr = `00${index}`; break
            case index < 1000: indexStr = `0${index}`; break
            default: indexStr = `${index}`; break
          }
          const varName = `${curTempField || 'i18n'}_${indexStr}`
          trans_ch.push(`${varName}: '${src}',`)
          trans_en.push(`${varName}: '${dst}',`)
        }); break
      default: break
    }

    setChineseTrans(trans_ch.join('\n'))
    setEnglishTrans(trans_en.join('\n'))
  }

  // 处理翻译按钮点击事件
  const handleTrans = async () => {
    if (orgTextRef && orgTextRef.current) {
      const { value } = orgTextRef.current.state
      console.log('value', value)
      if (!value) { // 没有翻译内容
        setChineseTrans('')
        setEnglishTrans('')
        return
      } else { // 请求数据
        const q = value
        const from = 'zh', to = 'en'
        const salt = (new Date()).getTime()
        const sign = md5(`${curAppId}${q}${salt}${curKey}`)
        // 拼接请求参数
        const params = { q, from, to, appid: curAppId, salt, sign }

        setLoading(true)
        const { isSuccess, data } = resultHandler(await getTransResult(params))
        if (isSuccess) {
          console.log('data', data)
          resolveTransData(data)
        }
        setLoading(false)
      }
    }
  }

  // 复制翻译结果
  const handleCopy = type => {
    if (!type) return
    copy(type === 'trans_ch' ? chineseTrans : englishTrans)
    message.success('复制成功')
  }

  // 初始化
  const init = () => {
    // 读取localStorage中存储的APPID和密钥信息
    const appId = window.localStorage.getItem('baidu_trans_appId')
    const key = window.localStorage.getItem('baidu_trans_key')
    if (!appId || !key) router.push('/login')
    setCurAppId(appId)
    setCurKey(key)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className={styles.container}>
      {/* 配置项 */}
      <div className={styles.configContainer}>
        <span className={styles.label}>翻译配置</span>
        <div className={styles.config}>
          {/* 模板样式 */}
          <>
            <span className={styles.configLabel}>变量样式</span>
            <Radio.Group onChange={handleTempTypeChange} value={curTempType}>
              { templateStyleConfig.map(item => {
                const { key, value, tips } = item
                return (
                <Radio key={key} value={key}>
                  {value}
                  {tips &&
                  <Tooltip title={tips} placement="right" >
                    <Icon type="question-circle" style={{ marginLeft: '8px' }} />
                  </Tooltip>}
                </Radio>)
              }) }
            </Radio.Group>
          </>
          {/* 模板字段 */}
          <div className={styles.field}>
            <span className={styles.configLabel}>模板前缀</span>
            <div className={styles.input}>
              <Input placeholder='请输入自定义模板字段前缀，如：i18n' disabled={curTempType !== 3} onChange={handleTempAffixChange} />
            </div>
          </div>
        </div>
      </div>
      {/* 翻译结果 */}
      <div className={styles.transContainer}>
        {/* 原文 */}
        <div className={styles.trans}>
          <span className={styles.transLabel}>原文</span>
          <div className={styles.transText}><TextArea ref={orgTextRef} placeholder="请输入翻译原文，注意多段文本请换行输入" /></div>
        </div>
        {/* 翻译按钮 */}
        <div className={styles.transBtn}>
          <Button type="primary" onClick={handleTrans} loading={loading}>翻译</Button>
        </div>
        {/* 翻译结果 */}
        { transConfig.map(item => {
          const { key, value } = item
          const txt = key === 'trans_ch' ? chineseTrans : englishTrans
          return (
            <div key={key} className={styles.trans}>
              <div className={styles.labelContainer}>
                <span className={styles.transLabel}>{value}</span>
                <Tooltip title="复制" placement="right">
                  <Icon type="copy" className={styles.labelIcon} onClick={() => handleCopy(key)} />
                </Tooltip>
              </div>
              <div className={styles.transText}>
                <TextArea value={txt} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(HomePage)
