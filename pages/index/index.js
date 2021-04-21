// 引入用来发送请求的 方法 
import {request} from "../../requesst/index.js"
import regenertorRuntime from '../../lib/runtime/runtime'

//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航数组
    catesList:[],
    // 楼层数组
    floorList:[]
  },
  // 页面开始加载 就会触发
  //options(Object)
  onLoad: function(options){
    // 1 发送异步请求获取轮播图数据  优化手段可以通过es6的promise来解决问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    // });
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  async getSwiperList(){
    // 获取轮播图数据
    const res = await request({url:"/home/swiperdata"})
    // .then(result=>{
      this.setData({
          swiperList:res
        })
    // })
  },
  async getCateList(){
    // 获取 分类导航
    const res = await request({url:"/home/catitems"})
    // .then(result=>{
      this.setData({
          catesList:res
        })
    // })
  },
  async getFloorList(){
    // 获取 分类导航
    const res = await request({url:"/home/floordata"})
    // .then(result=>{
      this.setData({
          floorList:res
        })
    // })
  },
});