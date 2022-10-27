import React, { useEffect, useState } from "react";
// { useEffect }

import styles from "./MapButton.module.scss";
import classNames from "classnames/bind";
import useToggle from "../hooks/useToggle";
import Icon from "../atoms/Icon";

const cx = classNames.bind(styles);

const MapButton = ({ on, disabled, onClick, icon }) => {
  const [new_on, toggleNewOn] = useToggle(on);

  useEffect(() => {
    if (on != new_on) {
      toggleNewOn();
    }
  }, [on]);

  return (
    <div className={cx("wrapper", disabled ? "disabled" : "")}>
      {icon ? <Icon type={icon} size="2.5" color="black"></Icon> : <></>}
      <div className={cx("frame-text")}>지도 보기</div>
    </div>
  );
};

MapButton.defaultProps = {
  on: false,
  disabled: false,
  onClick: (param) => {
    console.log("clicked default MapButton with param:");
    console.log(param);
  },
  icon: false,
};

export default MapButton;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - color: white / default
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
