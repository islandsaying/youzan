let url = {
    hotLists: '/index/hotLists',
    banner: '/index/banner',
    topList: '/category/topList',
    subList:'/category/subList',
    rank:'/category/rank',
    searchList: '/search/list',
    details: '/goods/details',
    deal: '/goods/deal',
    addCart: 'cart/add',
    cartLists:'/cart/list',
    cartReduce:'/cart/reduce',
    cartRemove:'/cart/remove',
    cartMrremove:'/cart/mrremove',

};

// 开发环境和真实环境的切换
let host = 'http://rap2api.taobao.org/app/mock/7058';
//let host = 'https://easy-mock.com/mock/5cdf9e46ca410e607a1193b3/youzan'

for(let  key in url){
    if(url.hasOwnProperty(key)){
        url[key] = host + url[key]
    }
}


export default url
