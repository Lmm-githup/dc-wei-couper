// API根域名
// 开发测试时使用
var WxApiRoot = 'https://member.fingercrm.cn/wxscrm/';//德成
// 正式上线时使用
// var WxApiRoot = 'https://www.anewffd.com/wx/';

module.exports = {
  // 获取openid
  getOpenId: WxApiRoot + 'api/auth.php?api=wxcode',
  // 通过getUserInfo获取openid和uid
  getOpenIdElese: WxApiRoot + 'api/auth.php?api=getUserInfo',
  // 获取手机号
  getPhoneNumber: WxApiRoot + 'api/auth.php?api=getPhoneNumber',
  // 查询会员情况
  queryoauth: WxApiRoot + 'api/auth.php?api=queryoauth2',
  // 绑定手机号
  register: WxApiRoot + 'api/auth.php?api=register',
  // 获取短信验证码
  sendsms: WxApiRoot + 'api/auth.php?api=sendSMS',
  // 注册、登录
  login: WxApiRoot + 'api/auth.php?api=login',
  // 首页获取用户信息
  memberinfo: WxApiRoot + 'api/member.php?api=memberinfo',
  // 绑定导购
  addGuide: WxApiRoot + 'api/auth.php?api=memberBinding',
  // 查询导购员信息
  guideInfo: WxApiRoot + 'api/member.php?api=guide_info',
  // 修改绑定的手机号
  changePhone: WxApiRoot + 'api/member.php?api=modifyphone',
  // 修改个人信息
  changePer: WxApiRoot + 'api/member.php?api=modifybasicinfo',
  // 积分明细
  myintegralall: WxApiRoot + 'api/member.php?api=myintegralall',
  // 获得的积分
  myintegraladd: WxApiRoot + 'api/member.php?api=myintegraladd',
  // 支出的积分
  myintegralreduce: WxApiRoot + "api/member.php?api=myintegralreduce",
  // 今日签到
  signin: WxApiRoot + 'api/member.php?api=signin',
  // 签到页面信息
  signinInfo: WxApiRoot + 'api/member.php?api=signin_info',
  // 会员码
  qrcode: WxApiRoot + 'api/member.php?api=member_qrcode',
  // 历史订单
  myOrder: WxApiRoot + 'api/member.php?api=myorder',
  // 评价历史订单
  subOrder: WxApiRoot + 'api/member.php?api=order_evaluate',
  // 家庭卡是否开卡
  openCard: WxApiRoot + 'api/familycard.php?api=open_card',
  // 家庭卡成员列表
  myCard: WxApiRoot + 'api/familycard.php?api=my_card',
  // 邀请绑定时的家庭卡详情
  CardDetail: WxApiRoot + 'api/familycard.php?api=card_info',
  // 家庭卡成员绑定
  BindCard: WxApiRoot + 'api/familycard.php?api=bind_card',
  // 家庭卡修改
  editCard: WxApiRoot + 'api/familycard.php?api=edit_card',
  // 家庭成员添加
  addCard: WxApiRoot + 'api/familycard.php?api=add_card',
  // 退出家庭卡
  cardExit: WxApiRoot + 'api/familycard.php?api=card_exit',
  // 附近门店
  storeList: WxApiRoot + 'api/health.php?api=store_org',
  // 门店详情
  storeDetail: WxApiRoot + 'api/health.php?api=store_org_info',
  // 用药提醒 标签列表
  tagList: WxApiRoot + 'api/health.php?api=medicate_tag',
  // 用药提醒内容
  medicineReminder: WxApiRoot + 'api/health.php?api=medicine_reminder',
  // 关注标签，取消关注
  trueTag: WxApiRoot + 'api/health.php?api=medicate_tag_subscribe',
  // 药品搜索记录
  medicineLog: WxApiRoot + 'api/health.php?api=searchlog_medicine',
  // 药品查询
  findMedicine: WxApiRoot + 'api/health.php?api=search_medicine',
  // 药品详情
  medicineDetail: WxApiRoot + 'api/health.php?api=medicine_info',
  // 找药申请(monitor_save)
  medicateForm: WxApiRoot + 'api/health.php?api=apply_medicine',
  // 找药申请记录
  medicateFormLog: WxApiRoot + 'api/health.php?api=apply_medicine_listing',
  // 找药申请记录详情
  medicateFormLogDetail: WxApiRoot + 'api/health.php?api=apply_medicine_info',
  // 附近门店
  medicateStore: WxApiRoot + 'api/health.php?api=search_medicine_store',
  // 会员权益
  rights: WxApiRoot + 'api/auth.php?api=member_rights',
  // 意见反馈 类型列表
  feedbackType: WxApiRoot + 'api/health.php?api=feedback_type',
  // 提交反馈
  subFeedback: WxApiRoot + 'api/health.php?api=feedback_save',
  // 反馈记录列表
  feedbackList: WxApiRoot + 'api/health.php?api=feedback_listing',
  // 意见反馈详情
  feedbackDetail:WxApiRoot + 'api/health.php?api=feedback_info',
  // 获取等级 值域
  setting: WxApiRoot + 'api/auth.php?api=systemSetting',
  // 优惠券 我的券
  couponMine: WxApiRoot + 'api/member.php?api=myvoucher',
  // 优惠券 我的券 详情
  couponDetail: WxApiRoot + 'api/member.php?api=myvoucher_info',
  // 可领取优惠券 详情
  elcouponDetail: WxApiRoot + 'api/member.php?api=avail_voucher_info',
  // 优惠券 领券中心
  couponCenter: WxApiRoot + 'api/member.php?api=avail_voucher',
  // 领取优惠券
  chooseCoupon: WxApiRoot + 'api/member.php?api=avail_voucher_drew',
  // 健康服务提交信息
  monitorSave: WxApiRoot + 'api/health.php?api=monitor_save',
  // 健康数据分析
  hFx: WxApiRoot + 'api/health.php?api=monitor_listing',
  // 健康天数
  healday: WxApiRoot + 'api/health.php?api=monitor_days',
  // 图片上传接口(一次上传1张图片)
  uploadImg: WxApiRoot + 'api/auth.php?api=photoupload',
  // 获取海报接口
  getPaper: WxApiRoot + 'api/auth.php?api=playbill_info',
  // 小程序审核专用账户
  demoPhoneLogin: WxApiRoot + 'api/auth.php?api=login',
  // 惠享banner
  huixBanner: WxApiRoot + 'api/auth.php?api=banner_list',
  // 意见反馈回复 + 找药申请 阅读状态
  read_state: WxApiRoot + 'api/health.php?api=sync_read_state',
  // 是否关注公众号
  isGz: WxApiRoot + 'api/auth.php?api=follow_check',
  // 小程序扫码log
  scanlog: WxApiRoot + 'api/apidebug.php?api=scanlog',
  // 打印debug
  writeLog: WxApiRoot + 'api/apidebug.php?api=debuglog'
}