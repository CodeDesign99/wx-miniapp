import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"

// pages/cart/index.js
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    // 获取缓存中购物车数据
    const cart=wx.getStorageSync("cart")||[];
    this.setData({address})
    this.setCart(cart)
  },

  // 点击 收货地址
  async handleChooseAddress(){
    // wx.getSetting({
    //   success: (result)=>{
    //     const scopeAddress=result.authSetting["scope.address"]
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1)
    //         }
    //       });
    //     }else{
    //       wx.openSetting({
    //         success: (result2)=>{
    //           wx.chooseAddress({
    //         success: (result3)=>{
    //           console.log(result3)
    //         }
    //       });
    //         }
    //       });
    //     }
    //   }
    // });

  try {
      //1获取权限状态
    const res1 = await getSetting()
    const scopeAddress = res1.authSetting["scope.address"]
    // 2判断 权限状态
    if(scopeAddress===false){
      // 3引导用户打开授权页面
      await openSetting()
    }
  // 4 调用获取收货地址的api
      const address = await chooseAddress()
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo

      // 5 存入到缓存中
      wx.setStorageSync("address", address);
  } catch (error) {
    console.log(error)
  }
  },
  // 商品选中
  handlItemChange(e){
    // 获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    // 选中取反
    cart[index].checked=!cart[index].checked
    // 把购物车数据重新设置回data中和缓存中
    this.setCart(cart)
  },
  setCart(cart){
  let allChecked=true
      // 总价格 总数量
      let totalPrice=0
      let totalNum=0
      cart.forEach(v => {
        if(v.checked){
          totalPrice+=v.num*v.goods_price
          totalNum+=v.num
        }else{
          allChecked=false
        }
      })
      allChecked=cart.length!=0?allChecked:false
      this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync("cart", cart);
  },
  // 商品的全选功能
  handlItemAllChecked(){
    // 获取data中的数据
  let {cart,allChecked} = this.data
  // 修改值
  allChecked =! allChecked
  // 循环cart数组中的商品选中状态
  cart.forEach(v=>v.checked=allChecked)
  // 修改后的值 填充回data或者缓存中
  this.setCart(cart)
  },
  // 商品数量编辑
  async handleItemNumEdit(e){
    // 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset
    // 获取购物车数组
    let {cart} =this.data
    // 找到需要修改的商品索引
    const index = cart.findIndex(v=>v.goods_id===id)
    // 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      // 弹窗提示
      const res = await showModal({content:'您要删除商品吗？'})
      if (res.confirm) {
          cart.splice(index,1)
          this.setCart(cart)
        }
    }else{
      // 进行修改数量
      cart[index].num+=operation
      // 设置回缓存和data中
      this.setCart(cart)
    }
  },
  // 点击 结算
  async handlePay(){
    // 判断收货地址
    const {address,totalNum}=this.data
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'})
      return
    }
    // 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:'您还没有选购商品'})
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})