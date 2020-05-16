import { createStore, compose, applyMiddleware } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk' 
// store使用了中间件middleware和增强器enhaners
const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  || compose;
// 单一状态数
// reducer reducer modules 合并城的
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk)
));

export default store;