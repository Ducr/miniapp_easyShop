import { request } from './../../request/myRequest.js'
Page({
  data: {
    swiperList: [],
    navList: [],
    floorList:[]
  },
  onLoad() {
    this.getSwiperData()
    this.getNavData()
    this.getFloorData()
  },
  // 加载轮播图数据
  getSwiperData() {
    request({
      url: "/home/swiperdata",
    })
      .then(res => {
        if (res.data.meta.status === 200) {
        this.setData({
          swiperList:res.data.message
        })
        }
      })
      .catch(err => {
      console.log(err)
    })
  },
  // 加载获取导航数据
  getNavData() {
    request({
      url:"/home/catitems"
    })
      .then(res => {
        
        console.log(res)
        if (res.data.meta.status === 200) {
          this.setData({
            navList:res.data.message
          })
        }
      })
      .catch(err => {
      console.log(err)
    })
  },
  // 获取楼层展示图的数据
  getFloorData() {
    request({
      url:"/home/floordata"
    })
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.setData({
            floorList:res.data.message
          })
        }
      })
      .catch(err => {
      console.log(err)  
    })
  }
})
