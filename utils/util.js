const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将时间字符串转换为时间戳
 * @param {*} timeString 
 */
const timeStringConvertToTimeStamp = (timeString) => {
  let date = new Date(timeString);
  return date.getTime();
}

/**
 * 返回n天后的时间格式yyyy-MM-dd
 * @param {*} n 今天为0，明天1，昨天-1,以此类推
 */
const getNDayTimeString = (n = 0) => {
  let date = new Date(new Date().getTime() + n * 1000 * 60 * 60 * 24);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  return Y + M + D;
}

/**
 * 获取n天后凌晨0点的时间戳
 * @param {*} n 今天为0，明天1，昨天-1,以此类推
 */
const getNDaysTimeStamp = (n) => {
  return new Date(new Date().setHours(0, 0, 0, 0)).getTime() + n * 1000 * 60 * 60 * 24;
}

module.exports = {
  formatTime: formatTime,
  timeStringConvertToTimeStamp: timeStringConvertToTimeStamp,
  getNDayTimeString: getNDayTimeString,
  getNDaysTimeStamp: getNDaysTimeStamp,
}
