import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./DataCard.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";

const cx = classNames.bind(styles);

const DataCard = ({ data }) => {
  const [mouse_over, setMouseOver] = useState(false);

  return (
    <Card clickable={false} tight={false}>
      <div className={cx("wrapper")}>
        <List gap={0} tight={false}>
          {data.map((e, idx) => {
            return e.type == "divider" ? (
              <Divider key={idx} />
            ) : (
              <Input key={idx} {...e} />
            );
          })}
        </List>
      </div>
    </Card>
  );
};

DataCard.defaultProps = {
  data: [
    {
      type: "default",
      disabled: false,
      operator: "",
      title: "건물 연면적",
      value: "2,000",
      unit: "평",
    },
    {
      type: "rate",
      disabled: false,
      operator: "×",
      title: "전용률",
      value: "65.0",
      unit: "%",
    },
    { type: "divider" },
    {
      type: "default",
      disabled: true,
      operator: "",
      title: "임대면적",
      value: "1,300",
      unit: "평",
    },
  ],
};

export default DataCard;

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
