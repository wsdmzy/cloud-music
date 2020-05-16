import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import BScroll from 'better-scroll'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState()
  const scrollContainerRef = useRef()
  const { direction, click, refresh, bounceTop, bounceBottom } = props
  const { pullup, pullDown, onScroll } = props
  // 实例化BScroll
  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
  }, [])

  // 监听滚动
  useEffect(() => {
    if (!bScroll || !onScroll) return
    bScroll.on('scroll', scroll => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  // 监听滑倒底部，上拉加载
  useEffect(() => {
    if (!bScroll || !pullup) return
    bScroll.on('scrollEnd', () => {
      // 判断是否滑倒了底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullup()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullup, bScroll])

  // 下拉刷新
  useEffect(() => {
    if (!bScroll || !pullDown) return
    
    bScroll.on('touchEnd', (pos) => {
      // 判断用户的下拉动作/*  */
      if (pos.y > 50) {
        pullDown()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  }, [pullDown, bScroll])

  // 刷新
  useEffect (() => {
    if (refresh && bScroll){
      bScroll.refresh()
    }
  });

  // 向父组件暴露refresh方法和bs实例
  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0,0)
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll
      }
    }
  }))

  return (
    <ScrollContainer ref={scrollContainerRef}>
      {props.children}
    </ScrollContainer>
  )

})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll:null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}

Scroll.propTypes = {
  direction: PropTypes.oneOf (['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,// 是否支持向上吸顶
  bounceBottom: PropTypes.bool// 是否支持向上吸顶
}

export default Scroll;