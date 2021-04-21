// 引入用来发送请求的 方法 
import {request} from "../../requesst/index.js"
import regenertorRuntime from '../../lib/runtime/runtime'

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的菜单数据
    rightContent:[],
    // 被点击的左侧菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.先判断本地存储中有没有旧数据
    // {time:date.now(),data:[...]}
    // 2.没有旧数据 直接发送新请求
    // 3.有旧数据 同时 旧的数据也没有过期 就使用 本地存储的旧数据即可
        // 获取本地存储
        const Cates = wx.getStorageSync("cates");
        // 判断
        if(!Cates){
          // 不存在
          this.getCatesList()
        }else{
          // 有旧的数据 判断1过期时间
          if(Date.now()-Cates.time>1000*300){
            //重新发送请求
            this.getCatesList()
          }else{
            //可以使用旧数据
            this.Cates=Cates.data
            // 构造左侧的大菜单数据
            let leftMenuList=this.Cates.map(v=>v.cat_name)
            // 构造右侧的商品数据
            let rightContent=this.Cates[0].children

            this.setData({
              leftMenuList,
              rightContent
            })
          }
        }
  },
  async getCatesList(){
    // 获取 分类列表
    // request({url:"/categories"})
    // .then(res=>{
    //   this.Cates=res.data.message

    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name)
    //   // 构造右侧的商品数据
    //   let rightContent=this.Cates[0].children

    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    const res = await request({url:"/categories"})
    this.Cates=res

    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    // 构造左侧的大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name)
    // 构造右侧的商品数据
    let rightContent=this.Cates[0].children

    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e){
    const {index}=e.currentTarget.dataset
     // 构造右侧的商品数据
    let rightContent=this.Cates[index].children

    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置 右侧内容的滚动条距离顶部的距离
      scrollTop:0
    })
  }
})