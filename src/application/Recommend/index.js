import React, { useEffect } from 'react';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import { Content } from './style.js';
// 将状态 map UI connect prop
import  Slider  from '../../components/slider'
import  RecommendList  from '../../components/list'
import Scroll from '../../baseUI/scroll'

// 函数表征型组件
function Recommend(props){

  //mock 数据
  const bannerList = [1,2,3,4].map (item => {
    return { imageUrl: "http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg" }
  });

  const recommendList = [1,2,3,4,5,6,7,8,9,10].map (item => {
    return {
      id: 1,
      picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
      playCount: 17171122,
      name: "朴树、许巍、李健、郑钧、老狼、赵雷"
    }
  });
 
  useEffect(() => {
    // if(!bannerList.size){
      // getBannerDataDispatch();
    // }
  }, [])

  return (
    <Content>
       
         <Scroll className="list">
           
        <div>
          <Slider bannerList={bannerList}></Slider>
          
          <RecommendList recommendList={recommendList} />
          
        </div>
        </Scroll>
        
    </Content>
  );
}

const mapStateToProps = (state) => ({
  // 不要再这里将数据toJS,不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染, 属于滥用immutable
  bannerList: state.getIn(['recommend', 'bannerList'])
});
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      // vuex  action-types  
      dispatch(actionTypes.getBannerList());
    },
  }
}
// React.memo  性能优化， props 更新时才会重绘
// HOC 组件 高阶组件 装饰器
// export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));

export default React.memo(Recommend)