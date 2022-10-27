import React, { Children, useEffect, useReducer } from "react";
// { useEffect }

import styles from "./Button.module.scss";
import classNames from "classnames/bind";
import { ReactComponent as Excel } from "../svgs/Excel.svg";
import { ReactComponent as Autocad } from "../svgs/Autocad.svg";
import useButtonGesture from "../hooks/useButtonGesture.js";
import useGlobalVar from "../hooks/useGlobalVar";

const cx = classNames.bind(styles);

const Button = ({ type, shape, children, color, padding, onClick, tight }) => {
  const [global_var, setGlobalVar] = useGlobalVar();

  const [
    button_state,
    onMouseDown,
    onMouseUp,
    useEffectContent,
    style_content,
  ] = useButtonGesture(
    color == "primary"
      ? { backgroundColor: "#6821ff" }
      : color == "transparent"
      ? { backgroundColor: "#dadce000" }
      : color == "verylight"
      ? { backgroundColor: "#f2f2f2" }
      : {},
    color == "primary"
      ? { backgroundColor: "#3b00b9" }
      : color == "transparent"
      ? { backgroundColor: "#dadce0" }
      : color == "verylight"
      ? { backgroundColor: "#dadce0" }
      : {},
    300
  );

  useEffect(useEffectContent, [button_state]);

  return (
    <div
      className={cx("wrapper", "color-" + (type == "default" ? color : type))}
      onClick={onClick}
      onTouchStart={global_var.touchable ? onMouseDown : () => {}}
      onMouseDown={global_var.touchable ? () => {} : onMouseDown}
      onTouchEnd={global_var.touchable ? onMouseUp : () => {}}
      onMouseUp={global_var.touchable ? () => {} : onMouseUp}
      style={style_content}
    >
      {type == "excel" ? (
        <Excel className={cx("icon")} />
      ) : type == "cad" ? (
        <Autocad className={cx("icon")} />
      ) : (
        <></>
      )}
      {children}
    </div>
  );
};

Button.defaultProps = {
  type: "default",
  children: "children",
  color: "default",
  onClick: () => {
    console.log("clicked default button");
  },
  tight: true,
};

export default Button;

// ### Button

// - type: default / excel / cad
// - shape: default / rectangle
// - children: any
// - color: default / transparent / primary
// - padding: int
// - onClick: ()=>any
// - tight: boolean
