<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swp-page swiper-slide" v-for="list in lists">
        <a class="js-no-follow" v-bind:href="lists.clickUrl">
          <img class="goods-main-photo fadeIn" :src="list.img">
        </a>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div> 
</template>
 
<style>
  .swiper-slide img{
    height: 100%;
    width: 100%;
  }
</style>

<script>
//swiper对dom节点进行操作的, dom节点什么时候生成?
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'

export default {
  name: 'swipe',
  //props: ['lists'],
  props: {
    lists: {
      type: Array,
      required: true
    },
    name: {}
  },
  created(){
  },
  mounted(){
    new Swiper('.swiper-container',{   //处理要处理的节点
      loop: true, //自动轮播
      pagination: {
        el:'.swiper-pagination'
      }
    })
  },
}
</script>
