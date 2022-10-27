import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./SummaryCard.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import { formatData, formatUnit } from "../util/formatData";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";

const cx = classNames.bind(styles);

const SummaryCard = ({ id, operator, title, value, type, unit, isValid }) => {
  const [mouse_over, setMouseOver] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();

  return (
    <Card
      clickable
      onClick={() => {
        setGlobalVar({ use_numberpad: true });
        setGlobalData({
          editing_idx: id,
        });
      }}
    >
      <div className={cx("wrapper")}>
        <List gap={0.25} align="left">
          <div className={cx("title")}>{title}</div>
          <List gap={0.25} type="row" align="right" attach="end" tight={false}>
            <div className={cx("value")}>
              {formatData(value, type, unit, global_var.unit_type)}
            </div>
            <div className={cx("unit")}>
              {formatUnit(unit, global_var.unit_type)}
            </div>
          </List>
        </List>
      </div>
    </Card>
  );
};

SummaryCard.defaultProps = {
  title: "title",
  value: "Value",
  type: "default",
  unit: "unit",
};

export default SummaryCard;

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
