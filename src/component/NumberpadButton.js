import React, { Children, useEffect, useReducer } from "react";
// { useEffect }

import styles from "./NumberpadButton.module.scss";
import classNames from "classnames/bind";
import { ReactComponent as Excel } from "../svgs/Excel.svg";
import { ReactComponent as Autocad } from "../svgs/Autocad.svg";
import useButtonGesture from "../hooks/useButtonGesture.js";
import useGlobalVar from "../hooks/useGlobalVar";
import { ReactComponent as NumberpadBack } from "../svgs/NumberpadBack.svg";
import { ReactComponent as NumberpadUp } from "../svgs/NumberpadUp.svg";
import { ReactComponent as NumberpadDown } from "../svgs/NumberpadDown.svg";
import { ReactComponent as NumberpadEnter } from "../svgs/NumberpadEnter.svg";

const cx = classNames.bind(styles);

const NumberpadButton = ({ data, onClick, active }) => {
  const [global_var, setGlobalVar] = useGlobalVar();

  const [
    button_state,
    onMouseDown,
    onMouseUp,
    useEffectContent,
    style_content,
  ] = useButtonGesture(
    "1234567890.".includes(data) || data == "00"
      ? { backgroundColor: "#dadce0" }
      : data == "enter"
      ? { backgroundColor: "#6821ff" }
      : { backgroundColor: "#f1f3f4" },
    "1234567890.".includes(data) || data == "00"
      ? { backgroundColor: "#787878" }
      : data == "enter"
      ? { backgroundColor: "#3b00b9" }
      : { backgroundColor: "#dadce0" },
    300
  );

  useEffect(useEffectContent, [button_state]);

  return "＋－×÷".includes(data) ? (
    <div
      className={cx("wrapper", active ? "active" : "inactive")}
      onClick={onClick}
    >
      {data}
    </div>
  ) : (
    <div
      className={cx("wrapper")}
      onTouchStart={
        global_var.touchable
          ? () => {
              onMouseDown();
              onClick();
              setTimeout(onMouseUp, 500);
              console.log(1);
            }
          : () => {}
      }
      onMouseDown={
        global_var.touchable
          ? () => {}
          : () => {
              onMouseDown();
              onClick();
              setTimeout(onMouseUp, 500);
              console.log(1);
            }
      }
      onTouchEnd={global_var.touchable ? onMouseUp : () => {}}
      onMouseUp={global_var.touchable ? () => {} : onMouseUp}
      style={style_content}
    >
      {data == "back" ? (
        <NumberpadBack />
      ) : data == "up" ? (
        <NumberpadUp />
      ) : data == "down" ? (
        <NumberpadDown />
      ) : data == "enter" ? (
        <NumberpadEnter />
      ) : (
        data
      )}
    </div>
  );
};

NumberpadButton.defaultProps = {
  type: "default",
  children: "children",
  color: "default",
  onClick: () => {
    console.log("clicked default button");
  },
  tight: true,
};

export default NumberpadButton;

// ### NumberpadButton

// - type: default / excel / cad
// - shape: default / rectangle
// - children: any
// - color: default / transparent / primary
// - padding: int
// - onClick: ()=>any
// - tight: boolean
