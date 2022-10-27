import React, { useEffect, useState } from "react";
// { useEffect }

import styles from "./Overlay.module.scss";
import classNames from "classnames/bind";
import useToggle from "../hooks/useToggle";

const cx = classNames.bind(styles);

let auto_closer;

const Overlay = ({
  id,
  backdrop,
  color,
  in_container,
  onClick,
  type,
  children,
  auto_close,
  close,
  callback,
  full,
  padding,
}) => {
  const [new_backdrop, toggleBackdrop] = useToggle(backdrop);
  const [animation, setAnimation] = useState(true);

  useEffect(() => {
    console.log(in_container);
    if (in_container) {
      const handleParentScrollConstant = () => {
        handleParentScroll(in_container);
      };
      const handleParentResizeConstant = () => {
        handleParentResize(in_container);
      };
      const element = document.getElementById(
        (id ? id : "") + "backdrop_of_" + in_container
      );
      const container = document.getElementById(in_container);
      if (in_container && element && container) {
        console.log(container);
        console.log(in_container);
        console.log(element);
        console.log("ddddddddddd");
        console.log(container?.clientWidth);
        element.style.height = container?.clientHeight + "px";
        element.style.width = container?.clientWidth + "px";
        element.style.marginTop = container?.scrollTop + "px";
        container.addEventListener("scroll", handleParentScrollConstant);
        window.addEventListener("resize", handleParentResizeConstant);
      }
      return () => {
        if (in_container && element && container) {
          container.removeEventListener("scroll", handleParentScrollConstant);
          window.removeEventListener("resize", handleParentResizeConstant);
        }
      };
    }
  }, []);

  const handleParentScroll = (in_container) => {
    const element = document.getElementById(
      (id ? id : "") + "backdrop_of_" + in_container
    );
    if (element && in_container) {
      element.style.marginTop =
        document.getElementById(in_container)?.scrollTop + "px";
    }
    // document.getElementById("children_of_" + in_container).style.marginBottom =
    //   document.getElementById(in_container)?.clientHeight + "px";
  };

  const handleParentResize = () => {
    const element = document.getElementById(
      (id ? id : "") + "backdrop_of_" + in_container
    );
    if (element) {
      if (in_container) {
        element.style.height =
          document.getElementById(in_container)?.clientHeight + "px";
        element.style.width =
          document.getElementById(in_container)?.clientWidth + "px";
      } else {
        element.style.height = "var(--new100vh)";
        element.style.width = "100vw";
      }
    }
  };
  // useEffect(() => {
  //   if (in_container) {
  //     console.log(document.getElementById(in_container).offsetTop + "px");
  //   }
  // }, [document.getElementById(in_container)?.offsetTop]);

  useEffect(() => {
    if (!close) {
      setAnimation(true);
      if (auto_close) {
        auto_closer = setTimeout(() => {
          setAnimation(false);
          setTimeout(() => {
            callback();
          }, 300);
        }, 3000);
      }
    } else {
      setAnimation(false);
      clearTimeout(auto_closer);
      setTimeout(() => {
        callback();
      }, 300);
    }
  }, [close]);

  const onClickBackdrop = (e) => {
    if (e.target.id == "backdrop") {
      onClick.Backdrop();
    }
  };

  return (
    <div
      id={
        in_container
          ? (id ? id : "") + "backdrop_of_" + in_container
          : "backdrop"
      }
      className={cx(
        "wrapper",
        backdrop ? (backdrop == "faint" ? "faint" : "backdrop") : "",
        "type-" + type,
        (id ? id : "") + in_container ? "in-container" : ""
      )}
      onClick={(e) => {
        onClickBackdrop(e);
      }}
    >
      <div
        id={
          in_container
            ? (id ? id : "") + "children_of_" + in_container
            : "children"
        }
        className={cx(
          "frame",
          "type-" + type,
          animation ? "on" : "off",
          full ? "full" : ""
        )}
        style={{
          padding: padding + "rem",
          height: "calc(var(--new100vh) - calc(2 * " + padding + "rem))",
          width: "calc(100% - calc(2 * " + padding + "rem))",
        }}
      >
        {children}
      </div>
    </div>
  );
};

Overlay.defaultProps = {
  backdrop: "false",
  in_container: false,
  onClick: {
    Backdrop: () => {
      console.log("clicked backdrop of default overlay");
    },
  },
  type: "stack",
  auto_close: false,
  close: false,
  callback: () => {
    console.log("fired callback of default overlay");
  },
  padding: "0.5",
};

export default Overlay;

// ### ValuationCompText
// - backdrop: false / true / faint
// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
