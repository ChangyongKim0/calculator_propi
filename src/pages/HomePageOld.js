import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./HomePageOld.module.scss";
import useGlobalVar, { getCookie } from "../hooks/useGlobalVar";
import List from "../atoms/List";
import CardList from "../component/CardList";
import Header from "../component/Header";
import {
  default_assumption_data,
  getCardListData,
  getValueData,
} from "../util/formatCardListData";
import SnackbarOverlay from "../component/SnackbarOverlay";
import NumberpadOverlay from "../component/NumberpadOverlay";
import { decodeToNumberList, encodeNumberList } from "../util/encodeData";
import { formatData } from "../util/formatData";
import useGlobalData from "../hooks/useGlobalData";
import { _transformScroll } from "../util/alias";
import PopupOverlay from "../component/PopupOverlay";
import { useMemo } from "react";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const HomePageOldOld = ({ match }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const [card_list_data, setCardListData] = useState(
    useMemo(() => getValueData(default_assumption_data), [])
  );
  const [overlay_stack, setOverlayStack] = useState(false);
  const [prevent_shrink, setPreventShrink] = useState({
    value: false,
    target_y: 0,
  });
  const [header_shrink, setHeaderShrink] = useReducer(
    (state, action) => {
      const delta_y = action.scroll_y - state.scroll_y;
      if (action.reset) {
        return { value: 0, scroll_y: window.scrollY };
      } else if (delta_y > 0) {
        return {
          value: Math.min(state.value + delta_y / (action.height - 64), 1),
          scroll_y: action.scroll_y,
        };
      }
      return {
        value: Math.max(state.value + delta_y / (action.height - 64), 0),
        scroll_y: action.scroll_y,
      };
    },
    { value: 0, scroll_y: window.scrollY }
  );

  useEffect(() => {
    if (
      Math.round(window.scrollY) == Math.round(prevent_shrink.target_y) &&
      prevent_shrink.value
    ) {
      setPreventShrink({ value: false, target_y: 0 });
      setHeaderShrink({ reset: true, height: global_var.header_height });
    } else if (window.scrollY == 0) {
      setHeaderShrink({ reset: true, height: global_var.header_height });
    }
  }, [window.scrollY, prevent_shrink]);

  useEffect(() => {
    let new_assumptions = [];

    getCardListData(getValueData(default_assumption_data)).map((e) => {
      e.data_list.map((e2) => {
        e2.map((e3) => {
          if (!e3.disabled && (e3.type == "rate" || e3.type == "default")) {
            new_assumptions.push(e3);
          }
        });
      });
    });

    setGlobalData({ assumptions: new_assumptions });
    if (match.params.data != undefined) {
      if (decodeToNumberList(match.params.data).length != 9) {
        setGlobalVar({
          snackbar: {
            text: "유효하지 않은 링크로, 값이 초기화됩니다.",
            action: "",
          },
        });
      } else {
        setGlobalVar({
          snackbar: {
            text: "반올림으로 인해 일부 값에\n차이가 생길 수 있어요.",
            action: "",
          },
        });
        new_assumptions = [];

        getCardListData(
          getValueData(decodeToNumberList(match.params.data))
        ).map((e) => {
          e.data_list.map((e2) => {
            e2.map((e3) => {
              if (!e3.disabled && (e3.type == "rate" || e3.type == "default")) {
                new_assumptions.push(e3);
              }
            });
          });
        });

        setGlobalData({ assumptions: new_assumptions });
      }
    } else {
      const assumption_value_list = decodeToNumberList(global_var.encoded_data);
      if (assumption_value_list.length == 9) {
        new_assumptions = [];

        getCardListData(getValueData(assumption_value_list)).map((e) => {
          e.data_list.map((e2) => {
            e2.map((e3) => {
              if (!e3.disabled && (e3.type == "rate" || e3.type == "default")) {
                new_assumptions.push(e3);
              }
            });
          });
        });
        console.log(new_assumptions);

        setGlobalData({ assumptions: new_assumptions });
      }
    }
    // console.log("useEffect");
  }, []);

  useEffect(() => {
    const listener = (e) => {
      if (window.scrollY > 0) {
        setHeaderShrink({
          scroll_y: window.scrollY,
          height: global_var.header_height,
        });
      }
    };
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [global_var.header_height]);

  useEffect(() => {
    if (global_data.assumptions.length == 9) {
      setCardListData(
        getValueData(global_data.assumptions.map((e) => e.value))
      );
    }
  }, [global_data.assumptions]);

  useEffect(() => {
    Array.from(document.getElementsByClassName("transform-scroll")).map((e) =>
      e.addEventListener("wheel", _transformScroll)
    );
    return () => {
      Array.from(document.getElementsByClassName("transform-scroll")).map(
        (e, idx) => {
          e.removeEventListener("wheel", _transformScroll);
        }
      );
    };
  }, []);

  return (
    <div
      className={cx("wrapper")}
      style={prevent_shrink.value ? { pointerEvents: "none" } : {}}
      // onClick={() => {
      //   setCardListData(
      //     getCardListData(getValueData(decodeToNumberList(match.params.data)))
      //   );
      // }}
    >
      <Header
        shrink={prevent_shrink.value ? 0 : header_shrink.value}
        onClick={(e) => {
          setPreventShrink({
            value: true,
            target_y:
              document.getElementById("card-list-" + e.text).offsetTop -
              global_var.header_height -
              16,
          });
          window.scroll({
            top:
              document.getElementById("card-list-" + e.text).offsetTop -
              global_var.header_height -
              16,
            behavior: "smooth",
          });
        }}
        nav_list={[
          global_var.summary_name,
          ...getCardListData(card_list_data).map((e) => e.title),
        ]}
        value={card_list_data.appropriate_buying_price}
        illust={[
          [
            {
              title: "연 임대료 상승률(r)",
              value: card_list_data.inflation_rate,
              unit: "%",
              type: "rate",
            },
            {
              title: "운용기간(t)",
              value: card_list_data.period,
              unit: "년",
              type: "default",
            },
          ],
          [
            {
              title: "연 NOI",
              value: card_list_data.noi,
              type: "default",
              unit: "백만원",
            },
            {
              title: "매각금액",
              value: card_list_data.selling_price,
              type: "default",
              unit: "백만원",
            },
            {
              title: "IRR",
              value: card_list_data.irr,
              type: "rate",
              unit: "%",
            },
          ],
        ]}
      />
      <CardList data={getCardListData(card_list_data)} />
      <NumberpadOverlay />
      <PopupOverlay />
      <SnackbarOverlay />
    </div>
  );
};

export default HomePageOld;
