import React, { useState, useEffect, useReducer } from "react";
// { useEffect }

import styles from "./SnackbarOverlay.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";
import Snackbar from "../atoms/Snackbar";
import useGlobalVar from "../hooks/useGlobalVar";

const cx = classNames.bind(styles);

const SnackbarOverlay = () => {
  const [mouse_over, setMouseOver] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [snackbar_queue, setSnackbarQueue] = useReducer((state, action) => {
    switch (action.type) {
      case "create":
        return [
          ...state,
          { ...action.data, hide: false, show: false, id: Date.now() },
        ];
      case "show":
        return [
          ...state.slice(0, state.length - 1),
          { ...state[state.length - 1], show: true },
        ];
      case "hide":
        return [{ ...state[0], hide: true, show: true }, ...state.slice(1)];
      case "delete":
        return [...state.slice(1)];
      case "hide by id":
        return [
          ...state.map((e) => (e.id == action.id ? { ...e, hide: true } : e)),
        ];
      case "delete by id":
        return [...state.filter((e) => e.id != action.id)];
    }
  }, []);
  const [settimeout, setSettimeout] = useState(false);

  useEffect(() => {
    if (global_var.snackbar) {
      setSnackbarQueue({ type: "create", data: global_var.snackbar });
    }
  }, [global_var.snackbar]);

  useEffect(() => {
    if (
      snackbar_queue.length > 0 &&
      snackbar_queue[snackbar_queue.length - 1].show == false
    ) {
      setTimeout(() => setSnackbarQueue({ type: "show" }), 30);
      if (settimeout) {
        clearTimeout(settimeout);
      }
      setSettimeout(
        setTimeout(() => {
          setSnackbarQueue({ type: "hide" });
          setTimeout(() => setSnackbarQueue({ type: "delete" }), 500);
        }, 3000)
      );
    } else if (snackbar_queue.length > 1 && snackbar_queue[0].hide == false) {
      setTimeout(() => setSnackbarQueue({ type: "hide" }), 0);
      setTimeout(() => setSnackbarQueue({ type: "delete" }), 500);
    }
  }, [snackbar_queue]);

  return (
    <div className={cx("wrapper")}>
      {snackbar_queue.map((e, idx) => {
        // console.log(snackbar_queue);
        return (
          <div
            key={e.id + idx}
            className={cx("frame-popup")}
            style={
              e.hide
                ? { bottom: "-80px", opacity: "0" }
                : e.show
                ? { bottom: "0", opacity: "1" }
                : {}
            }
          >
            <Snackbar
              {...e}
              onClick={(e) => {
                if (global_var.snackbar.onClick) {
                  global_var.snackbar.onClick(e);
                }
                setTimeout(
                  () => setSnackbarQueue({ type: "hide", id: e.id }),
                  0
                );
                setTimeout(
                  () => setSnackbarQueue({ type: "delete", id: e.id }),
                  500
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

SnackbarOverlay.defaultProps = {};

export default SnackbarOverlay;

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
