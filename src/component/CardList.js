import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./CardList.module.scss";
import classNames from "classnames/bind";
import Tooltip from "../atoms/Tooltip";
import List from "../atoms/List";
import Card from "../atoms/Card";
import Divider from "../atoms/Divider";
import Input from "./Input";
import SummaryCard from "./SummaryCard";
import DataCard from "./DataCard";
import Button from "../atoms/Button";
import { _transformScroll } from "../util/alias";
import useGlobalVar from "../hooks/useGlobalVar";
import { encodeNumberList } from "../util/encodeData";
import { SERVICE_URI } from "../shortcut";
import useGlobalData from "../hooks/useGlobalData";

const cx = classNames.bind(styles);

const CardList = ({ data }) => {
  const [mouse_over, setMouseOver] = useState(false);

  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();

  useEffect(() => {
    const elements = [global_var.summary_name, ...data.map((e) => e.title)].map(
      (e) => document.getElementById("card-list-" + e)
    );

    const onScroll = () => {
      setGlobalVar({
        nav_emph_id: elements.reduce((prev, curr) => {
          if (
            curr.getBoundingClientRect().top - global_var.header_height - 16 <=
            0
          ) {
            return curr.id;
          }
          return prev;
        }, "card-list-" + global_var.summary_name),
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onscroll);
    };
  }, []);

  return (
    <List padding={0.75} gap={0} attach="left" tight={false}>
      <div
        className={cx("frame-top")}
        style={{ height: global_var.header_height + 32 }}
      ></div>
      <div className={cx("title")} id={"card-list-" + global_var.summary_name}>
        {global_var.summary_name}
      </div>
      <div
        className={cx(
          "frame-summary",
          "transform-scroll",
          global_var.touchable ? "touchable" : "clickable"
        )}
      >
        <List type="row" gap={0.75} tight={false}>
          {global_data.assumptions.map((e, idx) => {
            return <SummaryCard key={idx} {...e} id={idx} />;
          })}
          <div className={cx("frame-right")}></div>
        </List>
      </div>
      <List gap={1} attach="left" tight={false}>
        {data.map((e, idx) => {
          return (
            <List key={idx} gap={1} attach="left" tight={false}>
              <div
                key={idx}
                className={cx("title")}
                id={"card-list-" + e.title}
              >
                {e.title}
              </div>
              {e.data_list.map((e2, idx2) => {
                return <DataCard key={idx * 100 + idx2} data={e2} />;
              })}
            </List>
          );
        })}
        <Divider />
        <Button
          color="primary"
          onClick={() => {
            const url =
              SERVICE_URI +
              "shared/" +
              encodeNumberList(global_data.assumptions.map((e) => e.value));
            navigator.clipboard
              .writeText(url)
              .then(() => {
                setGlobalVar({
                  snackbar: {
                    text: "링크를 복사했어요.",
                    action: "공유하기",
                    onClick: () => {
                      navigator.share({ url: url });
                    },
                  },
                });
              })
              .catch(() => {
                setGlobalVar({
                  snackbar: {
                    text: "에러가 발생했어요.",
                    action: "신고하기",
                    onClick: (e) => {
                      console.log(e);
                    },
                  },
                });
              });
          }}
        >
          링크로 계산값 공유하기
        </Button>
        <Button
          color="transparent"
          onClick={() => {
            setGlobalVar({
              popup: {
                data: [
                  {
                    title: "문의하기",
                    button_list: [
                      {
                        children: "team.propi.2022@gmail.com",
                        color: "verylight",
                        onClick: () => {
                          navigator.clipboard
                            .writeText("team.propi.2022@gmail.com")
                            .then(() => {
                              setGlobalVar({
                                snackbar: {
                                  text: "메일주소를 복사했어요.",
                                  action: "메일 보내기",
                                  onClick: () => {
                                    window.open(
                                      "mailto:team.propi.2022@gmail.com?subject=propi%EC%97%90%20%EB%AC%B8%EC%9D%98%ED%95%98%EA%B8%B0&body=%EB%B0%9C%EC%83%9D%ED%95%9C%20%EC%97%90%EB%9F%AC%EB%82%98%20%EB%8B%A4%EC%96%91%ED%95%9C%20%EC%9D%98%EA%B2%AC%EC%9D%84%20%EB%B6%80%ED%83%81%EB%93%9C%EB%A0%A4%EC%9A%94."
                                    );
                                  },
                                },
                              });
                            });
                        },
                      },
                    ],
                  },
                  {
                    title: "후원하기",
                    button_list: [
                      {
                        children: "http://toss.me/teampropi",
                        color: "verylight",
                        onClick: () => {
                          navigator.clipboard
                            .writeText(`http://toss.me/teampropi\t\t="f"\t=G3`)
                            .then(() => {
                              setGlobalVar({
                                snackbar: {
                                  text: "주소를 복사했어요.",
                                  action: "토스에서 보기",
                                  onClick: () => {
                                    window.open("http://toss.me/teampropi");
                                  },
                                },
                              });
                            });
                        },
                      },
                    ],
                  },
                ],
              },
            });
          }}
        >
          문의 · 후원하기{" "}
        </Button>
        <div className={cx("frame-bottom")}></div>
      </List>
    </List>
  );
};

CardList.defaultProps = {
  data: [
    {
      title: "연간 수입가정",
      data_list: [
        [
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
        [
          {
            type: "default",
            disabled: false,
            operator: "×",
            title: "면적당 임대료",
            value: "40,000",
            unit: "원/평·월",
          },
          {
            type: "default",
            disabled: true,
            operator: "×",
            title: "",
            value: "12",
            unit: "개월",
          },
          { type: "divider" },
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "연 NOI",
            value: "624",
            unit: "백만원",
          },
        ],
        [
          {
            type: "rate",
            disabled: false,
            operator: "r",
            title: "연간 물가 상승률",
            value: "2.0",
            unit: "%",
          },
        ],
      ],
    },
  ],
};

export default CardList;

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
