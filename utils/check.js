// 判断是否是手机号码
function isValidPhone(str) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if(myreg === ""){
    return false;
  }else if(!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}  

function isValidMail(str) {
  var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; //正则表达式
　　if(str === ""){ //输入不能为空
　　　　return true;
　　}else if(!reg.test(str)){ //正则验证不通过，格式不对
　　　　return false;
　　}else{
　　　　return true;
　　}
}

function isValidDate(str) {
  var reg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/;
  if(str === ""){
　　　return false;
　　}else if(!reg.test(str)){ //正则验证不通过，格式不对
　　　return false;
　　}else{
　　　return true;
　　}
}

function isValidSex(str) {
  if(str==="男"){
    return true
  }else if(str==="女"){
    return true
  }else{
    return false
  }
}

function isValidCode(str) {
  var reg = /\d{17}[\d|x]|\d{15}/;
  if(str === ""){
　　　return true;
　　}else if(!reg.test(str)){ //正则验证不通过，格式不对
　　　return false;
　　}else{
　　　return true;
　　}
}
module.exports = {
  isValidPhone,
  isValidMail,
  isValidDate,
  isValidSex,
  isValidCode
}