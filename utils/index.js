export function asyncLoadJs(url, isForceLoad) {
  return new Promise(resolve=>{
    if (!isForceLoad) {
      let scripts = document.querySelectorAll('script')
      scripts = Array.from(scripts)
      let tempArr = []
      for(let i = 0, len = scripts.length; i<len; i++) {
        if (scripts[i].src === url) {
          tempArr.push(scripts[i].src)
        }
      }
      if (tempArr.indexOf(url) > -1) {
        resolve()
        return
      }
    }

    let elem = document.createElement('script')
    elem.src = url
    document.body.appendChild(elem)
    elem.onload = ()=>{
      resolve()
    }
  })
}

export function count (num, callback) {
  let _time = 0
  let count = setInterval(()=>{
    _time++
    if (_time > num) {
      callback();
      clearInterval(count);
    }
  }, 1000)
}
