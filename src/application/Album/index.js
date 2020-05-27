import React, { useRef, useState, useEffect } from 'react';
import {Container, TopDesc, Menu, SongItem, SongList} from './style';
import { CSSTransition } from 'react-transition-group'
import  Header  from '../../baseUI/header';
import Scroll from '../../baseUI/scroll'
import { getCount, getName } from '../../api/utils/utils'
import style from "../../assets/global-style";
import { connect } from 'react-redux'
import { changeEnterLoading } from './store/actionCreators';
import { getAlbumList } from './store/actionCreators';
import { isEmptyObject  } from '../../api/utils/utils'
import Loading from '../../baseUI/loading/index';
import { useCallback } from 'react';
import SongsList from '../SongList'
import MusicNote from "../../baseUI/music-note/index";

export const HEADER_HEIGHT = 45;

function Album(props) {

  const { songsCount } = props

  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState("歌单")
  const [isMarquee, setIsMarquee] = useState(false) //是否开启跑马灯
  const headerEl = useRef()

  const id = props.match.params.id
  const { currentAlbum: currentAlbumImmutable, enterLoading, getAlbumDataDispatch  } = props

  // 音符动画
  const musicNoteRef = useRef()
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])


  const handleScroll = useCallback(pos => {
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y/minScrollY)
    let headerDom = headerEl.current
    // console.log(pos)
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style ["theme-color"];
      headerDom.style.opacity = Math.min (1, (percent-1)/2);    
      setTitle (currentAlbum.name);
      setIsMarquee (true);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle ("歌单");
      setIsMarquee (false);
    }
  }, [])

  let currentAlbum = currentAlbumImmutable.toJS ();

  const handleBack = useCallback(() => {
      // 由onExited去做路由跳转，之前将动画执行一次
      setShowStatus(false)
  }, []);

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor (currentAlbum.subscribedCount/1000)/10} 万 </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt=""/>
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
        </TopDesc>
    )
  }

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }

  return ( 
    <CSSTransition 
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
      >
        <Container play={songsCount}>
          <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
          {
            !isEmptyObject (currentAlbum) ? (
         
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
               { renderTopDesc() } 
               { renderMenu() }
               {/* { renderSongList() } */}
               <SongsList 
                songs={currentAlbum.tracks} 
                collectCount={currentAlbum.subscribedCount} 
                showCollect={currentAlbum.subscribedCount > 0}
                musicAnimation={musicAnimation}
                />
              <MusicNote ref={musicNoteRef}></MusicNote>
            </div>
        </Scroll>
        ) : null
      } 
      { enterLoading ? <Loading></Loading> : null}
        </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getAlbumList(id))
    }
  }
}

// 将 ui 组件包装成容器组件
export default connect (mapStateToProps, mapDispatchToProps)(React.memo (Album));