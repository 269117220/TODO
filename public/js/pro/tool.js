
/*获取当前时间*/
function getCurrTime(){
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
        month=(month>=1||month<=9)?('0'+month):month
    var day=date.getDate();
    var hours=date.getHours();
    var minus=date.getMinutes();
    var currDate=year+'-'+month+'-'+day+' '+hours+':'+minus;
    return currDate;
}
/*Polyfill:includes*/
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

