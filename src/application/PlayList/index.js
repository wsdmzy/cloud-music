import { connect } from "react-redux";
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style';
import { CSSTransition } from 'react-transition-group';
import React, { useRef, useState, useCallback } from 'react';
import { getName, prefixStyle } from '../../api/utils/utils';
import { changeShowPlayList, changeCurrentIndex, changePlayMode, changePlayList, deleteSong } from "../Player/store/actionCreators";
import { playMode } from "../../api/config";
import Scroll from '../../baseUI/scroll';

function PlayList(props) {

  const {
    currentIndex,
    currentSong:immutableCurrentSong,
    showPlayList,
    playList:immutablePlayList,
    mode,
    sequencePlayList:immutableSequencePlayList
  } = props;
  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    deleteSongDispatch
  } = props;

  const currentSong = immutableCurrentSong.toJS ();
  const playList = immutablePlayList.toJS ();
  const sequencePlayList = immutableSequencePlayList.toJS ();

  const playListRef = useRef()
  const listWrapperRef = useRef()
  const [isShow, setIsShow] = useState(false)

  const transform = prefixStyle("transform");

  const onEnterCB = useCallback(() => {
    //让列表显示
    setIsShow(true);
  
    //最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);
  
  const onEnteringCB = useCallback(() => {
    //让列表展现
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);
  
  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);
  
  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  // console.log(showPlayList ,playList)

  const getCurrentIcon = item => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe6e3;': ''
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{__html:content}}></i>
    )
  }

  const getPlayMode = () => {
    let content, text
    if (mode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i className="iconfont" onClick={(e) => changeMode (e)}  dangerouslySetInnerHTML={{__html: content}}></i>
        <span className="text" onClick={(e) => changeMode (e)}>{text}</span>
      </div>
    )
  }

  const changeMode = e => {
    let newMode = (mode+1)%3
  }

  const handleShowClear = () => {
    // togglePlayListDispatch(false)
  }

  // 切歌
  const handleChangeCurrentIndex = index => {
    if (currentIndex === index) return
    changeCurrentIndexDispatch(index)
  }

  // 删除歌曲
  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }

  return (
    <CSSTransition 
      in={showPlayList} 
      timeout={300} 
      classNames="list-fade"
      appear={true} // 为true  渲染的时候就直接执行动画，默认false，
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
      >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? { display: "block" } : { display: "none" }}
        onClick={() => togglePlayListDispatch(false)}
        >
        <div className="list_wrapper" ref={listWrapperRef} onClick={e => e.stopPropagation() /**阻止冒泡，点击切歌时 */}> 
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll onScroll={() => {console.log('???')}}>
              <ListContent>
                {
                  playList.map((item, index) => {
                    return (
                      <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                        {getCurrentIcon(item)}
                        <span className="text">{item.name} - {getName(item.ar)}</span>
                        <span className="like">
                          <i className="iconfont">&#xe601;</i>
                        </span>
                        <span className="delete" onClick={e => handleDeleteSong(e, item)}>
                          <i className="iconfont">&#xe63d;</i>
                        </span>
                      </li>
                    )
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
      </PlayListWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  showPlayList: state.getIn(['player', 'showPlayList']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),  // 顺序排列时的播放列表
  mode: state.getIn(['player', 'mode'])
})
const mapDispatchToProps = dispatch => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data))
    },
    // 修改当前歌曲在列表中的 index，也就是切歌
    changeCurrentIndexDispatch (data) {
      dispatch (changeCurrentIndex (data));
    },
    // 修改当前的播放模式
    changeModeDispatch (data) {
      dispatch (changePlayMode (data));
    },
    // 修改当前的歌曲列表
    changePlayListDispatch (data) {
      dispatch (changePlayList (data));
    },
    deleteSongDispatch(data) {
      dispatch(deleteSong(data))
    }
  }
}

export default connect (mapStateToProps, mapDispatchToProps)(React.memo (PlayList));