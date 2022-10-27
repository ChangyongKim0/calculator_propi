import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./SnackbarScenario.module.scss";
import Overlay from "../atoms/Overlay";
import List from "../atoms/List";
import useGlobalVar from "../hooks/useGlobalVar";
import Snackbar from "../atoms/Snackbar";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const SnackbarScenario = () => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [close, setClose] = useState(false);

  useEffect(() => {
    // console.log("useEffect");
  }, []);

  const getSnackbarScenarioData = (global_var) => {
    switch (global_var.snackbar) {
      case "too_zoomed_out":
        return {
          action: "축소하기",
          onClick: () => {
            setGlobalVar({ level: 5 });
            setClose(true);
          },
          children: "지도를 좀 더 축소해주세요.",
        };
      case "data_is_loading":
        return {
          action: "기다리기",
          onClick: () => {
            setClose(true);
          },
          children: "다른 정보를 가져오는 중이예요.",
        };
      case "link_is_copied":
        return {
          action: "열어보기",
          onClick: () => {
            let win = window.open(global_var.url, "_blank", "", false);
            win.focus();
            setClose(true);
          },
          children: "링크를 복사했어요!",
        };
      case "data_is_copied":
        return {
          action: "닫기",
          onClick: () => {
            setClose(true);
          },
          children: "정보를 복사했어요!",
        };
      case "error":
        return {
          action: "축소하기",
          onClick: () => {
            console.log(global_var.error_text);
            setClose(true);
          },
          children: "에러가 발생했어요",
        };
      default:
        return null;
    }
  };

  return (
    <Overlay
      backdrop={false}
      auto_close
      close={close}
      callback={() => {
        setClose(false);
        setGlobalVar({ snackbar: false });
      }}
      type="stack"
    >
      {getSnackbarScenarioData(global_var) != null ? (
        <Snackbar {...getSnackbarScenarioData(global_var)} />
      ) : (
        <></>
      )}
    </Overlay>
  );
};

export default SnackbarScenario;
