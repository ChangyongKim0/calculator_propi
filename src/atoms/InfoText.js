import React from "react";
// { useEffect }

import styles from "./InfoText.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const InfoText = ({ data, use_tooltip, use_toggle, tooltip, style }) => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-title")}>
        <div className={cx("style-" + style)}>
          <div className={cx("title-" + style)}>
            {style == "detail" ? "\u00A0\u00A0" : ""}
            {data.title}
          </div>
        </div>
      </div>
    </div>
  );
};

InfoText.defaultProps = {
  data: {
    title: "title",
    value: "value",
    unit: "u.",
    second_value: "second_value",
    second_unit: "u.",
  },
  use_tooltip: {
    title: true,
    value: true,
    second_value: true,
  },
  use_toggle: false,
  tooltip: {
    title: ["tooltip.title[0]", "tooltip.title[1]"],
    value: ["tooltip.value[0]", "tooltip.value[1]"],
    second_value: ["tooltip.second_value[0]", "tooltip.second_value[1]"],
  },
  style: "default",
};

export default InfoText;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
