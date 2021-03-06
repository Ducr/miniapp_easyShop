// pages/goods_detail/index.js
import regeneratorRuntime from "./../../lib/runtime/runtime"
import { request,showToast } from './../../request/myRequest.js'
Page({
  data: {
    // 商品的详情数据
    goodsData: {},
    // 商品是否被收藏
    isCollect: false
  },
  onLoad(options) {
    this.getGoodsDetail(options.goods_id)
  },
  // 获取商品的详情数据
  getGoodsDetail(goodsId) {
    request({
      url: "/goods/detail",
      data:{ goods_id:goodsId }
    })
      .then(res => {
        // console.log(res)
        this.setData({
        goodsData:res.data.message
      })
      })
    // 加载页面时，获取更新被收藏状态
    const { goodsData } = this.data
    let collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否在 本地存储中 已经被收藏了
    const index = collect.findIndex(v => v.goods_id === goodsData.goods_id)
    this.setData({
      isCollect:index===-1 ? false : true
    })
  },
  // 处理点击轮播图
  handleImagePreview(e) {
    // 获取data中商品对象数据
    const { goodsData } = this.data
    const urls = goodsData.pics.map( v => v.pics_mid_url)
    const currentUrl = e.target.dataset.current
    // 微信小程序点击预览组件
    wx.previewImage({
      // 被预览的图片路径数组
      urls: urls,
      // 被点击的图片路径
      current: currentUrl
    })
  },
  // 点击加入购物车
  handleCartAdd() {
    // 获取data中的商品对象数据
    const { goodsData } = this.data
    // 获取本地存储的购物车数据
    let cartList = wx.getStorageSync("carts") || []
    // 判断商品对象是否已存在于数组中
    const index = cartList.findIndex( v => v.goods_id === goodsData.goods_id)
    if (index === -1) {
      // 商品对象不存在----------新增商品对象
      cartList.push({
        goods_id: goodsData.goods_id,
        goods_name: goodsData.goods_name,
        goods_price: goodsData.goods_price,
        goods_small_logo: goodsData.goods_small_logo,
        goods_num: 1,
        checked:true
      })
    } else {
      // 商品对象已存在---------修改商品对象的数量，加 1 
      cartList[index].goods_num++
    }
    // 将数组存到 本地存储中，覆写进行更新
    wx.setStorageSync("carts", cartList)
    // 弹框提示用户加入购物车成功
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    })
  }, 
  // 处理点击收藏
  async  handleItemCollect() {
    const { goodsData } = this.data
    let collect = wx.getStorageSync('collect') || []
    // 判断该商品是否存在于 本地缓存数组中
    const index = collect.findIndex(v => v.goods_id === goodsData.goods_id)
    if (index === -1) {
      // 不存在 进行收藏
      collect.push(goodsData)
      this.setData({
        isCollect:true
      })
      await showToast({title:"收藏成功"})
    } else {
      // 存在 进行删除
      collect.splice(index, 1)
      this.setData({
        isCollect:false
      })
      await showToast({title:"取消成功"})
    }
    // 覆写本地储存，更新最新数据
    wx.setStorageSync("collect", collect)
  }
})