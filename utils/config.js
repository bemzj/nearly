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
    exchangeName: "index/user/postName",//修改姓名
    exchangeSex: "index/user/postSex",//修改性别
    getNews: "index/message/getMessage", //获取消息
    getRead:"index/message/isRead", //是否已查阅
    getCollect:"index/collect/getCollect", //获取收藏
    delCollect:"index/collect/delCollect",//删除收藏
    hasApply: "index/apply/getApply",//是否成为申请
    getBrowser: "index/personal/getPersonal"//获取浏览量
    
}
module.exports = {
    api,
    config,
}