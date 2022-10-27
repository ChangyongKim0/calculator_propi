import React, { useEffect, useReducer, useState } from "react";
// { useEffect }

import styles from "./MapSheet.module.scss";
import classNames from "classnames/bind";
import Card from "../atoms/Card";
import List from "../atoms/List";
import Sheet from "../atoms/Sheet";
import Search from "../atoms/Search";
import { Link } from "react-router-dom";
import useGlobalVar from "../hooks/useGlobalVar";
import ServiceCardWithLink from "./ServiceCardWithLink";
import DataList from "./DataList";
import useGlobalData from "../hooks/useGlobalData";
import formatMapApiData from "../util/formatMapApiData";
import Overlay from "../atoms/Overlay";
import Divider from "../atoms/Divider";

const cx = classNames.bind(styles);

const service_card_list = [
  {
    link_to: "/",
    src_img: "/img/hey.png",
    title: "지도로 분석하기",
    text_illust: [
      "토지와 건물 등의 다양한 정보를 ",
      "지도를 이용하여 쉽게 확인할 수 있어요.",
    ],
  },
  {
    link_to: "/law",
    src_img: "/img/hey.png",
    title: "관계법령 챙겨보기",
    text_illust: [
      "건축과 관련된 법을 모두 확인하고",
      "상황별로 필요한 법을 살펴볼 수 있어요.",
    ],
  },
  {
    link_to: "/news",
    src_img: "/img/hey.png",
    title: "새로운 소식읽기",
    text_illust: [
      "새로 바뀌는 법 내용이나",
      "주요 부서 보도자료를 확인할 수 있어요.",
    ],
  },
];

const default_nav_list = [
  { nav: "MY", title: "MY", id: "my", children: [] },
  {
    nav: "토지",
    title: "토지 정보",
    id: "land",
    children: [],
  },
  { nav: "건물", title: "건물 정보", id: "building", children: [] },
  { nav: "가격", title: "가격 정보", id: "price", children: [] },
];

