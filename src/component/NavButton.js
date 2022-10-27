import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./NavButton.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";

const cx = classNames.bind(styles);

const NavButton = ({ children, focused, onClick }) => {
  const [mouse_over, setMouseOver] = useState(false);

  return (
    <div className={cx("wrapper")} onClick={onClick}>
      <List gap={0.25}>
        <div className={cx("text", focused ? "focused" : "")}>{children}</div>
        <div className={cx("frame-bar", focused ? "focused" : "")}></div>
      </List>
    </div>
  );
};

NavButton.defaultProps = {
  children: "text",
  focused: false,
  onClick: () => {
    console.log("clicked NavButton");
  },
};

export default NavButton;

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
