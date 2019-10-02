// pages/pay/index.js
import regeneratorRuntime from "./../../lib/runtime/runtime"
import { showToast, request,requestPayment } from './../../request/myRequest.js'
Page({
  data: {
    // 用户收货地址
    address:{},
    // 购物车数据
    carts: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的地址    默认值为空字符串
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    let carts = wx.getStorageSync("carts") || []
    // 筛选出checked = true 的数据
    carts.filter(v => v.checked)
    this.setData({
      carts,address
    })
    // 加载购物车数据
    this.countCartData()
  },
  // 计算数据
  countCartData(carts) {
    let totalPrice = 0
    let totalNum = 0
    carts.forEach((e, i) => {
      if (v.checked) {
        // 计算被选中商品的价格和数量
        totalPrice += e.goods_num * e.goods_price
        totalNum += e.goods_num
      }
    })
    this.setData({
      totalPrice,totalNum
    })
  },
  // 处理点击支付事件
  handleOrderPay() {
    this.orderPay()
  },
  // 执行支付的逻辑
  async  orderPay() {
  try {
        // 判断是否有token
        const token = wx.getStorageSync('token')
        if (!token) {
          wx.wx.navigateTo({
            url: '/pages/auth/index'
          })
          return
        }
        // 构造 订单参数
        const { totalPrice, address, totalNum } = this.data
        const order_price = totalPrice
        const consignee_addr = address
        const goods = carts.map(v => {
          return {
            goods_id: v.goods_id,
            goods_number: v.goods_num,
            goods_price:v.goods_price
          }
        })
        const orderParams = { order_price, consignee_addr, goods }
        // 创建订单 ------ 获取订单编号
        const { order_number } = await request({
          url: '/my/orders/create',
          method: 'post',
          data:orderParams
        })
        // 创建支付 ------ 获取支付参数
        const { pay } = await request({
          url: '/my/orders/req_unifiedorder',
          method: 'post',
          // 请求参数订单编号
          data: { order_number }
        })
        // 调用微信内置的支付
          // 请求参数 pay =  {
          //   timeStamp: '',
          //   nonceStr: '',
          //   package: '',
          //   signType: '',
          //   paySign: ''
          // }
        await requestPayment(pay)
        // 查询订单支付状态
        const { message } = await request({
          url: '/my/orders/chkOrder',
          method: 'post',
          // 请求参数订单编号
          data: { order_number }
        })
        // 弹框显示支付状态
        await showToast({
          title: message,
          mask: true
        })
        // 保留为选中的商品 === 删除被选中的商品
        let localCarts = wx.getStorageSync('carts')
        // 覆写本地存储
        wx.setStorageSync('carts', localCarts.filter(v => !v.checked))
        // 支付成功，跳转到订单页
        wx.navigateTo({
          url: '/pages/order/index'
        })
  } catch (error) {
    console.log(error)    
    }
  }
})