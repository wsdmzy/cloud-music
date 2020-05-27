import React, {useState, useEffect, useContext} from 'react';
import Horizen from '../../baseUI/horizen-item';
import { categoryTypes, alphaTypes } from '../../api/config';
import { 
  NavContainer,
  ListContainer,
  List,
  ListItem
} from "./style";
import Scroll from '../../baseUI/scroll';
import { 
  getSingerList, 
  getHotSingerList, 
  changeEnterLoading, 
  changePageCount, 
  refreshMoreSingerList, 
  changePullUpLoading, 
  changePullDownLoading, 
  refreshMoreHotSingerList 
} from './store/actionCreators';
import { connect } from "react-redux";
import Loading from '../../baseUI/loading';
import { CHANGE_ALPHA, CHANGE_CATEGORY, CategoryDataContext } from './data'
import { renderRoutes } from 'react-router-config';


function Singers (props) {
  
  let { singerList, enterLoading, pullUpLoading, pullDownLoading,pageCount, 
    getHotSingerDispatch, updateDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch } = props
  const { data, dispatch } = useContext(CategoryDataContext)
  const { category, alpha } = data.toJS()
  
  const enterDetail = id => {
    props.history.push(`/singers/${id}`)
  }

  const { songsCount } = props

  let handleUpdateAlpha = (val) => {
    // setAlpha (val);
    dispatch({type: CHANGE_ALPHA, data: val})
    updateDispatch(category, val)
  }

  let handleUpdateCatetory = (val) => {
    // setCategory (val);
    dispatch({type: CHANGE_CATEGORY, data: val})
    updateDispatch(val, alpha)
  }

  useEffect(() => {
    if (!singerList.length) {
      getHotSingerDispatch()
    }  
  }, [])

  const renderSingerList = () => {
    return (
      <List>
        {
          singerList.map((item, index) => {
            return (
              <ListItem key={item.img1v1Id + index } onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  const handlePullUp = () => {
    console.log("上拉加载")
    pullUpRefreshDispatch(category, alpha, category==='', pageCount)
  }

  const handlePullDown = () => {
    console.log("下拉刷新")
    pullDownRefreshDispatch(category, alpha)
  }

  return (
    <>
      <NavContainer>
        <Horizen 
          list={categoryTypes} 
          title={"分类 (默认热门):"} 
          handleClick={handleUpdateCatetory} 
          oldVal={category}></Horizen>
        <Horizen 
          list={alphaTypes} 
          title={"首字母:"} 
          handleClick={ handleUpdateAlpha} 
          oldVal={alpha}></Horizen>
      </NavContainer>
      <ListContainer play={songsCount}>
        <Scroll 
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          >
          { renderSingerList() }
        </Scroll>
        { enterLoading ? <Loading></Loading> : null }
      </ListContainer>
      { renderRoutes (props.route.routes) }
    </>
  )
}

const mapStateToProps = state => ({
  singerList: state.getIn(['singers', 'singerList']).toJS(),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList())
    },
    updateDispatch(category, alpha) {
      dispatch(changePageCount(0))//由于改变了分类，所以pageCount清零
      dispatch(changeEnterLoading(true))
      dispatch(getSingerList(category, alpha))
    },
    // 上拉加载
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count+1))
      if (hot) {
        dispatch(refreshMoreHotSingerList())
      } else {
        dispatch(refreshMoreSingerList(category, alpha))
      }
    },
    // 下拉刷新
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))  //重新获取
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList())
      } else {
        dispatch(getSingerList(category, alpha))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));