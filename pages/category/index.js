import { request } from "./../../request/myRequest"
Page({
  data: {
    menuList: [],
    goodsList: [],
    currentIndex:0
    
  },
  // 页面渲染用到的数据，定义在 data 中，data中的数据是全局变量
  // 一般情况下，页面用不到的全局变量，都不会定义在data中，而是单独建立在data外面
  Cates:[],
  onLoad() {
    this.loadCateData()
  },
  handleLower() {
    console.log(111111111111111111)
    let index = this.data.currentIndex
    const goodsListOld = this.Cates[index].children
    index++
    const goodsListNew = this.Cates[index].children
    this.setData({
      currentIndex: index,
      goodsList:[...goodsListOld,goodsListNew]
    })
  },
  loadCateData() {
    // 小程序中的同步的 本地存储 存值 可以存储任意的类型
    // 获取本地存储的数据
    const localCates = wx.getStorageSync('cates')
    if (localCates) {
      // 有缓存数据，判断是否过期，过期时间为 60s
      if (Date.now() - localCates.time > 60 * 1000) {
        // 缓存已过期，重新加载数据
        this.getCateData()
      } else {
        // 缓存未过期，使用缓存数据
        this.Cates = localCates.data
        // 覆写menuList、goodsList的数据
        const menuList = this.Cates.map(v => v.cat_name)
        const goodsList = this.Cates[0].children
        this.setData({
          menuList,
          goodsList
        })
      }
    } else {
      // 缓存不存在，发送请求数据
      this.getCateData()
    }
  },
  // 获取分类页面的原始数据
  getCateData() {
    request({
      url: "/categories"
    })
      .then(res => {
        if (res.data.meta.status === 200) {
          // 将整个分类的数据请求回来存储起来，以便后续使用
          this.Cates = res.data.message
          // console.log(this.Cates)
          // 将数据存储到本地存储中
          wx.setStorageSync('cates', {
            data: this.Cates,
            time: Date.now()
          });
            
          // 处理好左边 menu数据 为 字符串数组进行遍历
          const menuList = this.Cates.map(v => v.cat_name)
          // 处理好右边 goods数据,默认展示 第0个 的数据
          const goodsList = this.Cates[0].children
          // 覆写数据
          this.setData({
            menuList,
            goodsList
          })
        }
      })
      .catch(err => {
      console.log(err)
    })
  },
  // 处理左侧菜单栏点击事件
  // 修改currentIndex, 修改goodsList的数据, 每次scrollTop置零回到顶部
  handleTap(e) {
    const { index } = e.target.dataset
    const goodsList = this.Cates[index].children
    this.setData({
      currentIndex: index,
      goodsList,
      scrollTop:0
    })
  }
})