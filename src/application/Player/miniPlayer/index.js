import React from 'react';
import { MiniPlayerContainer } from './style';
import { getName } from '../../../api/utils/utils'

function MiniPlayer(props) {
  const { song } = props
  return (
    <MiniPlayerContainer>
      <div className="icon">
        <div className="imgWrapper">
          <img className="play" src={song.al.picUrl} width="40" height="40" />
        </div>
      </div>
      <div className="text">
        <h2 className="name">{song.name}</h2>
        <p className="desc">{ getName(song.ar) }</p>
      </div>
      <div className="control">
        <i className="iconfont">&#xe650;</i>
      </div>
      <div className="control">
          <i className="iconfont">&#xe640;</i>
      </div>
    </MiniPlayerContainer>
  )
}

export default React.memo (MiniPlayer);