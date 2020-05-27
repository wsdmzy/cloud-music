import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen
} from "./store/actionCreators";
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer'
import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils/utils'
import Toast from "../../baseUI/Toast";
import { playMode } from "../../api/config";
import PlayList from '../PlayList/index'

function Player(props) {
  const {
    playing,
    currentSong:immutableCurrentSong,
    currentIndex,
    playList:immutablePlayList,
    mode,//播放模式
    sequencePlayList:immutableSequencePlayList,//顺序列表
    fullScreen,
    showPlayList 
  } = props;
  // console.log(playing)
  const {
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,//改变playList
    changeModeDispatch,//改变mode
    toggleFullScreenDispatch,
    togglePlayListDispatch //播放列表
  } = props;
  
  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()
  const currentSong = immutableCurrentSong.toJS()

  // toast
  const [modeText, setModeText] = useState("");
  const toastRef = useRef();

  const songReady = useRef(true)

  //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current   //标志位false
    )
      return;
    let current = playList[currentIndex]
    changeCurrentDispatch(current) //赋值currentSong
    setPreSong(current)
    songReady.current = false; // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    audioRef.current.src = getSongUrl(current.id)
    setTimeout(() => {
      audioRef.current.play().then(() => {
        songReady.current = true
      })
    })
    togglePlayingDispatch(true)
    setCurrentTime(0)
    setDuration((current.dt/1000)|0) //时长
  }, [playList, currentIndex])

  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  // 歌曲总时长
  const [duration, setDuration] = useState(0)
  // 歌曲播放进度
  let percent = isNaN(currentTime/duration) ? 0 : currentTime / duration

  

  const audioRef = useRef()

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    // console.log(state)
    togglePlayingDispatch(!playing)
    toggleFullScreenDispatch(state)
  }

 
  // 首次进入就播播放
  // useEffect(() => {  
  //   if (isEmptyObject(currentSong))  return
  //   // console.log(currentSong)
  //   changeCurrentIndexDispatch(0) //currentIndex默认为-1，临时改成0
  //   let current = playList[0]
  //   changeCurrentDispatch(current)//赋值currentSong
  //   audioRef.current.src = getSongUrl(current.id);
  //   setTimeout(() => {
  //     // 先暂停再播放
  //     audioRef.current.play();
  //   });
  //   togglePlayingDispatch(true);//播放状态
  //   setCurrentTime(0);//从头开始播放
  //   setDuration((current.dt / 1000) | 0);// 时长
  //   audioRef.current.pause();
  // }, [])

  useEffect(() => {
    // console.log(playing, '+++')
    playing && audioRef  ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  const updateTime = e => {
    setCurrentTime(e.target.currentTime)
  }
 
  const onProgressChange = curPercent => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    if (!playing) {
      togglePlayingDispatch(true)
    }
  }

  // 一首歌循坏
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    togglePlayingDispatch(true)
    audioRef.current.play()
  }

  // 上一曲
  const handlePrev = () => {
    // 播放列表只有一首歌时单曲循坏
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index < 0) index = playList.length - 1
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  // 下一曲
  const handleNext = () => {
    // 播放列表只有一首歌时单曲循坏
    if (playList.length === 1) {
      handleLoop()
      return
    } 


    let index = currentIndex + 1
    if (index === playList.length) index = 0
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  // 改变播放模式
  const changeMode = () => {
    let newMode = (mode+1) % 3
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList)
      let index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
      setModeText("顺序循环");
    } else if (newMode === 1) {
      // 单曲循坏
      changePlayListDispatch(sequencePlayList)
      setModeText("单曲循环");
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList)
      let index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
      setModeText("随机播放");
    }
    changeModeDispatch(newMode)
    toastRef.current.show();
  }

  // 歌曲播放完毕
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  const handleError = () => {
    songReady.current = true
    alert("播放出错，请重新操作。")
  }

  return (
    <div>
      { isEmptyObject(currentSong) ? null : 
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          percent={percent}
          togglePlayList={togglePlayListDispatch}
        /> 
      }
      { isEmptyObject(currentSong) ? null : 
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          duration={duration}
          currentTime={currentTime}
          percent={percent}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          mode={mode}
          changeMode={changeMode}
          togglePlayList={togglePlayListDispatch}
        />
      }
      <audio 
        onError={handleError}
        onEnded={handleEnd}
        onTimeUpdate={updateTime}
        ref={audioRef}></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
      { showPlayList ? <PlayList></PlayList> : null }
    </div>
  )
}

const mapStateToProps = state => ({
  fullScreen: state.getIn (["player", "fullScreen"]),
  playing: state.getIn (["player", "playing"]),
  currentSong: state.getIn (["player", "currentSong"]),
  showPlayList: state.getIn (["player", "showPlayList"]),
  mode: state.getIn (["player", "mode"]),
  currentIndex: state.getIn (["player", "currentIndex"]),
  playList: state.getIn (["player", "playList"]),
  sequencePlayList: state.getIn (["player", "sequencePlayList"])
})

const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data))
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data))
    },
    togglePlayListDispatch (data) {
      dispatch (changeShowPlayList(data));
    },
    changeCurrentIndexDispatch (index) {
      dispatch (changeCurrentIndex(index));
    },
    changeCurrentDispatch (data) {
      dispatch (changeCurrentSong(data));
    },
    changeModeDispatch (data) {
      dispatch (changePlayMode(data));
    },
    changePlayListDispatch (data) {
      dispatch (changePlayList(data));
    }
  }
}


// 将 ui 组件包装成容器组件
export default connect (
  mapStateToProps,
  mapDispatchToProps
)(React.memo (Player));