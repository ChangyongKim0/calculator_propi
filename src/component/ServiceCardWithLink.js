import React from "react";
// { useEffect }

import styles from "./ServiceCardWithLink.module.scss";
import classNames from "classnames/bind";
import Card from "../atoms/Card";
import List from "../atoms/List";
import Sheet from "../atoms/Sheet";
import Search from "../atoms/Search";
import { Link } from "react-router-dom";
import useGlobalVar from "../hooks/useGlobalVar";

const cx = classNames.bind(styles);

const ServiceCardWithLink = ({ link_to, src_img, title, text_illust }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  let new_text_illust = [];
  text_illust.forEach((e, idx) => {
    if (idx != 0) {
      new_text_illust.push(<br />);
    }
    new_text_illust.push(e);
  });

  return (
    <Link to={link_to}>
      <Card
        border={false}
        tight={false}
        // use_tooltip
        // tooltip={["지도 서비스로 바로가기"]}
      >
        <List align="left">
          <img className={cx("frame-image")} src={src_img} alt="Propi"></img>
          <div className={cx("text", "text-section")}>{title}</div>
          <div className={cx("text", "text-section-illust")}>
            {new_text_illust}
          </div>
        </List>
      </Card>
    </Link>
  );
};

ServiceCardWithLink.defaultProps = {
  link_to: "/",
  src_img: "/img/hey.png",
  title: "title",
  text_illust: ["text_illust[0]", "text_illust[1]"],
};

export default ServiceCardWithLink;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
