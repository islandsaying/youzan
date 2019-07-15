//使用vuex插件
import Vue from 'vue'
import Vuex from 'vuex'
import Address from 'js/addressService.js'
import axios from 'axios'
import url from 'js/api.js'
import { Stats } from 'fs';
Vue.use(Vuex)

//创建store实例
const store = new Vuex.Store({
  //类似data
  state:{
    lists:null
  },
  //对数据同步管理
  mutations: {
    init(state,lists){
      state.lists = lists
    },
    add(state,instance){
      state.lists.push(instance)
    },
    remove(state,id){
      let lists = state.lists
      let index = lists.findIndex(item=>{
        return item.id === id
      })
      lists.splice(index,1)
    },
    update(state,instance){
      let lists = JSON.parse(JSON.stringify(state.lists))
      let index = lists.findIndex(item=>{
        return item.id === instance.id
      })
      lists[index] = instance
      state.lists = lists
    },
    setDefault(state,id){
      let lists = state.lists
      lists.forEach(item=>{
        item.isDefault = item.id === id ? true : false
      })
    }
  },
  //异步操作
  actions:{
    // 这个写在all.vue
    getLists({commit}){
      // Address.list().then(res=>{
      //   commit('init',res.data.lists)
      // })
      axios.get(url.addressList).then(res=>{
        commit('init',res.data.lists)
      })
    },
    //下面的调用写在form.js
    addAction({commit},instance){
      Address.add(instance).then(res=>{
        //模拟添加id,其实instance最后后台返回
        instance.id = parseInt(Math.random()*10000)
        commit('add',instance)
      })
    },
    removeAction({commit},id){
      Address.remove(id).then(res=>{
        commit('remove',id)
      })
    },
    updateAction({commit},instance){
      Address.update(instance).then(res=>{
        commit('update',instance)
      })
    },
    setDefaultAction({commit},id){
      Address.setDefault(id).then(res=>{
        commit('setDefault',id)
      })
    }
    
  }
})

export default store