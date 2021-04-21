// 引入用来发送请求的 方法 
import {request} from "../../requesst/index.js"
import regenertorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },
  async getGoodsDetail(goods_id){
    const res = await request({url:'/goods/detail',data:{goods_id}})
    this.GoodsInfo= res
    this.setData({
      goodsObj:{
        goods_name:res.goods_name,
        goods_price:res.goods_price,
        goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.pics
      }
    })
  },
    // 点击轮播图预览
  handlePreviewImage(e){
    // 先构造要预览的 数组图片
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid)
    // 接受传递过来的图片url
    const current=e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    });
  },
  handleCartAdd(){
    // 1获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    // 2判断 商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //3 不存在
      this.GoodsInfo.num=1
      this.GoodsInfo.checked=true
      cart.push(this.GoodsInfo)
    }else{
      // 4已经存在购物车数据
      cart[index].num++
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  }
})