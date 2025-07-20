(function(doc, win) {
    var docEl = doc.documentElement
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    var recalc = function() {
      var clientWidth = docEl.clientWidth
      var size =1440;
      if (!clientWidth) return
      console.log(clientWidth)
      
        docEl.style.fontSize = 100 * (clientWidth /size) + 'px'
      
      
    }
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
  })(document, window)