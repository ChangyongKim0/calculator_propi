import React, { useState, useEffect, useReducer } from "react";
// { useEffect }

import styles from "./Numberpad.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";
import Snackbar from "../atoms/Snackbar";
import useGlobalVar from "../hooks/useGlobalVar";
import useGlobalData from "../hooks/useGlobalData";
import NumberpadButton from "../component/NumberpadButton";
import { ReactComponent as NumberpadHandle } from "../svgs/NumberpadHandle.svg";
import { unformatData } from "../util/formatData";
import useButtonGesture from "../hooks/useButtonGesture";
import Icon from "../atoms/Icon";
import { ReactComponent as NumberpadChangeUnit } from "../svgs/NumberpadChangeUnit.svg";
import { encodeNumberList } from "../util/encodeData";

const cx = classNames.bind(styles);

const Numberpad = ({ text, action, onClick, active }) => {
  const [mouse_over, setMouseOver] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const [settimeout, setSettimeout] = useState(false);
  const [msg, setMsg] = useState(false);
  const [local_data, setLocalData] = useState(false);

  const [
    button_state,
    onMouseDown,
    onMouseUp,
    useEffectContent,
    style_content,
  ] = useButtonGesture(
    { backgroundColor: "#ffffff" },
    { backgroundColor: "#f1f3f4" },
    500
  );

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

  useEffect(useEffectContent, [button_state]);
  useEffect(useEffectContentOfChange, [change_button_state]);

  const eraseLastNumber = (str, pos) => {
    if (str.includes(".")) {
      if (str.split(".")[1].length >= pos) {
        return str.split(".")[0] + "." + str.split(".")[1].slice(0, pos - 1);
      }
    }
    return str.slice(0, str.length - 1);
  };

  // prev_value, new_value, operator, prev_operator
  const reduceNumberpadState = (state, action) => {
    switch (action.data) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
      case ".":
        if (state.operator) {
          if (action.data == ".") {
            return {
              prev_value: state.new_value,
              new_value: "0.",
              operator: false,
              prev_operator: state.operator,
            };
          }
          return {
            prev_value: state.new_value,
            new_value: action.data,
            operator: false,
            prev_operator: state.operator,
          };
        }
        if (action.data == "." && state.new_value.includes(".")) {
          return { ...state };
        }
        if (state.new_value.includes(".")) {
          console.log(state.new_value.split(".")[1].length);
          if (state.new_value.split(".")[1].length >= 2) {
            setMsg({
              text: "소숫점 뒤에 너무 많은 숫자가 있어요.",
              action: "다시 입력하기",
            });
            return { ...state };
          }
        }
        return { ...state, new_value: state.new_value + action.data };
      case "00":
        if (state.operator) {
          return {
            prev_value: state.new_value,
            new_value: "100",
            operator: false,
            prev_operator: state.operator,
          };
        }
        return {
          ...state,
          new_value:
            isNaN(Number(state.new_value)) || state.new_value == ""
              ? "100"
              : (Number(state.new_value) * 100).toString(),
        };
      case "back":
        if (
          state.new_value.length == 1 ||
          (state.new_value.length == 2 && state.new_value[0] == "-")
        ) {
          if (state.prev_value != "") {
            return {
              ...state,
              prev_value: "",
              new_value: state.prev_value,
              operator: state.prev_operator,
            };
          } else {
            return {
              prev_value: "",
              new_value: "",
              operator: false,
              prev_operator: false,
            };
          }
        }
        if (state.operator) {
          return {
            prev_value: "",
            new_value: eraseLastNumber(state.new_value, 2),
            operator: false,
            prev_operator: false,
          };
        }
        return {
          ...state,
          new_value: eraseLastNumber(state.new_value, 2),
        };
      case "＋":
      case "－":
      case "×":
      case "÷":
      case "enter":
      case "up":
      case "down":
        if (state.operator) {
          return { ...state, operator: action.data };
        }
      case "×":
        if (state.new_value == "" && "＋－×÷".includes(action.data)) {
          setMsg({
            text: "값이 먼저 입력되어야 해요.",
            action: "다시 입력하기",
            onClick: () => {},
          });
          return { ...state };
        }
        if (state.prev_operator == "÷" && Number(state.new_value) == 0) {
          setMsg({
            text: "0으로 나눌 수 없어요.",
            action: "다시 입력하기",
          });
          return { ...state };
        }
        if (state.prev_operator == false) {
          if (action.callback) {
            action.callback({ ...state, operator: action.data });
          }
          return { ...state, operator: action.data };
        }
        if (action.callback) {
          action.callback({
            ...state,
            new_value: _calculate(state.prev_operator)(
              Number(state.prev_value),
              Number(state.new_value)
            ).toString(),
            operator: action.data,
          });
        }
        return {
          ...state,
          new_value: _calculate(state.prev_operator)(
            Number(state.prev_value),
            Number(state.new_value)
          ).toString(),
          operator: action.data,
        };
      case "reset":
        return {
          prev_value: "",
          new_value: "",
          operator: false,
          prev_operator: false,
        };
      default:
        return { ...state };
    }
  };

  useEffect(() => {
    if (msg) {
      setGlobalVar({ snackbar: msg });
    }
  }, [msg]);

  useEffect(() => {
    if (local_data) {
      setGlobalData(local_data);
      setGlobalVar({
        encoded_data: encodeNumberList(
          local_data.assumptions.map((e) => e.value)
        ),
      });
    }
  }, [local_data]);

  const _calculate = (data) => {
    switch (data) {
      case "＋":
        return (a, b) => a + b;
      case "－":
        return (a, b) => a - b;
      case "×":
        return (a, b) => a * b;
      case "÷":
        return (a, b) => a / b;
      default:
        return (a, b) => b;
    }
  };

  const [numberpad_state, setNumberpadState] = useReducer(
    reduceNumberpadState,
    {
      prev_value: "",
      new_value: "",
      operator: false,
      prev_operator: false,
    }
  );

  useEffect(() => {
    if (!global_var.use_numberpad) {
      setTimeout(() => setNumberpadState({ data: "reset" }), 300);
    }
  }, [global_var.use_numberpad]);

  const number_pad_data = [
    ["÷", "×", "－", "＋"],
    ["7", "8", "9", "back"],
    ["4", "5", "6", "up"],
    ["1", "2", "3", "down"],
    ["00", "0", ".", "enter"],
  ];

  const getButtonStyle = (data) => {
    const output = {
      children: data,
    };
    switch (data) {
      case ",000":

      case "÷":
    }
    return output;
  };

  return (
    <div className={cx("wrapper")} style={style_content}>
      <List tight={false} attach="space">
        <div
          className={cx("frame-handler")}
          onClick={() => setGlobalVar({ use_numberpad: false })}
        >
          <NumberpadHandle />
        </div>
        <Input
          active
          {...global_data.assumptions[global_data.editing_idx]}
          {...(numberpad_state.new_value == ""
            ? {}
            : { string_value: numberpad_state.new_value })}
        />
        {number_pad_data.map((e, idx) => {
          return (
            <div key={idx} className={cx("frame-button-row")}>
              {e.map((e2, idx2) => {
                const proceedButtonGesture = () => {
                  if (e2 == "up") {
                    setTimeout(
                      () => {
                        setGlobalData({
                          editing_idx:
                            global_data.editing_idx - 1 < 0
                              ? global_data.assumptions.length - 1
                              : global_data.editing_idx - 1,
                        });
                        setNumberpadState({ data: "reset" });
                      },
                      numberpad_state.new_value == "" ||
                        numberpad_state.new_value == "."
                        ? 0
                        : 300
                    );
                  } else if (e2 == "down") {
                    setTimeout(
                      () => {
                        setGlobalData({
                          editing_idx:
                            global_data.editing_idx + 1 >=
                            global_data.assumptions.length
                              ? 0
                              : global_data.editing_idx + 1,
                        });
                        setNumberpadState({ data: "reset" });
                      },
                      numberpad_state.new_value == "" ||
                        numberpad_state.new_value == "."
                        ? 0
                        : 300
                    );
                  } else if (e2 == "enter") {
                    setTimeout(
                      () => setGlobalVar({ use_numberpad: false }),
                      numberpad_state.new_value == "" ||
                        numberpad_state.new_value == "."
                        ? 0
                        : 300
                    );
                  } else {
                    setNumberpadState({ data: e2 });
                  }
                };
                const proceedForValidData = (data) => {
                  setLocalData({
                    assumptions: global_data.assumptions.map((e, idx) => {
                      return idx == global_data.editing_idx
                        ? {
                            ...e,
                            value: unformatData(
                              Number(data.new_value),
                              e.unit,
                              global_var.unit_type
                            ),
                          }
                        : e;
                    }),
                  });
                  onMouseDown();
                  setTimeout(onMouseUp, 0);
                  // setNumberpadState({ data: "reset" });
                  proceedButtonGesture();
                };
                const onClickButton = () => {
                  if (
                    (e2 == "enter" || e2 == "up" || e2 == "down") &&
                    numberpad_state.new_value != "" &&
                    numberpad_state.new_value != "."
                  ) {
                    setNumberpadState({
                      data: e2,
                      callback: (data) => {
                        if (
                          global_data.assumptions[global_data.editing_idx]
                            .isValid
                        ) {
                          const is_valid = global_data.assumptions[
                            global_data.editing_idx
                          ].isValid(Number(data.new_value));
                          if (!is_valid.value) {
                            setMsg({
                              text: is_valid.message,
                              action: "다시 입력하기",
                              onClick: () =>
                                setNumberpadState({ data: "reset" }),
                            });
                          } else {
                            proceedForValidData(data);
                          }
                        } else {
                          proceedForValidData(data);
                        }
                      },
                    });
                  } else {
                    proceedButtonGesture();
                  }
                };
                return (
                  <NumberpadButton
                    key={idx * 100 + idx2}
                    onClick={onClickButton}
                    data={e2}
                    active={e2 == numberpad_state.operator}
                  />
                );
              })}
            </div>
          );
        })}
        <div className={cx("frame-bottom")}></div>
      </List>
      <div
        className={cx("frame-button-wrapper")}
        style={
          global_data.assumptions[global_data.editing_idx]?.unit?.match(
            /area\]/g
          ) && global_var.use_numberpad
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
  );
};

Numberpad.defaultProps = {
  text: "text",
  action: "action",
  onClick: (e) => {
    console.log("snakbar overlay is clicked with data");
    console.log(e);
  },
};

export default Numberpad;

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
