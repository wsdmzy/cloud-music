import { combineReducers } from 'redux-immutable'
// 每个莫i快的reducer  建议放到组件模块下
// import { reducer as recommendReducer } from '../application/Recommend/store/index'
import recommendReducer from '../application/Recommend/store/index'
// console.log(recommendReducer)
// reducer   将各个模块reducer汇合成一个reducer
export default combineReducers({
  // 之后开发具体功能模块的时候添加reducer
  // recommend: recommendReducer
  recommend: recommendReducer.reducer
})