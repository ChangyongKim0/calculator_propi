import React, { useEffect, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./NavigationBar.module.scss";
import Overlay from "../atoms/Overlay";
import Navigation from "../atoms/Navigation";
import useGlobalVar from "../hooks/useGlobalVar";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const NavigationBar = ({ children, emph }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  const nav_data = [
    {
      id: "dashboard",
      icon: "dashboard",
      title: "모아보기",
      link_to: "/dashboard",
    },
    { id: "map", icon: "map", title: "지도로 분석하기", link_to: "/" },
    { id: "law", icon: "law", title: "관계법령 챙겨보기", link_to: "/law" },
    { id: "news", icon: "news", title: "새로운 소식읽기", link_to: "/news" },
    {
      id: "test",
      icon: "default",
      title: "테스트 페이지",
      link_to: "/test",
    },
  ];

  return (
    <div className={cx("frame-box")}>
      {!global_var.media_mobile ? (
        <Navigation nav_data={nav_data} emph={emph ?? children}></Navigation>
      ) : global_var.show_nav ? (
        <Overlay
          type="center"
          backdrop={true}
          full
          onClick={{
            Backdrop: () => {
              setGlobalVar({ show_nav: false });
            },
          }}
        >
          <div className={cx("frame-nav")}>
            <Navigation
              nav_data={nav_data}
              emph={emph ?? children}
              onClick={() => {
                // setGlobalVar({ show_nav: false });
              }}
            ></Navigation>
          </div>
        </Overlay>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NavigationBar;
