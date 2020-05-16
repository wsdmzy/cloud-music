## 
styled-components
  1. 压缩你的样式代码（Compressed Styles）。
  2. 写出更清爽的JSX代码（Clearer JSX）。
  3. 实现样式的组合与继承（Composing Styles）
  4. 属性过滤（Prop filtering）


forwardRef
  将ref以props的形式传递到组件内，也就是说组件可以接收到一个叫做forwardRef的props，通常用此方法获取组件内的dom

  useImperativeHandle和forwardRef同时使用，减少暴露给父组件的属性，避免使用 ref 这样的命令式代码

图片懒加载
  react-lazyload  图片未显示的时候给它一个默认的 src，让一张非常精简的图片占位

redux-thunk 可以让 store.dispatch 变成可以接收一个函数/一个对象的中间件