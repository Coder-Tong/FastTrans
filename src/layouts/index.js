import { Layout, Divider, Menu, Icon, Tooltip } from 'antd'
import baidu_logo from '@/assets/images/baidu.png'
import { router } from 'umi'
import styles from './index.less'

const { Header, Content } = Layout

function BasicLayout(props) {

  // 处理菜单项点击事件
  const handleClick = e => {
    const { key } = e

    let url = '#'
    switch (key) {
      case 'doc': url = 'http://newbear.top/'; break;
      case 'ref': url = 'https://api.fanyi.baidu.com/doc/21'; break;
      default: break;
    }
    window.open(url)
  }

  // 退出
  const handleLogout = () => {
    window.localStorage.removeItem('baidu_trans_appId')
    window.localStorage.removeItem('baidu_trans_key')
    router.push('/login')
  }

  // 查看源码
  const viewCodeSource = () => {
    window.open('https://github.com/Coder-Tong/FastTrans')
  }

  return (
    <div className={styles.basicLayout}>
      <Layout>
        <Header>
          {/* logo */}
          <div className={styles.logoAndMenuContainer}>
            <img src={baidu_logo} alt="logo" className={styles.logo} />
            <Divider type="vertical" className={styles.divider} />
            {/* 导航栏菜单 */}
            <Menu mode="horizontal" selectedKeys={[]} className={styles.menu} onClick={handleClick}>
              <Menu.Item key="doc">说明文档</Menu.Item>
              <Menu.Item key="ref">参考资料</Menu.Item>
            </Menu>
          </div>
          {/* Github代码链接 */}
          <div className={styles.iconContainer}>
            <Tooltip title="查看源码" placement="bottom">
              <Icon type="github" className={styles.icon} onClick={viewCodeSource} />
            </Tooltip>
            <Tooltip title="退出" placement="bottom">
              <Icon type="logout" className={styles.icon} onClick={handleLogout} />
            </Tooltip>
          </div>
        </Header>
        <Content>{props.children}</Content>
      </Layout>
    </div>
  )
}

export default BasicLayout
