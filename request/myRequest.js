// 因为每个请求完成的时间都不一样，所以采用计算的方式，直至所有的请求完成了才隐藏加载条
// 同时发送请求的次数
let requestTimes = 0;
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
  const baseURL = "https://api.zbztb.cn/api/public/v1";
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