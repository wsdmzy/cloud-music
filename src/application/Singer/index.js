import React, { useState, useRef, useEffect, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import { 
  Container, 
  SongListWrapper,
  BgLayer,
  CollectButton,
  ImgWrapper
} from "./style";
import Header from '../../baseUI/header'
import SongsList from '../SongList'
import Scroll from '../../baseUI/scroll'
import { HEADER_HEIGHT } from "./../../api/config";
import { getSingerInfo, changeEnterLoading } from "./store/actionCreators";
import { connect } from 'react-redux'
import Loading from "../../baseUI/loading/index";
import MusicNote from '../../baseUI/music-note/index'


function Singer (props) {
  const [showStatus, setShowStatus] = useState (true);

  const musicNoteRef = useRef()

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  const { 
    artist: immutableArtist, 
    songs: immutableSongs, 
    loading,
    getSingerDataDispatch
  } = props;

  const artist = immutableArtist.toJS()
  const songs = immutableSongs.toJS()
  

  const collectButton = useRef()
  const imageWrapper = useRef()
  const songScrollWrapper = useRef()
  const songScroll = useRef()
  const header = useRef()
  const layer = useRef()
  //图片初始高度
  const initialHeight = useRef(0)

  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight
    songScrollWrapper.current.style.top = `${h - OFFSET}px`
    initialHeight.current = h
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`
    songScroll.current.refresh()
  }, [])

  useEffect(() => {
    const id = props.match.params.id
    getSingerDataDispatch(id)
  }, [])

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false)
  }, [])

  // 歌单列表的拉入拉出
  const handleScroll = useCallback(pos => {
    let height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const buttonDOM = collectButton.current
    const headerDOM = header.current
    const layerDOM = layer.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT

    // 指的滑动举动距离占图片高度百分比
    const precent = Math.abs(newY/height)

    if (newY > 0) { //处理往下拉的情况，效果：图片放大，按钮跟着偏移
      imageDOM.style["transform"] = `scale(${1+precent})`
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
      layerDOM.style.top = `${height-OFFSET+newY}px`
    } else if (newY >= minScrollY) { //往上滑动，但是遮罩还没超过 Header 部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%"
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1
      // 按钮跟着移动逐渐变透明
      buttonDOM.style["transform"] = `translate3d(0,${newY}px, 0)`
      buttonDOM.style["opacity"] = `${1 - precent * 2}`
    } else if (newY < minScrollY) { //往上滑动，但是遮罩超过 Header 部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
      layerDOM.style.zIndex = 1
      // 防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100
      // 此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 99
    }
  })

  return (
    <CSSTransition 
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
      >
      <Container>
        <Header 
          title={artist.name}
          handleClick={setShowStatusFalse}
          ref={header}
          ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl} >
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton} >
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll onScroll={handleScroll} ref={songScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              musicAnimation={musicAnimation}
            ></SongsList>
            <MusicNote ref={musicNoteRef}></MusicNote>
          </Scroll>
        </SongListWrapper>
        { loading ? (<Loading></Loading>) : null}
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  artist: state.getIn(['singerInfo', 'artist']),
  songs: state.getIn(['singerInfo', 'songsOfArtist']),
  loading: state.getIn(['singerInfo', 'loading'])
})

const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getSingerInfo(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer))