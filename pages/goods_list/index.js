import { request } from "./../../request/myRequest"
Page({
  data: {
    titleList: [
      { id: 0, text: "综合" },
      { id: 1, text: "销量" },
      { id: 2, text: "价格" }
    ],
    goodsList: [],
    currentIndex: 0,
    isShow: false,
    // 后台无图片返回时的备用照片
    picture:"http://img1.imgtn.bdimg.com/it/u=1739624281,530295853&fm=214&gp=0.jpg",
  },
  // 构建请求所需的参数,全局变量
  Params: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages:1,
  onLoad(options) {
    // 获取商品id
    this.Params.cid = options.cid
    this.getGoodsData()
  },
  // 发送请求获取商品列表参数
  getGoodsData() {
    request({
      url: "/goods/search",
      data:this.Params
    })
      .then(res => {
        if (res.data.meta.status === 200) {
          // 接口返回的新数组
          const newGoodsList = res.data.message.goods
          // 获取data中的旧数组
          const oldGoodsList = this.data.goodsList
          // 获取总条数
          const total = res.data.message.total
          // 获取总页数
          this.totalPages = Math.ceil(total / this.Params.pagesize)
          // 当需要加载下一页数据时，需将新旧数据拼接
          this.setData({
            goodsList:[...oldGoodsList,...newGoodsList]
          })
          // 关闭下拉刷新的组件
          wx.stopPullDownRefresh()
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 切换tab栏时，修改索引
  handleChangeIndex(e) {
    this.setData({
      currentIndex:e.detail.index
    })
  },
// ---------------------------
// 下拉刷新
  // 1.需要在页面的json文件中，开启 下拉刷新
  // "enablePullDownRefresh": true
  // “backgroundTextStyle”："dark"
  // 2.监听事件 onPullDownRefresh
  // 3.触发事件
  //    （1）重置页面————>重置数据
  //       重置页码 pagenum = 1 , goodsList = []
  //       发送请求获取最新数据 goodsList
  //    （2）数据加载回来后，手动关闭下拉组件
  //         wx.stopPullDownRefresh()
  // 页面下拉刷新事件
  onPullDownRefresh() {
    this.Params.pagenum = 1
    this.setData({
      goodsList:[]
    })
    this.getGoodsData()
  },
  // -------------------
  //  上拉加载下一页数据 -----滚动条触底事件
  // 1 先找到 上拉-滚动条触底事件（在页面的生命周期事件中见过 onReachBottom）
  // 2 先判断 有没有下一页数据  （页码，页容量，总条数）
  //   1 获取到总页数 
  //   2 只要拿 当前的页码 1  和 总页数做个判断
  // 3 当当前的页码 大于或者等于 总页码  
  //   没下一页数据
  //   否侧 还有下一页数据 
  // 4 确定有下一页数据
  //   1 页码 ++
  //   2 重新发送异步请求 （bug！  需要拿新旧数组做一个拼接即可 ）
  // 5 没有 下一页数据
  //   弹窗提示用户即可！！！
  onReachBottom() {
    // 判断是否有下一页
    if (this.Params.pagenum >= this.totalPages) {
      // 无下一页
      // 显示消息提示框
      wx.showToast({
        title: '数据加载已完毕',
        icon: 'none',
      })
      //修改底部提示栏的显示状态
      this.setData({
        isShow:true
      })
    } else {
      // 有下一页数据
      this.Params.pagenum++
      // 重新发送请求
      this.getGoodsData()
    }
  }
})