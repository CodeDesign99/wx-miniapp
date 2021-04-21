// 同时发送异步请求代码的次数
let ajaxTimes=0

export const request=(params)=>{
    ajaxTimes++
    // 显示加载效果
    wx.showLoading({
      title: '加载中',
      mask:true
    });

    //定义公共的 URL
    const baseURL = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseURL+params.url,
            success:(result)=>{
                resolve(result.data.message);
            },fail:(err)=>{
                reject(err);
            },complete:()=>{
                ajaxTimes--
                // 关闭等待图标
                if(ajaxTimes===0){
                    wx.hideLoading();
                }
            }
        });
    })
}