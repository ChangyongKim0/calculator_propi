import React, { useState, useEffect, useReducer } from "react";
// { useEffect }

import styles from "./PopupOverlay.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";
import Snackbar from "../atoms/Snackbar";
import useGlobalVar from "../hooks/useGlobalVar";
import Numberpad from "./Numberpad";
import Button from "../atoms/Button";

const cx = classNames.bind(styles);

const PopupOverlay = ({}) => {
  const [mouse_over, setMouseOver] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [settimeout, setSettimeout] = useState(false);
  const [local_data, setLocalData] = useState({ data: [] });

  useEffect(() => {
    if (global_var.popup) {
      setLocalData(global_var.popup);
    }
  }, [global_var.popup]);

  return (
    <div
      className={cx("wrapper")}
      id="popup-overlay-wrapper"
      style={
        global_var.popup
          ? { backgroundColor: "rgba(0, 0, 0, 0.25)", pointerEvents: "auto" }
          : { backgroundColor: "rgba(0, 0, 0, 0)", pointerEvents: "none" }
      }
      onClick={(e) => {
        return e.target.id == "popup-overlay-wrapper"
          ? setGlobalVar({ popup: false })
          : "";
      }}
    >
      <div
        className={cx("frame-popup")}
        style={
          global_var.popup
            ? { transform: "scale(1)", opacity: 1 }
            : {
                transform: "scale(0.9)",
                opacity: 0,
              }
        }
      >
        <List gap={1} tight={false}>
          {local_data.data.map((e, idx) => {
            return (
              <List key={idx} gap={1} tight={false}>
                <div className={cx("section-title")}>{e.title}</div>
                {e.button_list.map((e2, idx2) => (
                  <Button key={idx2} {...e2} />
                ))}
              </List>
            );
          })}
        </List>
      </div>
    </div>
  );
};

PopupOverlay.defaultProps = {};

export default PopupOverlay;

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
