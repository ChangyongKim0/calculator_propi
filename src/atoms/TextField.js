import React from "react";
// { useEffect }

import styles from "./TextField.module.scss";
import classNames from "classnames/bind";
import List from "./List";

const cx = classNames.bind(styles);

const TextField = ({
  style,
  status,
  helper_text,
  multiline,
  label,
  placeholder,
  select,
  select_list,
  width,
  icon,
  children,
}) => {
  const getStatusChar = (status) => {
    switch (status) {
      case "required":
        return " *";
      case "error":
        return " !";
      case "success":
        return " ✓";
      default:
        return "";
    }
  };

  return (
    <List type="column" align="left" gap="0.25">
      {label == "" ? (
        <></>
      ) : (
        <h3 className={cx("label", "label-status-" + status)}>
          {label}
          {getStatusChar(status) != "" ? (
            <b className={cx("char-" + status)}>{getStatusChar(status)}</b>
          ) : (
            <></>
          )}
        </h3>
      )}
      <div
        className={cx("wrapper", "style-" + style, "status-" + status)}
        style={{ width: width }}
      >
        <div className={cx("frame-title")}>
          <input className={cx("input-text")} placeholder={placeholder}></input>
        </div>
        {/* {status == "error" || status == "success" ? (
          <div className={cx("sub-alarm", "sub-alarm-" + status)}></div>
        ) : (
          <></>
        )} */}
      </div>
      {helper_text == "" ? (
        <></>
      ) : (
        <div className={cx("helper-text", "helper-status-" + status)}>
          {helper_text}
        </div>
      )}
    </List>
  );
};

TextField.defaultProps = {
  style: "default",
  status: "default",
  helper_text: "helper_text",
  label: "label",
  placeholder: "placeholder",
  select: false,
  select_list: ["select_list[0]", "select_list[1]"],
  width: "",
  icon: "none",
  children: "children",
};

export default TextField;

// ### TextField

// - style: default / filled / underlined
// - status: default / required / disabled / error / success
// - helper_text: any
// - multiline: boolean
// - label: string
// - placeholder: atring
// - select: boolean
// - select_list: [any]
// - width: css-size
// - icon: none / left / right / both
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
