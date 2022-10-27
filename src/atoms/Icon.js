import React, { Children, useState } from "react";
// { useEffect }

import styles from "./Icon.module.scss";
import classNames from "classnames/bind";
// 아래에 개별 아이콘 추가
import { ReactComponent as Add } from "../svgs/Add.svg";
import { ReactComponent as Analysis } from "../svgs/Analysis.svg";
import { ReactComponent as Autocad } from "../svgs/Autocad.svg";
import { ReactComponent as Building } from "../svgs/Building.svg";
import { ReactComponent as Check } from "../svgs/Check.svg";
import { ReactComponent as City } from "../svgs/City.svg";
import { ReactComponent as Close } from "../svgs/Close.svg";
import { ReactComponent as Copy } from "../svgs/Copy.svg";
import { ReactComponent as Dashboard } from "../svgs/Dashboard.svg";
import { ReactComponent as Delete } from "../svgs/Delete.svg";
import { ReactComponent as Detail } from "../svgs/Detail.svg";
import { ReactComponent as Down } from "../svgs/Down.svg";
import { ReactComponent as Erase } from "../svgs/Erase.svg";
import { ReactComponent as Excel } from "../svgs/Excel.svg";
import { ReactComponent as ExternalLink } from "../svgs/ExternalLink.svg";
import { ReactComponent as Illustrator } from "../svgs/Illustrator.svg";
import { ReactComponent as Land } from "../svgs/Land.svg";
import { ReactComponent as Law } from "../svgs/Law.svg";
import { ReactComponent as Left } from "../svgs/Left.svg";
import { ReactComponent as Map } from "../svgs/Map.svg";
import { ReactComponent as News } from "../svgs/News.svg";
import { ReactComponent as PickEach } from "../svgs/PickEach.svg";
import { ReactComponent as PickFromData } from "../svgs/PickFromData.svg";
import { ReactComponent as PickRange } from "../svgs/PickRange.svg";
import { ReactComponent as Right } from "../svgs/Right.svg";
import { ReactComponent as Search } from "../svgs/Search.svg";
import { ReactComponent as Share } from "../svgs/Share.svg";
import { ReactComponent as ThreeBay } from "../svgs/ThreeBay.svg";
import { ReactComponent as Up } from "../svgs/Up.svg";
import { ReactComponent as User } from "../svgs/User.svg";
import Tooltip from "./Tooltip";

const cx = classNames.bind(styles);

const Icon = ({
  type,
  color,
  clickable,
  onClick,
  use_tooltip,
  tooltip,
  size,
  disable,
  tooltip_align,
}) => {
  // 아래에 개별 아이콘 호출어 추가
  const getIcon = (type) => {
    const default_style = { width: "1000px", height: "1000px" };
    switch (type) {
      case "add":
        return <Add {...default_style} />;
      case "analysis":
        return <Analysis {...default_style} />;
      case "autocad":
        return <Autocad {...default_style} />;
      case "building":
        return <Building {...default_style} />;
      case "check":
        return <Check {...default_style} />;
      case "city":
        return <City {...default_style} />;
      case "close":
        return <Close {...default_style} />;
      case "copy":
        return <Copy {...default_style} />;
      case "dashboard":
        return <Dashboard {...default_style} />;
      case "delete":
        return <Delete {...default_style} />;
      case "detail":
        return <Detail {...default_style} />;
      case "down":
        return <Down {...default_style} />;
      case "erase":
        return <Erase {...default_style} />;
      case "excel":
        return <Excel {...default_style} />;
      case "external_link":
        return <ExternalLink {...default_style} />;
      case "illustrator":
        return <Illustrator {...default_style} />;
      case "land":
        return <Land {...default_style} />;
      case "law":
        return <Law {...default_style} />;
      case "left":
        return <Left {...default_style} />;
      case "map":
        return <Map {...default_style} />;
      case "news":
        return <News {...default_style} />;
      case "pick_each":
        return <PickEach {...default_style} />;
      case "pick_from_data":
        return <PickFromData {...default_style} />;
      case "pick_range":
        return <PickRange {...default_style} />;
      case "right":
        return <Right {...default_style} />;
      case "search":
        return <Search {...default_style} />;
      case "share":
        return <Share {...default_style} />;
      case "three_bay":
        return <ThreeBay {...default_style} />;
      case "up":
        return <Up {...default_style} />;
      case "user":
        return <User {...default_style} />;
      default:
        return <User {...default_style} />;
    }
  };

  const [mouse_over, setMouseOver] = useState(false);

  return (
    <div
      className={cx(
        "wrapper",
        "color-" + color,
        disable ? "disable" : "",
        use_tooltip && !disable ? "" : "hide-tooltip",
        clickable && !disable ? "clickable" : ""
      )}
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      onClick={clickable && !disable ? onClick : () => {}}
      style={{
        height: size + "rem",
        width: size + "rem",
        padding: size / 6 + "rem",
      }}
    >
      {getIcon(type)}
      <Tooltip
        visible={use_tooltip && !disable && mouse_over}
        tooltip={tooltip}
        align={tooltip_align}
      />
    </div>
  );
};

Icon.defaultProps = {
  type: "default",
  color: "default",
  clickable: true,
  onClick: () => {
    console.log("clicked default Icon");
  },
  use_tooltip: false,
  size: 1.5,
  disable: false,
  tooltip_align: "default",
};

export default Icon;

// ### Icon

// - type : default / add / analysis / ...
// - color : outlined / default / white / primary / black
// - clickable : boolean
// - onClick : ()=>any
// - use_tooltip : boolean
// - tooltip : [any]
// - size : number
