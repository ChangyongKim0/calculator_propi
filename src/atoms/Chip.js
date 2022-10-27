import React from "react";

import styles from "./Chip.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Chip = ({ children, clickable, clicked, onClick }) => {
  return (
    <div
      className={cx(
        "wrapper",
        clickable ? "clickable" : "",
        clicked ? "clicked" : "unclicked"
      )}
      onClick={clickable ? onClick : () => {}}
    >
      <div className={cx("frame")}>{children}</div>
    </div>
  );
};

Chip.defaultProps = {
  children: "children",
  clickable: true,
  clicked: false,
  onClick: () => {
    console.log("clicked default chip");
  },
};

export default Chip;

// ### Chip

// children: any
// clickable: boolean
// clicked: boolean
// onClick: ()=>any
