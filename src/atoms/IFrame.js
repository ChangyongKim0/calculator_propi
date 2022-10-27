import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./IFrame.module.scss";
import classNames from "classnames/bind";
import Tooltip from "./Tooltip";
import List from "./List";
import Icon from "./Icon";
import useGlobalVar from "../hooks/useGlobalVar";
import Card from "./Card";

const cx = classNames.bind(styles);

const IFrame = ({ url, onClick, use_external_link, use_share }) => {
  const [mouse_over, setMouseOver] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();

  useEffect(() => {
    const setHeight = () => {
      const element = document.getElementById("iframe-" + url);
      if (element) {
        const parent = document.getElementById("wrapper-" + url);
        if (parent) {
          element.style.height = Math.min(parent.clientHeight, 7200) + "px";
          element.style.width = Math.min(parent.clientWidth - 40, 10800) + "px";
        } else {
          element.style.height = "--90vh";
        }
      }
    };
    setTimeout(setHeight, 0);
    const event = window.addEventListener("resize", () => {
      setTimeout(setHeight, 0);
    });
    return () => {
      window.removeEventListener("resize", event);
    };
  }, []);

  return (
    <div id={"wrapper-" + url} className={cx("wrapper")}>
      <Card padding="0" border={false} clickable={false} tight>
        <List type="row" gap={0} align="left">
          <iframe
            id={"iframe-" + url}
            className={cx("frame-iframe")}
            src={url}
          ></iframe>
          <div className={cx("frame-button")}>
            <List type="column" gap={0.5}>
              <Icon
                type="close"
                onClick={() => {
                  onClick.Close(url);
                }}
                size="2"
                color="primary"
                use_tooltip
                tooltip={["닫기"]}
                tooltip_align="left-center"
              ></Icon>
              {use_external_link ? (
                <Icon
                  type="external_link"
                  onClick={() => {
                    // let win = window.open(
                    //   url,
                    //   "popup",
                    //   "top=100, left=100, width=1240, height=1080"
                    // );
                    onClick.Close(url);
                    let win = window.open(url, "_blank");
                    win.focus();
                    onClick.ExternalLink(url);
                  }}
                  size="2"
                  use_tooltip
                  tooltip={["새창에서 열기"]}
                  tooltip_align="left-center"
                ></Icon>
              ) : (
                <></>
              )}
              {use_share ? (
                <Icon
                  type="share"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(url)
                      .then(() => {
                        setGlobalVar({ snackbar: "link_is_copied", url: url });
                      })
                      .catch(() => {
                        setGlobalVar({
                          snackbar: "error",
                          error_name: "UrlCopyError",
                        });
                      });
                    onClick.Share(url);
                  }}
                  size="2"
                  use_tooltip
                  tooltip={["링크 공유하기"]}
                  tooltip_align="left-center"
                ></Icon>
              ) : (
                <></>
              )}
            </List>
          </div>
        </List>
      </Card>
    </div>
  );
};

IFrame.defaultProps = {
  url: "https://map.kakao.com/link/roadview/37.402056,127.108212",
  onClick: {
    Close: () => {
      console.log("clicked close of default IFrame");
    },
    Share: (url) => {
      console.log("clicked share of default IFrame with param");
      console.log(url);
    },
    ExternalLink: (url) => {
      console.log("clicked external link of default IFrame with param:");
      console.log(url);
    },
  },
  use_share: true,
  use_external_link: true,
};

export default IFrame;

// ### IFrame

// - shape: default / rectangle
// - children: any
// - padding: int
// - clickable: boolean
// - transparent: boolean
// - onClick: ()=>any
// - use_tooltip: boolean
// - tooltip: [any]
// - tight: boolean
