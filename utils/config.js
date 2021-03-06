const config = {
    route: 'https://jing.hengdikeji.com/',
    routeImg: 'https://jing.hengdikeji.com/public',
    token: 'safdsf2342%^@#@#@#ss`1`ljkjlkl&&888**',
}
const api = {
    getUserCode:'index/wechat/index',//获取用户uid
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
    getBrowser: "index/personal/getPersonal",//获取浏览量
    getCode: "index/register/getCode",//获取验证码
    register:"index/register/postRegister",//注册验证码
    getTypes:"index/cates/getCates", //获取分类信息
    getCardIntro:"index/vip/getVip", //获取会员卡信息  
    getAddress: "index/address/getAddress", //获取地址
    delAddress: "index/address/delAddress", //删除地址
    postAddress: "index/address/postAddress", //添加和修改地址
    uploadPic: "index/shop/postPic", //上传图片
    addBrowse: "index/index/postBrowse", //增加浏览次数
    collect: "index/collect/postCollect" ,//点击收藏
    applyShop: "index/apply/postApply", //申请商家
    getMile:"index/cates/getMileage",//获取公里数
    getShopMsg:"index/shop/getShop", //获取门店信息
    setShopMsg:"index/shop/postShop",//添加+修改门店
    getActivity: "index/activity/getActivity",//获取活动列表
    applyActivity: "index/activity/postActivity",//添加活动
    buyVip: "index/vip/buyVip",//购买会员
    paySuccess: "index/vip/paySuccess",//购买成功
    getLogo:"index/register/getLogo" //获取logo
}
module.exports = {
    api,
    config,
}