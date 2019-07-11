import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods_transition.css'

import Vue from 'vue'
import url from 'js/api.js'
import axios from 'axios'
import qs from 'qs'
import Swipe from 'components/Swipe.vue'

let {id} = qs.parse(location.search.substr(1)) //非常重要,贯穿整个页面的传递
console.log(location.search)
console.log({id})
let detailTab = ['商品详情','本店成交']


new Vue({
    el:'#app',
    data:{
        id,
        details: null,
        detailTab,
        tabIndex: 0, 
        dealLists: null,
        bannerLists: null,
        skuType: 1,
        showSku: false,
        skuNum: 1,
        isAddCart : false , //有没有加入购物车
        showAddMessage: false
    },
    created(){
        this.getDetails()
    },
    methods:{
        getDetails(){
            axios.get(url.details,{id}).then(res => {
                this.details = res.data.data
                //console.log(res);
                //console.log(res.data);
                //console.log(res.data.data)
                this.bannerLists = []
                this.details.imgs.forEach(item=>{  //获取的imgs是一个Array
                    this.bannerLists.push({
                        clickUrl:'',
                        img:item
                    })
                })
            })
        },
        getDeal(){
            axios.get(url.deal,{id}).then(res => {
                this.dealLists = res.data.data.lists
            })
        },
        changeTab(index){
            this.tabIndex = index
            if(index){
                this.getDeal()
            }
        },
        chooseSku(type){
            this.skuType = type
            this.showSku = true
        },
        changeSkuNum(num){
            if(num<0 && this.skuNum === 1)return
            this.skuNum === 1
        },
        addCart(){
            axios.post(url.addCart,{
                id,
                number: this.skuNum
            }).then(res => {
                if(res.data.status === 200){
                    this.showSku = false
                    this.isAddCart = true
                    this.showAddMessage = true

                    setTimeout(() =>{
                        this.showAddMessage = false
                    },800)
                }
            })
        }
    },
    filters:{
        numFilter(price){
          return price.toFixed(2)
        }
    },
    components:{
        Swipe
    },
    watch:{
        showSku(val,oldVal){
            document.body.style.overflow = val ? 'hidden': 'auto'
            document.querySelector('html').style.overflow = val ? 'hidden' : 'auto'
            document.body.style.height = val ? '100%' : 'auto'
            document.querySelector('html').style.height = val ? '100%' : 'auto'
        }
    }
})
