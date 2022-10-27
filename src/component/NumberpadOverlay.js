import React, { useState, useEffect, useReducer } from "react";
// { useEffect }

import styles from "./NumberpadOverlay.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";
import Snackbar from "../atoms/Snackbar";
import useGlobalVar from "../hooks/useGlobalVar";
import Numberpad from "./Numberpad";

const cx = classNames.bind(styles);

const NumberpadOverlay = ({ text, action, onClick }) => {
  const [mouse_over, setMouseOver] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [settimeout, setSettimeout] = useState(false);
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (global_var.use_numberpad) {
      setEnable(true);
    } else {
      setTimeout(() => setEnable(false), 300);
    }
  });

  return (
    <div
      className={cx("wrapper")}
      id="numberpad-overlay-wrapper"
      style={
        global_var.use_numberpad
          ? { backgroundColor: "rgba(0, 0, 0, 0.25)", pointerEvents: "auto" }
          : enable
          ? { backgroundColor: "rgba(0, 0, 0, 0)" }
          : { backgroundColor: "rgba(0, 0, 0, 0)", pointerEvents: "none" }
      }
      onClick={(e) => {
        return e.target.id == "numberpad-overlay-wrapper"
          ? setGlobalVar({ use_numberpad: false })
          : "";
      }}
    >
      <div
        className={cx("frame-popup")}
        style={
          global_var.use_numberpad
            ? {
                height: "calc(100vw + 100px)",
                maxHeight: "calc(calc(var(--100vh) * 0.8) + 100px)",
                bottom: "-100px",
              }
            : {
                height: "calc(100vw + 100px)",
                maxHeight: "calc(calc(var(--100vh) * 0.8) + 100px)",
                bottom: "calc(-1 * calc(100vw + 120px))",
              }
        }
      >
        <Numberpad />
      </div>
    </div>
  );
};

NumberpadOverlay.defaultProps = {
  text: "text",
  action: "action",
  onClick: (e) => {
    console.log("snakbar overlay is clicked with data");
    console.log(e);
  },
};

export default NumberpadOverlay;

// ### Card

// - shape: default / rectangle
// - children: any
// - padding: int
// - clickable: boolean
// - transparent: boolean
// - onClick: ()=>any
// - use_tooltip: boolean
// - tooltip: [any]
// - tight: boolean
