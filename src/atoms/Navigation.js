import React from "react";
// { useEffect }
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";
import classNames from "classnames/bind";
import Divider from "./Divider";
import List from "./List";
import Icon from "./Icon";
import useGlobalVar from "../hooks/useGlobalVar";

const cx = classNames.bind(styles);

const Navigation = ({ nav_data, emph, onClick }) => {
  const [global_var, setGlobalVar] = useGlobalVar();
  return (
    <div className={cx("wrapper")}>
      <List gap="0" align={global_var.media_mobile ? "left" : "center"}>
        <Link to="/">
          <div className={cx("frame-logo")}>
            <img
              className={cx("logo")}
              src="/img/logo512.png"
              alt="Propi"
            ></img>
            <div className={cx("logo-title")}>Propi</div>
          </div>
        </Link>
        <Divider length="90%" color="faint" />
        <div className={cx("frame-main")}>
          {nav_data.map((e, idx) => {
            return (
              <Link id={idx} to={e.link_to}>
                <div
                  className={cx("frame-button", emph == e.id ? "emph" : "")}
                  onClick={() => {
                    onClick(e);
                  }}
                >
                  <Icon
                    type={e.icon}
                    size={global_var.media_mobile ? "1.75" : "2.5"}
                    color={
                      emph == e.id
                        ? global_var.media_mobile
                          ? "primary"
                          : "white"
                        : global_var.media_mobile
                        ? "black"
                        : "default"
                    }
                    clickable={false}
                  />
                  <div className={cx("title", emph == e.id ? "emph" : "")}>
                    {e.title}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </List>
      <List gap="0">
        <Divider length="90%" color="faint" />
        <div className={cx("frame-footer")}></div>
      </List>
    </div>
  );
};

Navigation.defaultProps = {
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

export default Navigation;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
