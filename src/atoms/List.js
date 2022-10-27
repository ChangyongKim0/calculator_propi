import React from "react";
// { useEffect }

import styles from "./List.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const List = ({
  children,
  type,
  align,
  attach,
  multiple_line,
  gap,
  height,
  tight,
  onMouseOver,
  onMouseEnter,
  onMouseLeave,
  onClick,
  relative,
  disable,
  padding,
}) => {
  return (
    <div
      className={cx(
        "wrapper",
        relative ? "relative" : "",
        "type-" + type,
        "align-" + align,
        "attach-" + attach,
        multiple_line ? "multiple-line" : "",
        tight ? "tight" : "full",
        disable ? "disable" : ""
      )}
      style={
        tight
          ? {
              height: height + "rem",
              gap: gap + "rem",
              padding: padding + "rem",
            }
          : type == "row"
          ? {
              height: height + "rem",
              gap: gap + "rem",
              padding: padding + "rem",
              width: "calc(100% - " + padding * 2 + "rem)",
            }
          : {
              height: "calc(100% - " + padding * 2 + "rem)",
              gap: gap + "rem",
              width: "calc(100% - " + padding * 2 + "rem)",
              padding: padding + "rem",
            }
      }
      onMouseOver={onMouseOver}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

List.defaultProps = {
  children: (
    <>
      <div>children.first</div>
      <div>children.last</div>
    </>
  ),
  type: "column",
  align: "center",
  attach: "default",
  multiple_line: false,
  gap: 0.5,
  height: "auto",
  tight: true,
  padding: 0,
};

export default List;

// ### List

// - type : column / row / grid
// - align : left / center / right
// - attach : start / default / end / space
// - multiple_line : boolean
// - gap : int