const MapSheet = ({ force_data, force_state }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const [nav_emph, setNavEmph] = useState("land");
  const [nav_list, setNavList] = useState(default_nav_list);

  const [nav_dropdown, setNavDropDown] = useState(false);

  const [loading_text, handleLoadingText] = useReducer(
    (state, action) => {
      let new_state = { ...state };
      new_state.count += 1;
      let text = "";
      new Array((state.count % 4) + 1).fill(".").forEach((e) => (text += "."));
      new_state.text = text;
      return new_state;
    },
    { count: 0, text: "." }
  );

  useEffect(() => {
    if (global_data != {}) {
      const new_nav_list = default_nav_list.map((e) => {
        return {
          ...e,
          children: formatMapApiData(
            e.id + "_data",
            global_data,
            global_var
          ).map((e) => {
            return { nav: e.nav, title: e.title, id: e.id };
          }),
        };
      });
      setNavList(new_nav_list);
    }
  }, [global_data]);

  useEffect(() => {
    setInterval(() => {
      handleLoadingText();
    }, 1000);
  }, []);

  const offsetTop = (id) => {
    return document.getElementById("list_" + id).offsetTop;
  };

  return (
    <Sheet>
      <div>
        <div className={cx("frame-search")}>
          <Search
            onClick={(res) => {
              setGlobalVar({
                pnu: res.id,
                lat: res.y,
                lng: res.x,
                addr: res.address_name,
                road_addr: res.road_address_name,
                level: 2,
                land_clicked: true,
              });
            }}
          ></Search>
        </div>
        {global_var.state == "initial" && !force_data ? (
          <></>
        ) : (
          <List tight={false} gap="0" align="left">
            <div className={cx("frame-fixed")}>
              <div className={cx("text-emph")}>
                {global_var.address || "주소 없음"}
              </div>
              <div className={cx("text")}>
                {global_var.road_address || "도로명 주소 없음"}
              </div>
            </div>
            <Divider />
            <List
              type="row"
              tight={false}
              gap="0"
              align="left"
              attach="space"
              onMouseEnter={() => {
                setNavDropDown(true);
              }}
              onMouseLeave={() => {
                setNavDropDown(false);
              }}
              relative
            >
              {nav_list.map((e, idx) => {
                return (
                  <List type="column" gap="0" tight={false}>
                    <div
                      key={idx}
                      className={cx(
                        "frame-navigation",
                        nav_emph.split("_")[0] == e.id ? "emph" : ""
                      )}
                      onClick={() => {
                        document
                          .getElementById("Sheet_frame_content")
                          .scrollTo(0, offsetTop(e.id));
                        setNavEmph(e.id);
                      }}
                    >
                      {e.nav}
                    </div>
                  </List>
                );
              })}{" "}
              {nav_dropdown ? (
                <div
                  className={cx("frame-dropdown")}
                  onClick={() => {
                    setNavDropDown(false);
                  }}
                >
                  <List
                    type="row"
                    tight={false}
                    gap="0"
                    align="left"
                    attach="space"
                  >
                    {nav_list.map((e, idx) => {
                      return (
                        <List type="column" gap="0" tight={false}>
                          {e.children.map((e2, idx2) => (
                            <div
                              key={idx2}
                              className={cx(
                                "frame-navigation-dropdown",
                                nav_emph == e2.id ? "emph" : ""
                              )}
                              onClick={() => {
                                document
                                  .getElementById("Sheet_frame_content")
                                  .scrollTo(0, offsetTop(e2.id));
                                setTimeout(() => {
                                  setNavEmph(e2.id);
                                }, 100);
                              }}
                            >
                              {e2.nav}
                            </div>
                          ))}
                        </List>
                      );
                    })}
                  </List>
                </div>
              ) : (
                <></>
              )}
            </List>
          </List>
        )}
      </div>
      {global_var.state == "initial" && !force_data ? (
        <div className={cx("frame-service")}>
          <List tight={false} gap="1">
            {service_card_list.map((e, idx) => {
              return <ServiceCardWithLink key={idx} {...e} />;
            })}
          </List>
        </div>
      ) : (
        <div
          id="MapSheet_frame_content"
          className={cx("frame-content", global_var.state)}
        >
          <List tight={false} gap="0.5">
            <List tight={false} gap="0.25">
              <div id="list_my" className={cx("frame-data", "text-title")}>
                MY
              </div>
              {formatMapApiData("my_data", global_data).map((e, idx) => {
                return (
                  <div
                    id={"list_" + e.id}
                    key={idx}
                    className={cx("frame-data")}
                    onMouseOver={() => setNavEmph(e.id)}
                  >
                    <DataList key={idx} {...e} />
                  </div>
                );
              })}
            </List>
            <List tight={false} gap="0.25">
              <div id="list_land" className={cx("frame-data", "text-title")}>
                토지 정보
              </div>
              {formatMapApiData("land_data", global_data).map((e, idx) => {
                return (
                  <div
                    id={"list_" + e.id}
                    key={idx}
                    className={cx("frame-data")}
                    onMouseOver={() => setNavEmph(e.id)}
                  >
                    <DataList key={idx} {...e} />
                  </div>
                );
              })}
            </List>
            <List tight={false} gap="0.25">
              <div
                id="list_building"
                className={cx("frame-data", "text-title")}
              >
                건물 정보
              </div>
              {formatMapApiData("building_data", global_data, global_var).map(
                (e, idx) => {
                  return (
                    <div
                      id={"list_" + e.id}
                      key={idx}
                      className={cx("frame-data")}
                      onMouseOver={() => setNavEmph(e.id)}
                    >
                      <DataList key={idx} {...e} />
                    </div>
                  );
                }
              )}
            </List>
            <List
              tight={false}
              gap="0.125"
              onMouseOver={() => setNavEmph("price_")}
            >
              <div id="list_price" className={cx("frame-data", "text-title")}>
                가격 정보
              </div>
              <div id={"list_"} className={cx("frame-data")}>
                <DataList></DataList>
              </div>
              <div className={cx("frame-data")}>
                <DataList></DataList>
              </div>
            </List>
          </List>
          {global_var.state == "loading" || force_state == "loading" ? (
            <Overlay
              backdrop="faint"
              in_container="Sheet_frame_content"
              type="center"
            >
              <div className={cx("text-overlay")}>
                정보를 가져오는 중입니다{loading_text?.text}
              </div>
            </Overlay>
          ) : (
            <></>
          )}
          {global_var.state == "fail" ? (
            <Overlay
              backdrop="faint"
              in_container="Sheet_frame_content"
              type="center"
            >
              <div className={cx("text-overlay")}>
                이 필지는 아직 공식 정보가 없어요.
              </div>
            </Overlay>
          ) : (
            <></>
          )}
        </div>
      )}
    </Sheet>
  );
};

MapSheet.defaultProps = {
  force_data: false,
  force_state: "success",
};

export default MapSheet;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
