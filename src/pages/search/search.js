import './search.css'
import 'css/common.css'

import  Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'
import Velocity from 'velocity-animate'

let {keyword,id} = qs.parse(location.search.substring(1));

new Vue({
  el: ".container",
  data:{
    searchList: null,
    isShow:false
  },
  created(){
    this.getSearchList()
  },
  methods:{
    getSearchList(){
      axios.get(url.searchList,{keyword,id}).then(res => {
        this.searchList = res.data.lists
      })
    },
    move(){
      if(document.body.scrollTop > 50){
        this.isShow = true
      }else{
        this.isShow = false
      }
    },
    toTop(){
      Velocity(document.body,'scroll',{duration:1000})
    }
  },
  filters:{
    numFilter(price){
      return price.toFixed(2)
    }
  }
})
