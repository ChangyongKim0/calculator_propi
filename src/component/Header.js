import React, { useState, useEffect, useReducer, useRef } from "react";
// { useEffect }

import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";
import SummaryCard from "./SummaryCard";
import DataCard from "./DataCard";
import Button from "../atoms/Button";
import NavButton from "./NavButton";
import useGlobalVar from "../hooks/useGlobalVar";
import { formatData, formatUnit } from "../util/formatData";
import useGlobalData from "../hooks/useGlobalData";
import useButtonGesture from "../hooks/useButtonGesture";
import { ReactComponent as NumberpadChangeUnit } from "../svgs/NumberpadChangeUnit.svg";

const cx = classNames.bind(styles);

const Header = ({
  name,
  title,
  value,
  unit,
  illust,
  nav_list,
  onClick,
  shrink,
}) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const [nav_data, setNavData] = useReducer(
    (state, action) => {
      return [...state].map((e) => {
        return { text: e.text, focused: "card-list-" + e.text == action.text };
      });
    },
    nav_list.map((e, idx) => {
      return { text: e, focused: idx == 0 ? true : false };
    })
  );

  const frame_illust = useRef();

  const [
    change_button_state,
    onMouseDownChange,
    onMouseUpChange,
    useEffectContentOfChange,
    style_content_of_change,
  ] = useButtonGesture(
    { backgroundColor: "#ffffff" },
    { backgroundColor: "#dadce0" },
    500
  );

  useEffect(() => {
    const event = () =>
      setGlobalVar({ header_height: frame_illust.current.clientHeight + 132 });
    window.addEventListener("resize", event);
    return () => {
      window.removeEventListener("resize", event);
    };
  }, []);

  useEffect(() => {
    setTimeout(
      () =>
        setGlobalVar({
          header_height: frame_illust.current.clientHeight + 132,
        }),
      0
    );
  }, [global_data.assumptions]);

  useEffect(() => {
    setNavData({ text: global_var.nav_emph_id });
  }, [global_var.nav_emph_id]);

  return (
    <div className={cx("wrapper")}>
      <div
        className={cx("frame-header")}
        id="header-wrapper"
        style={{
          height:
            global_var.header_height -
            shrink * (global_var.header_height - 64) +
            "px",
        }}
      >
        <div
          className={cx("frame-title")}
          onClick={
            shrink < 0.05
              ? () => {}
              : () => {
                  window.scrollBy({
                    top: 64 - global_var.header_height,
                    behavior: "smooth",
                  });
                }
          }
          style={shrink < 0.05 ? {} : { cursor: "pointer" }}
        >
          <div className={cx("frame-logo")}>
            <List
              type="row"
              attach="space"
              gap={0.25}
              align="right"
              tight={false}
            >
              <div
                className={cx("text-logo")}
                style={{ fontSize: 16 - shrink * 4 + "px" }}
              >
                Calculator × propi
              </div>
              <div
                className={cx("text-title")}
                style={{
                  opacity: 1 - shrink * 2,
                  fontSize: 16 - shrink * 4 + "px",
                }}
              >
                {name}
              </div>
            </List>
          </div>
          <div
            className={cx("frame-spacer")}
            style={{ height: 28 - shrink * 28 + "px" }}
          ></div>

          <List padding={0} gap={0.75} align="left" tight={false}>
            <div
              className={cx("frame-result")}
              onClick={
                shrink >= 0.05
                  ? () => {}
                  : () => {
                      window.scrollBy({
                        top: global_var.header_height - 64,
                        behavior: "smooth",
                      });
                    }
              }
              style={shrink >= 0.05 ? {} : { cursor: "pointer" }}
            >
              <List
                type="row"
                attach="space"
                gap={0.25}
                align="right"
                tight={false}
              >
                <div className={cx("text-name")}>{title}</div>
                <List type="row" gap={0.25} align="right">
                  <div className={cx("text-value")}>
                    {formatData(value, "default", unit, global_var.unit_type)}
                  </div>
                  <div className={cx("text-unit")}>
                    {formatUnit(unit, global_var.unit_type)}
                  </div>
                </List>
              </List>
            </div>
            <div
              className={cx("text-illust")}
              style={{ opacity: 2 - shrink * 3 }}
              ref={frame_illust}
            >
              {illust.map((e, idx) => (
                <div key={idx}>
                  {e.map((e2, idx2) => {
                    return (
                      <span key={idx2}>
                        {(idx2 == 0 ? "" : " · ") + e2.title + " "}
                        <span style={{ color: "#3c3c3c", fontWeight: 600 }}>
                          {formatData(
                            e2.value,
                            e2.type,
                            e2.unit,
                            global_var.unit_type
                          )}
                        </span>
                        {formatUnit(e2.unit, global_var.unit_type)}
                        {idx == 0 && idx2 == e.length - 1 ? " 가정" : ""}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </List>
        </div>
        <div
          className={cx(
            "frame-nav",
            "transform-scroll",
            global_var.touchable ? "touchable" : "clickable"
          )}
          style={{ opacity: 1 - shrink * 3 }}
        >
          <List type="row" gap={0}>
            {nav_data.map((e, idx) => {
              return (
                <NavButton
                  key={idx}
                  focused={e.focused}
                  onClick={() => {
                    onClick({ type: "nav", text: e.text });
                  }}
                >
                  {e.text}
                </NavButton>
              );
            })}
            <div className={cx("frame-right")}></div>
          </List>
        </div>
      </div>
      <div className={cx("frame-button-spacer")}>
        <div
          className={cx("frame-button-wrapper")}
          style={
            !global_var.use_numberpad
              ? { opacity: 1, pointerEvents: "auto" }
              : { opacity: 0, pointerEvents: "none" }
          }
        >
          <div
            className={cx("frame-button")}
            onTouchStart={
              global_var.touchable
                ? () => {
                    onMouseDownChange();
                    global_var.unit_type == "py"
                      ? setGlobalVar({ unit_type: "sqm" })
                      : setGlobalVar({ unit_type: "py" });
                    setTimeout(onMouseUpChange, 500);
                  }
                : () => {}
            }
            onMouseDown={
              global_var.touchable
                ? () => {}
                : () => {
                    onMouseDownChange();
                    global_var.unit_type == "py"
                      ? setGlobalVar({ unit_type: "sqm" })
                      : setGlobalVar({ unit_type: "py" });
                    setTimeout(onMouseUpChange, 500);
                  }
            }
            onTouchEnd={global_var.touchable ? onMouseUpChange : () => {}}
            onMouseUp={global_var.touchable ? () => {} : onMouseUpChange}
            style={style_content_of_change}
          >
            <NumberpadChangeUnit />
            <span className={cx("text-button")}>단위 바꾸기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Header.defaultProps = {
  name: "매입금액 약식 계산하기",
  title: "적정 매입금액",
  value: 12666,
  type: "default",
  unit: "백만원",
  illust: [
    "연간 물가 상승률(r) 2.0% · 운용기간(t) 5년 가정 | 연 NOI 624백만원 · 매각금액 13,779백만원 · IRR 7.0%",
  ],
  nav_list: [
    "가정치 요약",
    "연간 수입가정",
    "매각가정",
    "재무가정",
    "매입금액 산정",
  ],
  onClick: (e) => {
    console.log("clicked header with data");
    console.log(e);
  },
  shrink: 0,
};

export default Header;

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
