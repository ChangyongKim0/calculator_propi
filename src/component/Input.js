import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./Input.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import {
  formatData,
  formatUnit,
  _formatThousandSeperator,
} from "../util/formatData";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";

const cx = classNames.bind(styles);

const Input = ({
  active,
  disabled,
  type,
  operator,
  title,
  value,
  unit,
  string_value,
  isValid,
  illust,
  emph,
}) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();

  const formatNumber = (str) => {
    if (str.toString().includes(".")) {
      if (str.split(".")[1].length < 3) {
        return str;
      }
      return (Math.round(Number(str) * 100) / 100).toFixed(2);
    }
    return Math.round(Number(str));
  };

  return (
    <div
      className={cx(
        "wrapper",
        active ? "active" : "",
        disabled ? "disabled" : ""
      )}
    >
      {!active && !disabled ? (
        <List type="row" gap={0} align="right" attach="space">
          <div className={cx("frame-title")}>
            <div className={cx("operator")}>{operator}</div>
            <div className={cx("title")}>{title}</div>
          </div>
          <div
            className={cx(
              "frame-value",
              global_var.touchable ? "touchable" : "clickable"
            )}
            onClick={() => {
              setGlobalVar({ use_numberpad: true });
              setGlobalData({
                editing_idx: global_data.assumptions.indexOf(
                  global_data.assumptions.find((e) => e.title == title)
                ),
              });
            }}
          >
            <div className={cx("value")}>
              {formatData(value, type, unit, global_var.unit_type)}
            </div>
            <div className={cx("unit", type == "rate" ? "rate" : "")}>
              {formatUnit(unit, global_var.unit_type)}
            </div>
          </div>
        </List>
      ) : (
        <List align="left" gap={0.125}>
          {illust ? (
            <div className={cx("illust")}>
              {illust
                .split(/\<sup|\<\/sup\>/g)
                .map((e) => (e.includes(">") ? <sup>{e.slice(1)}</sup> : e))}
            </div>
          ) : (
            <></>
          )}
          <List type="row" gap={0.25} align="right" tight={false}>
            {active ? "" : <div className={cx("operator")}>{operator}</div>}
            <div className={cx("title")}>{title}</div>
            <div
              className={cx(
                "value",
                active ? "active" : "",
                disabled ? "disabled" : "",
                string_value ? "new" : "",
                emph ? "emph" : ""
              )}
            >
              {string_value
                ? _formatThousandSeperator(formatNumber(string_value))
                : formatData(value, type, unit, global_var.unit_type)}
            </div>
            <div
              className={cx(
                "unit",
                active ? "active" : "",
                disabled ? "disabled" : "",
                type == "rate" ? "rate" : "",
                emph ? "emph" : ""
              )}
            >
              {formatUnit(unit, global_var.unit_type)}
            </div>
          </List>
        </List>
      )}
    </div>
  );
};

Input.defaultProps = {
  active: false,
  disabled: false,
  type: "default",
  operator: "A",
  title: "title",
  value: 1000,
  unit: "unit",
  string_value: false,
};

export default Input;

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
