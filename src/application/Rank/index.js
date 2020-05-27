import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Container, List, ListItem, SongList } from './style.js';
import { getRankList } from './store/index.js';
import { filterIndex } from '../../api/utils/utils.js';
import Scroll  from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'
import { renderRoutes } from 'react-router-config';


function Rank(props){

  const { rankList:list, loading } = props
  const { getRankListDataDispatch } = props
  let rankList = list ? list.toJS() : []

  const { songsCount } = props

  useEffect(() => {
    getRankListDataDispatch()
  }, [])

  let globalStartIndex = filterIndex(rankList)
  let officialList = rankList.slice(0, globalStartIndex)
  let globalList = rankList.slice(globalStartIndex)

  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`)
  }

  // 这是渲染榜单列表函数，传入 global 变量来区分不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map(item => {
            return (
              <ListItem key={item.coverImgId}  tracks={item.tracks}  onClick={() => enterDetail(item)}>
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt="" />
                <div className="decorate"></div>
                <span className="update_frequecy">{item.updateFrequency}</span>
              </div>
              { renderSongList(item.tracks) }
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  const renderSongList = list => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index+1}.{item.first}-{item.second}</li>
          })
        }
      </SongList>
    ) : null
  }

  // 榜单数据未加载出来之前都给隐藏
  let dispalyStyle = loading ? {"display": "none"} : {"display": ""}


  return (
    <Container play={songsCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={dispalyStyle}>
            官方榜
          </h1>
          {renderRankList(officialList, false)}
          <h1 className="global" style={dispalyStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
          { loading ? <Loading></Loading> : null}
        </div>
      </Scroll>
      { renderRoutes(props.route.routes) }
    </Container>
  );
}

const mapStateToProps = state => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispathchToProps = dispatch => {
  return {
    getRankListDataDispatch() {
      dispatch(getRankList())
    }
  }
}
 
// export default React.memo(Rank);
export default connect(mapStateToProps, mapDispathchToProps)(React.memo(Rank))