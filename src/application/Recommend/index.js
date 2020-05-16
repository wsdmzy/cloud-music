import React, { useEffect } from 'react';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import { Content } from './style.js';
// 将状态 map UI connect prop
import  Slider  from '../../components/slider'
import  RecommendList  from '../../components/list'
import Scroll from '../../baseUI/scroll'
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading/index';

// 函数表征型组件
function Recommend(props){
  const { bannerList, recommendList, enterLoading } = props

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props

  useEffect(() => {
    // 如果redux中有数据，就不发请求
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }   
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []
  return (
    <Content>
      <Scroll className="list"  onScroll={forceCheck}>      
        <div>
          <Slider bannerList={bannerListJS}></Slider> 
          <RecommendList recommendList={recommendListJS} />   
        </div>
      </Scroll>
      { enterLoading ? <Loading></Loading> : null }
    </Content>
  );
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  // 不要再这里将数据toJS,不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染, 属于滥用immutable
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn (['recommend', 'enterLoading'])
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList())
    }
  }
}
// React.memo  性能优化， props 更新时才会重绘
// HOC 组件 高阶组件 装饰器   将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));

// export default React.memo(Recommend)