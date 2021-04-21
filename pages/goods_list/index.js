// 引入用来发送请求的 方法 
import {request} from "../../requesst/index.js"
import regenertorRuntime from '../../lib/runtime/runtime'
// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    // 获取被点击的标题索引
    const {index} = e.detail;
    // 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    // 赋值到data
    this.setData({
      tabs
    })
  },
  // 获取商品列表
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams})
    const total = res.total
    this.totalPages= Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新   
    wx.stopPullDownRefresh()
  },
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '已经到底了'
      });
    }else{
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum=1
    this.getGoodsList()
  }
})