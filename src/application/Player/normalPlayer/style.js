import styled, { keyframes } from "styled-components";
import style from "../../../assets/global-style";

const rotate = keyframes`
  0%{
    transform: rotate (0);
  }
  100%{
    transform: rotate (360deg);
  }
`;

export const NormalPlayerContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: ${style ["background-color"]};
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    /* 模糊或颜色偏移等图形效果应用于元素  滤镜 */
    filter: blur(20px);
    &.layer {
      background: ${style ["font-color-desc"]};
      opacity: 0.3;
      filter: none;
    }
  }

`