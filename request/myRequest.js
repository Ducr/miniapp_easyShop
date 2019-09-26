// 因为每个请求完成的时间都不一样，所以采用计算的方式，直至所有的请求完成了才隐藏加载条
// 同时发送请求的次数
let requestTimes = 0;
// 1.封装 promise 形式的请求的函数
export const request = (params) => {
  // 发送一次，递增一次
  requestTimes++
  // 添加加载条
  wx.showLoading({
    title: "加载中",
    // 遮罩层 true=> 用户无法再次点击屏幕
    mask: true
  })
  // 设置公共的url
  const baseURL = "https://api.zbztb.cn/api/public/v1"
  // 这个代码段 会在 promise 被new的时候就执行了
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseURL + params.url,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        // 每次请求不管成功与否，都会执行complete
        // 完成一次，递减一次
        requestTimes--
        // 全完成时隐藏加载条
        requestTimes===0&&wx.hideLoading()
      }
    })
  })
}
// 2.封装 promise 形式的 wx.getSetting
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
// 3.封装 promise 形式的 wx.openSetting
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success:(result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
// 4.封装 promise 形式的 wx.chooseAddress
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success:(result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
// 5.封装 promise 形式的 wx.showModal
export const showModal = (params) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      ...params,
      success: (result) => {
        if (result) {
          resolve(result.confirm)
        }
      }
    })
  })
}
// 6.封装 promise 形式的 wx.showToast
export const showToast = (params) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      ...params,
      success: (result) => {
        resolve(result)
      }
    })
  })
}
