// pages/auth/index.js
import regeneratorRuntime from "./../../lib/runtime/runtime"
import { login, request } from './../../request/myRequest.js'
Page({
  // 获取用户信息 ------ 使用 button  的开放能力
  handleGetuserinfo(e) {
    // 将 返回的参数e 用于 微信小程序登录 的 请求参数
    this.wxMiniAppLogin(e)
  },
  // 微信小程序登录
  async  wxMiniAppLogin(e) {
    // 构建登录请求参数
    // 参数 code 执行小程序登录后获取
    const { code } = await login()
    // 其余参数直接从 用户信息 授权获取
    const { encryptedData, iv, rawData, signature } = e.detail
    const tokenParams = { encryptedData, iv, rawData, signature, code }
    const res = await request({
      url: '/users/wxlogin',
      method: 'post',
      data: tokenParams
    })
    // console.log(res)
    // 存储到本地储存中
    wx.setStorageSync('token', res.token)
    // 授权后进行跳转
    wx.navigateBack({
      // 返回上一页
      delta: 1
    })
  }
})