import React from "react";
// { useEffect }

import styles from "./LawSheet.module.scss";
import classNames from "classnames/bind";
import Card from "../atoms/Card";
import List from "../atoms/List";
import Overlay from "../atoms/Overlay";
import Sheet from "../atoms/Sheet";
import TextField from "../atoms/TextField";

const cx = classNames.bind(styles);

const sample_data = [
  {
    id: "law_structure",
    title: "법령의 구조 보기",
    children: [
      { id: "0", title: "헌법, 법, 행정명령, 자치법규 등의 구분" },
      { id: "1", title: "공문서와 사문서의 형식" },
    ],
  },
  {
    id: "law_list",
    title: "건축 관계법 리스트",
    children: [
      { id: "0", title: "필수로 확인해야 하는 법" },
      { id: "1", title: "건축물 용도별로 참고해야 하는 법" },
      { id: "2", title: "특정 지구구역에서 확인해야 하는 법" },
      { id: "3", title: "사업 방식에 따라 확인해야 하는 법" },
      { id: "4", title: "특수 상황에 따른 법" },
    ],
  },
  {
    id: "law_restriction",
    title: "상황별 규제 법령(국토교통부 제공)",
    children: [
      { id: "0", title: "용도지역, 지구에 따른 토지이용규제법령" },
      { id: "1", title: "행정구역별 용도지역, 지구에 따른 규제법령" },
      { id: "2", title: "건축물 용도에 따른 규제 안내" },
    ],
  },
  {
    id: "law_hierarchy",
    title: "주요 법의 하위 법령 체계",
    children: [
      { id: "0", title: "국토의 계획 및 이용에 관한 법률" },
      { id: "1", title: "건축법" },
      { id: "2", title: "주택법" },
      { id: "3", title: "주차장법" },
      { id: "4", title: "도시개발법" },
      { id: "5", title: "택지개발촉진법" },
      { id: "6", title: "도시재정비 촉진을 위한 특별법" },
    ],
  },
  {
    id: "law_detail",
    title: "법의 주요 내용 보기",
    children: [
      { id: "0", title: "국토의 계획 및 이용에 관한 법률" },
      { id: "1", title: "건축법" },
      { id: "2", title: "주택법" },
      { id: "3", title: "주차장법" },
      { id: "4", title: "도시개발법" },
      { id: "5", title: "택지개발촉진법" },
      { id: "6", title: "도시재정비 촉진을 위한 특별법" },
    ],
  },
];

const LawSheet = ({ children, nav_data, emph, onClick }) => {
  return (
    <div className={cx("wrapper")}>
      {children}
      <Sheet>
        <div className={cx("frame-top")}>
          <List gap="1">
            {/* <h2>법령 체계도</h2> */}
            <TextField
              label=""
              helper_text=""
              placeholder="법 내용 검색하기"
              style="filled"
            ></TextField>
          </List>
        </div>
        <div className={cx("frame-content")}>
          <List gap={0.5}>
            {sample_data.map((e, idx) => {
              return (
                <List key={idx} align="left" gap={0} tight={false}>
                  <div className={cx("text-section")}>{e.title}</div>
                  <List align="left" gap={0} tight={false}>
                    {e?.children == undefined ||
                      e.children.map((e2, idx2) => {
                        return (
                          <div key={idx2} className={cx("text-subsection")}>
                            {e2.title}
                          </div>
                        );
                      })}
                  </List>
                </List>
                // <Card
                //   key={idx}
                //   shape="rectangle"
                //   border={false}
                //   clickable={false}
                //   tight={false}
                //   padding="1"
                // >
                //   <div className={cx("text-section")}>{e.title}</div>
                // </Card>
              );
            })}
          </List>
        </div>
      </Sheet>
    </div>
  );
};

LawSheet.defaultProps = {
  nav_data: [
    { id: 0, icon: "default", title: "nav_data[0].title", link_to: "" },
    { id: 1, icon: "default", title: "nav_data[1].title", link_to: "" },
  ],
  emph: 1,
  onClick: (e) => {
    console.log("clicked default navigation with param:");
    console.log(e);
  },
};

export default LawSheet;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
