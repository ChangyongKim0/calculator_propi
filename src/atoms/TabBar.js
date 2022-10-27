import React, { useEffect, useState } from "react";
// { useEffect }

import styles from "./TabBar.module.scss";
import classNames from "classnames/bind";
import useToggle from "../hooks/useToggle";

const cx = classNames.bind(styles);

const TabBar = ({
  on,
  disabled,
  onClick,
  color,
  multiple,
  button,
  multiple_data,
  text,
  max_width,
  children,
  vertical,
}) => {
  const [new_on, toggleNewOn] = useToggle(on);
  const [active_idx, setActiveIdx] = useState(
    multiple_data
      .map((e, idx) => {
        return [idx, e.active];
      })
      .filter((e2) => e2[1])[0][0]
  );

  useEffect(() => {
    if (on != new_on) {
      toggleNewOn();
    }
  }, [on]);

  return (
    <div className={cx("wrapper", disabled ? "disabled" : "")}>
      <div className={cx("frame-bar")}>
        {multiple_data.map((e, idx) => (
          <div
            key={idx}
            id={idx}
            className={cx("frame-button", idx == active_idx ? "on" : "off")}
            onMouseDown={() => {
              idx != active_idx
                ? onClick(multiple_data[idx])
                : onClick(multiple_data[0]);
              idx != active_idx ? setActiveIdx(idx) : setActiveIdx(0);
            }}
          >
            {e.text}
          </div>
        ))}
      </div>
    </div>
  );
};

TabBar.defaultProps = {
  on: false,
  disabled: false,
  onClick: (param) => {
    console.log("clicked default TabBar with param:");
    console.log(param);
  },
  color: "default",
  multiple: false,
  button: false,
  multiple_data: [
    { id: 0, text: "multiple_data[0]" },
    { id: 1, text: "multiple_data[1]", active: true },
    { id: 2, text: "multiple_data[2]" },
  ],
  text: "text",
  max_width: "570px",
  vertical: false,
  unselectable: false,
};

export default TabBar;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - color: white / default
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
