// 引入 regeneratorRuntime ，使原生小程序支持 ES7的 async 和 await 的语法
import regeneratorRuntime from "./../../lib/runtime/runtime"
import { getSetting, openSetting, chooseAddress,showModal,showToast } from './../../request/myRequest.js'
Page({
  data: {
    // 用户收货信息
    address: {},
    // 购物车数据
    carts: [],
    // 全选状态
    allChecked: false,
    // 总价格
    totalPrice:0,
    // 总数量
    totalNum: 0,
    inputVal:0
  },
  // 生命周期函数--监听页面显示
  onShow() {
    // 获取缓存中的默认地址， 默认值 空字符串
    const address = wx.getStorageSync("address")
    // 获取缓存中的 购物车数据
    const carts = wx.getStorageSync("carts")
    // 修改data中的 address 和 carts
    this.setData({
      address,carts
    })
    // 调用方法，进行页面刷新
    this.countCartData(carts)
  },
  // 1 获取 收货地址 ---------存在问题：点击拒绝后，第二次点击，无法再获取 收货地址
  // 思路：
  // 1 先检查 用户的授权-获取收货地址 状态    auth
  // 2 auth 表示 用户是否曾经给过 权限
  //   （1） auth = false 点击了 “取消”
  //        1 要提示用户 自己 打开 “授权页面” 让用户自己给权限
  //        2 直接获取用户的收货地址 
  //    (2) auth = true  表示 曾经 点击了 “允许”
  //    (3) auth = undefined  表示 没有点击过 取消 和 允许 
  //     当用户满足 2、3 的状态 直接获取用户的收货地址 
  // 3 通过 async的代码 来简化以上过程
  //   1 把   wx.getSetting 、 wx.openSetting 、wx.chooseAddress 
  //     改成 promise的形式
  // 4 把收货地址存入到 缓存中（下次打开小程序获取页面使用） 和 data（给页面渲染要用的）

  // 1.处理获取收货地址-------------------------
  async handleChooseAddress() {
    try {
      // 获取用户的授权
    let res1 = await getSetting()
    let auth = res1.authSetting["scope.address"]
    if (auth === false ) {
      // 打开 授权页面
      await openSetting()
    }
     // 获取用户收货地址
    let res2 = await chooseAddress()
    res2.detailAddress = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo
    // 把收货地址存入到 缓存中（下次打开小程序获取页面使用） 和 data（给页面渲染要用的）
    this.setData({
      address: res2
    })
    wx.setStorageSync('address', res2)
    } catch (err) {
      console.log(err)
    }
  },
  // 2.封装计算数据的方法，刷新页面------------------------
  // 只要哪里有修改购物车数据的地方，最后都调用该方法来进行实时更新
  countCartData(carts) {
    // 只要  carts 数组中 有一个元素的 checked=false 那么  allChecked=false ,默认true
    let allChecked = true 
    // 商品数据里面的 checked = true，才计算总价格 、总数量
    let totalPrice = 0
    let totalNum = 0
    // 遍历商品数据数组，找出需要计算的商品
    carts.forEach((e, i) => {
      if (e.checked === true) {
        totalPrice += e.goods_price * e.goods_num
        totalNum += e.goods_num
      } else {
        allChecked = false
      }
    })
    // 特殊情况：当carts里面没有数据时，allChecked = false 
    allChecked = carts.length <= 0 ? false : allChecked
    // 覆写当前数据
    this.setData({
      totalPrice,totalNum,allChecked
    })
  },
  // 3.处理单选的功能------------------
  // 给复选框的父元素（checkbox-group） 绑定  bindchange
  handleItemChange(e) {
    // 获取当前索引
    const {index} = e.target.dataset
    let {carts} = this.data
    // 修改被选中的状态------取反值
    carts[index].checked = !carts[index].checked
    // 覆写 data 和 本地存储 的数据
    this.setData({
      carts
    })
    wx.setStorageSync('carts', carts);
    // 调用计算数据方法进行页面更新
    this.countCartData(carts)
  },
  // 4.处理全选的功能-------------------
  // 给复选框的父元素（checkbox-group） 绑定  bindchange
  handleAllChecked() {
    let {allChecked,carts} = this.data
    // 将所有的商品数据 checked 取反 为 true / false
    allChecked = !allChecked
    // 将所有值都设置为与 allChecked属性 一致，不能每个都取反，因为有可能数组中 true/false 同时存在
    carts.map(e => e.checked = allChecked)
    // 同步 data 和 本地存储 
    this.setData({
      allChecked,carts
    })
    wx.setStorageSync('carts', carts)
    // 刷新页面数据
    this.countCartData(carts)
  },
  // 5.处理 " - " 和 " + " 的功能-----------------
  async  handleNumUpdate(e) {
    // 获取索引 和 按钮值
    const { index, operation } = e.target.dataset
    const { carts } = this.data
    // 判断当前数量是否为 1 ，同时是否还在 "-" 数量，如果是，此时应该弹窗提示是否删除
    if (carts[index].goods_num === 1 && operation === -1) {
      // 1.删除操作
      // 弹框提示
      let res = await showModal({title:'温馨提示',content:'您确认要删除该商品吗？'}) //返回结果为布尔值  确认 ——> true 、取消 ——> false
      if (res) {
        // 点击确认删除
        carts.splice(index, 1)
        showToast({
          title: '删除商品成功！',
          icon: 'success',
          mask: true
        })
      } else {
        // 点击取消，因为，未修改商品数据，停止后续操作
        return
      }
    } else {
      // 2.正常修改数据
      carts[index].goods_num += operation
    }
    // 同步 data 和 本地存储
    this.setData({
      carts
    })
    wx.setStorageSync("carts", carts)
    // 刷新页面
    this.countCartData(carts)
  },
  // 6.处理结算按钮点击跳转---------------------
  async  handleOrderPay() {
    // 提交前进行非空判断
    const { address , totalNum } = this.data
    // 判断结算处是否为0
    if (totalNum === 0) {
      await showToast({
        title: '您还没添加商品！',
        icon: 'none',
        mask: true
      })
      // 停止后续操作
      return
    }
    // 判断收货地址处是否不为空
    if (address === "") {
      await showToast({
        title: '请选择收货地址！',
        icon: 'none',
        mask: true
      })
      // 停止后续操作
      return
    }
    // 满足提交结算要求后，进行页面跳转
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
  // ,
  // handleGoodsInput(e) {
  //   console.log(e)
  //   this.setData({
  //     inputVal:e.detail.value
  //   })
  // }
})