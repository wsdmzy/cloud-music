import React, {useRef, useState, useEffect, useMemo} from 'react';
import styled from'styled-components';
import style from '../../assets/global-style';
import { debounce } from './../../api/utils/utils';

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${style ["theme-color"]};
  .icon-back {
    font-size: 24px;
    color: ${style ["font-color-light"]};
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style ["theme-color"]};
    color: ${style ["highlight-background-color"]};
    font-size: ${style ["font-size-m"]};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style ["border-color"]};
    &::placeholder {
      color: ${style ["font-color-light"]};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${style ["background-color"]};
  }
`


const SearchBox = (props) => {
  const queryRef = useRef()
  const [query, setQuery] = useState('')
  // 从父组件热门搜索中拿到的新关键词
  const { newQuery } = props
  // 父组件针对搜索关键字请求相关的处理
  const { handleQuery } = props
  // 根据关键字是否存在决定清空按钮的显示 / 隐藏 
  const displayStyle = query ? {display: 'block'}: {display: 'none'};

  const handleChange = (e) => {
    // 搜索框内容时的逻辑
    setQuery(e.currentTarget.value)
  }
  const clearQuery = () => {
    // 清空框内容的逻辑
    setQuery ('');
    queryRef.current.focus ();
  }

  // 默认获取光标
  useEffect (() => {
    queryRef.current.focus ();
  }, []);

  // 缓存方法
  let handleQueryDebounce = useMemo(() => {
    // console.log('+++')
    return debounce (handleQuery, 500);
  }, [handleQuery]);

  useEffect (() => {
    // 注意防抖
    handleQueryDebounce (query);
  }, [query]);

  // 父组件点击了热门搜索的关键字，newQuery 更新:
  useEffect (() => {
    if (newQuery !== query){
      setQuery (newQuery);
    }
  }, [newQuery]);

  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>&#xe655;</i>
      <input ref={queryRef} className="box" placeholder="搜索歌曲、歌手、专辑" value={query} onChange={handleChange}/>
      <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe600;</i>
    </SearchBoxWrapper>
  )

}

export default React.memo(SearchBox)