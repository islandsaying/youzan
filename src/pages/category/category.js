import "css/common.css"
import "./category.css"
import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'

import Foot from 'components/Foot.vue'

new Vue({
    el:'#app',
    data:{
        topList: null,
        topIndex: 0,  //初始放在综合排行
        subData: null,
        rankData: ""   //null也有数据,但是报错,所以改成了""
    },
    created(){
        this.getTopList();
        this.getSubList(0,0);
    },
    methods:{
        getTopList(){
            axios.get(url.topList).then(res => {
                this.topList = res.data.lists
            }).catch(err => {
                alert(err)
            })
        },
        getSubList(index,id){
            this.topIndex = index;
            if(index === 0){
              this.getRank()
            }else{
              axios.get(url.subList,{id:id}).then(res => {
                this.subData = res.data.data   //根据封装数据的实际情况来,此处为data
              })
            }
        },
        getRank(){
          axios.get(url.rank).then(res => {
            this.rankData = res.data.data   //根据封装数据的实际情况来,此处为data
          })
        },
        toSearch(list){
          location.href = `search.html?keyword=${list.name}&id=${list.id}`
        }
    },
    components:{
        Foot,
    },
    filters:{
      numFilter(price){
        return price.toFixed(2)
      }
    }
})
