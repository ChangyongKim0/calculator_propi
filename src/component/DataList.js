import React, { useEffect } from "react";
// { useEffect }

import styles from "./DataList.module.scss";
import classNames from "classnames/bind";
import Card from "../atoms/Card";
import List from "../atoms/List";
import Overlay from "../atoms/Overlay";
import Sheet from "../atoms/Sheet";
import TextField from "../atoms/TextField";
import useGlobalVar from "../hooks/useGlobalVar";
import { formatData, formatUnit } from "../util/formatData";
import Divider from "../atoms/Divider";
import { _addTransformScrollEvent } from "../util/alias";
import { col_g3, col_primary } from "../util/style";

const cx = classNames.bind(styles);

const DataList = ({ id, title, children }) => {
  const [global_var, setGlobalVar] = useGlobalVar();

  useEffect(() => {
    let remover = [];
    children.map((e, idx) => {
      if (e.style == "card_list") {
        remover.push(
          _addTransformScrollEvent("transform_scroll_" + id + "_" + idx)
        );
      }
    });
  }, [children]);

  return (
    <List align="left" gap={0} tight={false}>
      <div className={cx("text-section")}>{title}</div>
      <List align="left" gap={0} tight={false}>
        {children.map((e, idx) => {
          return (
            <List key={idx} type="column" gap={0} tight={false}>
              {idx != 0 &&
              !e.id.includes("sub") &&
              !children[idx == 0 ? idx : idx - 1].id.includes("sub") ? (
                <Divider color="faint" />
              ) : (
                <></>
              )}
              {e.style == "card_list" ? (
                <div
                  id={"transform_scroll_" + id + "_" + idx}
                  className={cx("frame-row-scroll")}
                >
                  <List type="row" gap={0.5} align="left">
                    <div>{"\u00A0"}</div>
                    {e.children.map((e2, idx2) => {
                      return (
                        <Card
                          key={idx2}
                          padding="0.375"
                          border={false}
                          color={
                            global_var[e.id + "_current_idx"] == idx2
                              ? col_g3
                              : "#ffffff"
                          }
                          onClick={() => {
                            let var_data = {};
                            var_data[e.id + "_current_idx"] = idx2;
                            setGlobalVar(var_data);
                          }}
                        >
                          <List type="column" gap={0.375} align="left">
                            <div
                              className={cx(
                                "frame-button-text",
                                "text-title-of-card",
                                global_var[e.id + "_current_idx"] == idx2
                                  ? "emph"
                                  : ""
                              )}
                            >
                              {e2.title}
                            </div>
                            <div
                              className={cx(
                                "frame-button-text",
                                "text-subtitle-of-card",
                                global_var[e.id + "_current_idx"] == idx2
                                  ? "emph"
                                  : ""
                              )}
                            >
                              {e2.subtitle}
                            </div>
                            {e2.children.map((e3, idx3) => {
                              return (
                                <div
                                  key={idx3}
                                  className={cx(
                                    "frame-button-text",
                                    "text-of-card",
                                    global_var[e.id + "_current_idx"] == idx2
                                      ? "emph"
                                      : ""
                                  )}
                                >
                                  {formatData(
                                    e3.value,
                                    e3.type,
                                    e3.unit,
                                    global_var.unit_type
                                  ) + formatUnit(e3.unit, global_var.unit_type)}
                                </div>
                              );
                            })}
                          </List>
                        </Card>
                      );
                    })}
                    <div>{"\u00A0"}</div>
                  </List>
                </div>
              ) : (
                <List
                  type="row"
                  align="left"
                  attach="space"
                  gap={0}
                  tight={false}
                >
                  <div
                    className={cx(
                      e.id.includes("sub") ? "text-subsection" : "text-title"
                    )}
                  >
                    {e.title}
                  </div>
                  <div className={cx("text-value")}>
                    {formatData(e.value, e.type, e.unit, global_var.unit_type) +
                      formatUnit(e.unit, global_var.unit_type)}
                  </div>
                </List>
              )}
            </List>
          );
        })}
      </List>
    </List>
  );
};

DataList.defaultProps = {
  id: "id",
  title: "title",
  children: [
    {
      id: "0",
      title: "children[0].title",
      value: "value",
      unit: "u.",
      type: "string",
    },
    {
      id: "1",
      title: "면적",
      value: 440.23,
      unit: "[area]",
      type: "number_detail_1",
    },
  ],
};

export default DataList;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
