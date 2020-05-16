import React from 'react';
import { GlobalStyle } from './style';
import { IconStyle } from './assets/iconfont/iconfont';
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config'; //renderRoutes 读取路由配置转化为 Route 标签
import routes from './routes/index.js'
import store from './store/index'
import { Provider } from 'react-redux'
function App() {
  return (
    <Provider store={store} >
      <HashRouter>
        <div className="App">
          <GlobalStyle />
          <IconStyle/>
          { renderRoutes(routes)}
        </div>
      </HashRouter>
    </Provider>
  );
}

export default App;