// src/utils/utils.js

/**
 * 获取当前时间、年份、月份、日期以及星期几
 * @returns {Object} 包含时间（HH:mm:ss）、年份、月份、日期、星期几的信息
 */
export function getTimeDetails() {
    const now = new Date();
  
    // 获取当前时间（HH:mm:ss）
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
  
    // 获取年份（YYYY）
    const year = now.getFullYear();
  
    // 获取月份（MM），月份是从0开始的，所以需要加1
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
    // 获取日期（DD）
    const day = now.getDate().toString().padStart(2, '0');
  
    // 获取星期几（0-6），这里将英文改为中文
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayOfWeek = weekdays[now.getDay()];
  
    // 格式化日期为 2024年 12月 31日
    const formattedDate = `${year}年 ${month}月 ${day}日`;
  
    return {
      time: timeString,
      year: formattedDate,
      dayOfWeek: dayOfWeek,
    };
  }
  
  /**
   * 使用 requestAnimationFrame 实时更新时间
   * @param {Function} callback 更新数据的回调函数
   * @returns {Function} 返回一个停止动画的函数
   */
  export function startRealTimeUpdate(callback) {
    let animationFrameId;
  
    // 更新数据并请求下一帧
    function animate() {
      callback(getTimeDetails()); // 调用回调函数，传递时间详情
      animationFrameId = requestAnimationFrame(animate); // 下一帧继续调用
    }
  
    // 启动动画
    animate();
  
    // 返回一个停止动画的函数
    return function stop() {
      cancelAnimationFrame(animationFrameId); // 停止动画
    };
  }
  