import React from "react";
// { useEffect }

import styles from "./Tooltip.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Tooltip = ({ visible, tooltip, align }) => {
  return (
    <div
      className={cx(
        "wrapper",
        visible ? "visible" : "hidden",
        "align-" + align
      )}
    >
      {tooltip.map((e, idx) => {
        return (
          <div key={idx} className={cx("text")}>
            {e}
          </div>
        );
      })}
    </div>
  );
};

Tooltip.defaultProps = {
  visible: false,
  tooltip: ["tooltip[0]", "tooltip[1]"],
  align: "default",
};

export default Tooltip;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
