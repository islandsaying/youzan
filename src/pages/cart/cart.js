import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import Velocity from 'velocity-animate'
import Cart from 'js/cartService.js'
import fetch from 'js/fetch.js'

let startX = 0;
let endX = 0;

new Vue({
  el:'.container',
  data:{
    lists:null,
    total:0,
    editingShop:null,
    editingShopIndex:-1,
    removePopup:false,
    removeData:null,
    removeMsg:'',
  },
  computed:{
    allSelected:{ // allSelected正常情况下全选
      get(){      //判断店铺进而判断全选状态
        if(this.lists&&this.lists.length){
          return this.lists.every(shop=>{  //判断店铺的checked
            return shop.checked
          })
        }
        return false
      },
      set(newVal){  //全选状态决定店铺和商品状态
        this.lists.forEach(shop=>{
          shop.checked = newVal
          shop.goodsList.forEach(good=>{
            good.checked = newVal
          })
        })
      }
    },
    allRemoveSelected:{
      get(){
        if(this.editingShop){
          return this.editingShop.removeChecked
        }
        return false
      },
      set(newVal){
        if(this.editingShop){
          this.editingShop.removeChecked = newVal
          this.editingShop.goodsList.forEach(good=>{
            good.removeChecked = newVal
          })
        }
      }
    },
    // 这是为了之后准备
    selectLists(){  //selectLists正常情况选中的商品列表
      if(this.lists&&this.lists.length){
        let arr = []
        let total  = 0
        this.lists.forEach(shop=>{
          shop.goodsList.forEach(good=>{
            if(good.checked){
              arr.push(good)
              total += good.price * good.number
            }
          })
        })
        this.total = total
        return arr
      }
      return []
    }, 
    removeLists(){ //编辑情况下商品选中--要删除的商品列表
      if(this.editingShop){
        let arr = []
        this.editingShop.goodsList.forEach(good=>{
          if(good.removeChecked){
            arr.push(good)
          }
        })
        return arr
      }
      return []
    },
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      axios.get(url.cartLists).then(res => {
        let lists = res.data.cartList
        lists.forEach(shop=>{
          shop.checked = true
          shop.removeChecked = false
          shop.editing = false
          shop.editingMsg = '编辑'
          shop.goodsList.forEach(good=>{
            good.checked = true
            good.removeChecked = false
          })
        })
        this.lists = lists
      })
    },
    selectGood(shop,good){
      let attr = this.editingShop ? 'removeChecked' : 'checked' //判断是在编辑还是正常状态下 
      good[attr] = !good[attr]
      shop[attr] = shop.goodsList.every(good=>{
        return good[attr]
      })
    },
    selectShop(shop){
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      shop[attr] = !shop[attr]
      shop.goodsList.forEach(good=>{
        good[attr] = shop[attr]
      })
    },
    selectAll(){
      let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected' //allRemoveSelected默认是false，当点击selctAll取反了 变成true
      this[attr] = !this[attr]
    },
    //正常状态和编辑状态的切换
    edit(shop,shopIndex){
      shop.editing = !shop.editing
      shop.editingMsg = shop.editing ? '完成':'编辑'
      this.lists.forEach((item,i)=>{
        item.goodsList.forEach(good=>{
          let ele = this.$refs[`goods-${good.id}`][0]
					ele.style.transform = 'translateX(0)';
        })
        if(shopIndex !== i){
          item.editing = false
          item.editingMsg = shop.editing ? '':'编辑'  
        }
      })
      this.editingShop = shop.editing ? shop : null
      this.editingShopIndex = shop.editing ? shopIndex : -1
      
    },
    add(good){
      // axios.post(url.addCart,{
      //   id:good.id,
      //   number:1
      // }).then(res=>{
      //   good.number++
      // })
      Cart.add(good.id).then(res=>{
        good.number++
      })
    },
    reduce(good){
      // if(good.number===1)return
      // axios.post(url.cartReduce,{
      //   id:good.id,
      //   number:1
      // }).then(res=>{
      //   good.number--
      // })
      if(good.number===1)return
      good.number--

    },
    //单删
    remove(shop,shopIndex,good,goodIndex){
      this.removePopup = true
      this.removeData = {shop,shopIndex,good,goodIndex}
      this.removeMsg = '确定要删除该商品吗？'
    },
    //删除多个
    removeList(){
      this.removePopup = true
      this.removeMsg = `确定将所选${this.removeLists.length}个商品删除？`
    },
    removeConfirm(){
      if(this.removeMsg === '确定要删除该商品吗？'){
        let {shop,shopIndex,good,goodIndex} = this.removeData
        fetch(url.cartRemove,{
          id:good.id
        }).then(res=>{
          shop.goodsList.splice(goodIndex,1)
          if(!shop.goodsList.length){
            this.lists.splice(shopIndex,1)
            this.removeShop()
          }
          this.removePopup = false
          let ele = this.$refs[`goods-${good.id}`][0]
          ele.style.transform = 'translateX(0)'
        })
      }else{
        let ids = []
        this.removeLists.forEach(good=>{
          ids.push(good.id)
        })
        axios.post(url.cartMrremove,{
          ids
        }).then(res=>{
          let arr = []
          this.editingShop.goodsList.forEach(good=>{
            let index = this.removeLists.findIndex(item=>{
              return item.id == good.id 
            })
            if(index === -1){
              arr.push(good)
            }
          })
          if(arr.length){
            this.editingShop.goodsList = arr
          }else{
            this.lists.splice(this.editingShopIndex,1)
            this.removeShop()
          }
          this.removePopup = false
        })
      }
    },
    removeShop(){
      this.editingShop = null,
      this.editingShopIndex = -1,
      this.lists.forEach(shop=>{
        shop.editing = false
        shop.editingMsg = '编辑'
      })
    },
    start(e){
       startX = e.changedTouches[0].clientX
    },
    end(e,good){
      endX = e.changedTouches[0].clientX
      if(!this.editingShop){ //不是在编辑状态才能执行这个
        let ele = this.$refs[`goods-${good.id}`][0]
        if(startX - endX > 100){
          ele.style.transform = 'translateX(-60px)'
        }else if(endX - startX> 100){
          ele.style.transform = 'translateX(0)'
        }
      }
    }
  },
  filters:{
    numFilter(price){
      return price.toFixed(2)
    }
  },
})