export const getCount = count => {
  if (count < 0) return
  if (count < 10000) {
    return count
  } else if (Math.floor(count/10000) < 10000) {
    return Math.floor(count/1000)/10 + "万"
  } else {
    return Math.floor(count/10000000)/ 10 + "亿"
  }
}

export const debounce = (func, delay = 1000) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}