const config = {
    route: 'https://jing.hengdikeji.com/',
    routeImg: 'https://jing.hengdikeji.com/public',
    token: 'safdsf2342%^@#@#@#ss`1`ljkjlkl&&888**',
}
const api = {
    getUserInfo: 'index/wechat/getUserinfo', // 获取用户信息
    getIndexBanner:'index/index/getPics' ,//获取首页banner图
    getIndexType:'index/index/getCates',//获取首页分类
    getIndexShop:'index/index/getShop',//获取首页门店
    getUserStatus: 'index/wechat/isset',//获取用户信息
    exchangePhone:"index/user/postPhone",//修改手机号
    exchangeName: "index/user/postName"//修改姓名
}
module.exports = {
    api,
    config,
}