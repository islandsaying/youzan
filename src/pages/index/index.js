import 'css/common.css'
import './index.css'
import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'

import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);

import Foot from 'components/Foot.vue'
import Swipe from 'components/Swipe.vue'

let app = new Vue({
    el: '#app',
    data: {
        lists: null,
        pageNum: 1,
        pageSize: 6,
        loading: false, //true表示可以加载
        allLoaded: false, //是否完全加载
        bannerLists: null
    },
    created(){
        this.getLists();
        this.getBanner()
    },
    methods: {
        //是否在加载中
        getLists() {
            if(this.allLoaded) return;
            this.loading = true; //不作重复请求
            axios.get(url.hotLists,{
                pageNum : this.pageNum,
                pageSize: this.pageSize
            }).then(res => {
                let curLists = res.data.lists
                //判断所有数据是否加载完毕
                if(curLists.length < this.pageSize){
                    this.allLoaded = true
                }
                //如果不这么写,数据只会在页面刷新,而不是增加刷新
                if(this.lists) {
                    this.lists = this.lists.concat(curLists)
                } else{
                    //第一次请求数据
                    this.lists = curLists
                }
                this.loading = false;  //请求完之后才允许再次请求
                this.pageNum++
            })
        },
        getBanner(){
            axios.get(url.banner).then(res => {
                this.bannerLists = res.data.lists
            })
        },
    },
    components:{
        Foot,
        Swipe
    }
})
