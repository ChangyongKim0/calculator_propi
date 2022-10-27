import React from "react";
// { useEffect }

import styles from "./DataTable.module.scss";
import classNames from "classnames/bind";
import Divider from "./Divider";

const cx = classNames.bind(styles);

const DataTable = ({ title, content }) => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-table")}>
        <Divider style="bold" />
        <div className={cx("table-title")}>
          {title.map((e, idx) => {
            return (
              <div key={idx} onClick={e.onClick}>
                {e.text}
              </div>
            );
          })}
        </div>
        <Divider style="bold" />
        {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          content.map((e, idx) => {
            return (
              <>
                {idx == 0 ? <></> : <Divider />}
                <div className={cx("table-cell")}>
                  {title.map((e2, idx2) => {
                    return (
                      <div key={idx2} onClick={e[e2.text].onClick}>
                        {e[e2.text].text}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })
        }
        <Divider style="bold" />
      </div>
    </div>
  );
};

DataTable.defaultProps = {
  title: [
    {
      text: "ti[0]",
      clickable: true,
      onClick: () => {
        console.log("clicked ti[0] in default datatable");
      },
    },
    {
      text: "ti[1]",
      clickable: true,
      onClick: () => {
        console.log("clicked ti[1] in default datatable");
      },
    },
  ],
  content: [
    {
      "ti[0]": {
        text: "co[0].ti[0]",
        clickable: true,
        onClick: () => {
          console.log("clicked co[0].ti[0] in default datatable");
        },
      },
      "ti[1]": {
        text: "co[0].ti[1]",
        clickable: true,
        onClick: () => {
          console.log("clicked co[0].ti[1] in default datatable");
        },
      },
    },
    {
      "ti[0]": {
        text: "co[1].ti[0]",
        clickable: true,
        onClick: () => {
          console.log("clicked co[1].ti[0] in default datatable");
        },
      },
      "ti[1]": {
        text: "co[1].ti[1]",
        clickable: true,
        onClick: () => {
          console.log("clicked co[1].ti[1] in default datatable");
        },
      },
    },
  ],
  copiable: true,
};

export default DataTable;

// ### DataTable

// - title: [{text: any, clickable: boolean, onClick: ()=> any}]
// - content: [{any: {text: any, clickable: boolean, onClick: ()=> any}}]
// - copiable: boolean
