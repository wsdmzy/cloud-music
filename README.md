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
  forceCheck 配合滚动

redux-thunk 可以让 store.dispatch 变成可以接收一个函数/一个对象的中间件


redux 和 hooks
 hooks 能模拟 redux 的核心功能，但是能够取代 redux 近期还不太可能
 1.  redux 有非常成熟的状态跟踪调试工具，redux-devtools 插件
 2. redux 有非常成熟的数据模块化方案，不同模块的 reducer 直接导出，在全局的 store 中，调一下 redux 自带的 combineReducer 即可，目前从官方的角度看 hooks 这方面并不成熟。
 3. Redux 拥有成熟且强大的中间件功能，如 redux-logger, redux-thunk, redux-saga，用 hooks 实现中间件的功能就只能靠自己手动实现了。
缺点： 繁重的模板代码，需要 react-redux 引入徒增项目包大小


动画切入效果
  1. 设定 transfrom 的固定点，接下来的动画都是绕这个点旋转或平移
  2. 设置 rotateZ 的值，让整个页面能够拥有 Z 坐标方向的矢量

useMemo()
把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

useCallback
  将传给子组件的函数用 useCallback 包裹，这也是 useCallback 的常用场景。
  如果不用 useCallback 包裹，父组件每次执行时会生成不一样的函数引用
  因此 useCallback 能够帮我们在依赖不变的情况保持一样的函数引用，最大程度地节约浏览器渲染性能。

create-keyframe-animation js实现帧动画

如果频繁切换歌曲，会出现这样的异常
  其实从 audio 标签拿到 src 加载到能够播放之间有一个缓冲的过程，只有当控件能够播放时才能够切到下一首。如果在这个缓冲过程中切歌就会报错。