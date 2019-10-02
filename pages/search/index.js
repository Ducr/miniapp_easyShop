// pages/search/index.js
import regeneratorRuntime from "./../../lib/runtime/runtime"
import { request } from './../../request/myRequest.js'
Page({
  data: {
    // 构建搜索默认列表
    list: [],
    // 是否为输入状态
    isFocus: false,
    // 构建输入框默认值
    inputVal: ''
  },
  timeId: -1,
  // 处理输入框事件
  handleInput(e) {
    const { value } = e.detail
    // 进行非空判断，有输入则显示取消按钮
    if (value.trim()) {
      this.setData({
        isFocus: true
      })
    }
    // 用来清除上一次的输入
    // 如果用户在定时器一次触发之前进行了多次输入，则会触发多次input事件，clearTimeout（）清除之前的所有定时器，确保只留下最后一个次
    clearTimeout(this.timeId)
    this.timeId = setTimeout(() => {
      // 调用搜索方法
      this.getQueryList(value)
    },1000)
  },
  async  getQueryList(value) {
    const res = await request({
      url: '/goods/qsearch',
      data: { query: value }
    })
    this.setData({
      list: res.data.message
    })
  },
  // 点击取消按钮
  handleCancel() {
    // 重置数据
    this.setData({
      list:[],
      isFocus: false,
      inputVal:''
    })
  }
})