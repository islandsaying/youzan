import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'

import Vue from 'vue'
import url from 'js/api.js'
import axios from 'axios'
import qs from 'qs'


let {id} = qs.parse(location.search.substr(1)) //非常重要,贯穿整个页面的传递
let detailTab = ['商品详情','本店成交']


new Vue({
    el:'#app',
    data:{
        id,
        details: null,
        detailTab,
        tabIndex: 0, 
        dealLists: null
    },
    created(){
        console.log(1);
        this.getDetails()
    },
    methods:{
        getDetails(){
            axios.get(url.details,{id:this.id}).then(res => {
                this.details = res.data.data
                //console.log(this.details);
                //console.log(res.data.data);
                //console.log(res);
                //console.log(url)
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
    },
    filters:{
        numFilter(price){
          return price.toFixed(2)
        }
      }

})