import React, { useEffect, useState } from "react";
// { useEffect }

import styles from "./Snackbar.module.scss";
import classNames from "classnames/bind";
import Icon from "./Icon";
import List from "./List";

const cx = classNames.bind(styles);

const Snackbar = ({ children, text, action, onClick }) => {
  const [mouse_down, setMouseDown] = useState(false);
  const [mouse_up, setMouseUp] = useState(false);

  return (
    <div className={cx("wrapper")}>
      <div
        className={cx("frame")}
        onClick={onClick}
        onMouseDown={() => {
          setMouseDown(true);
        }}
        onMouseUp={() => setMouseUp(true)}
        style={
          mouse_up
            ? { opacity: 1, transition: "all .5s" }
            : mouse_down
            ? { opacity: "0.8" }
            : {}
        }
      >
        <List align="left">
          {(children != undefined
            ? children.split("\n")
            : text.split("\n")
          ).map((e, idx) => (
            <div className={cx("text")} key={idx}>
              {e}
            </div>
          ))}
        </List>
        <div className={cx("action")}>{action}</div>
      </div>
    </div>
  );
};

Snackbar.defaultProps = {
  text: "text",
  action: "action",
  onClick: () => {
    console.log("clicked default snackbar");
  },
  callback: () => {
    console.log("fired callback of default snackbar");
  },
};

export default Snackbar;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
