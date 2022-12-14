import React, { useEffect, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./TestPage.module.scss";
import InfoText from "../atoms/InfoText";
import Card from "../atoms/Card";
import Banner from "../atoms/Banner";
import Button from "../atoms/Button";
import Chip from "../atoms/Chip";
import DataTable from "../atoms/DataTable";
import Dialog from "../atoms/Dialog";
import List from "../atoms/List";
import Navigation from "../atoms/Navigation";
import Sheet from "../atoms/Sheet";
import Snackbar from "../atoms/Snackbar";
import Switch from "../atoms/Switch";
import TextField from "../atoms/TextField";
import Divider from "../atoms/Divider";
import LawCard from "../component/LawCard";
import Icon from "../atoms/Icon";
import useToggle from "../hooks/useToggle";
import Overlay from "../atoms/Overlay";
import NavigationBar from "../component/NavigationBar";
import DataList from "../component/DataList";
import LawSheet from "../component/LawSheet";
import ServiceCardWithLink from "../component/ServiceCardWithLink";
import IFrame from "../atoms/IFrame";
import SnackbarScenario from "../component/SnackbarScenario";
import useGlobalVar from "../hooks/useGlobalVar";
import SummaryCard from "../component/SummaryCard";
import DataCard from "../component/DataCard";
import Input from "../component/Input";
import CardList from "../component/CardList";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const TestPage = () => {
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  const [global_var, setGlobalVar] = useGlobalVar();

  const [backdrop, setBackdrop] = useState(false);
  const [overlay_stack, setOverlayStack] = useState(false);
  const [close, setClose] = useState(false);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-content")}>
        <p className={cx("title")}>Propi_TestPage</p>
        <p className={cx("title")}>ATOMS</p>
        <p className={cx("title")}>Banner</p>
        <Banner />
        <p className={cx("title")}>Button</p>
        <div className={cx("frame-small")}>
          <List tight={false}>
            <Button shape="rectangle" />
            <Button />
            <Button color="transparent" />
            <Button color="primary" />
            <Button type="excel">????????? ????????????</Button>
            <Button type="cad">????????? ????????????</Button>
          </List>
        </div>
        <p className={cx("title")}>Card</p>
        <Card use_tooltip={true} clickable={false} />
        <Card use_tooltip={true} tooltip={["???????????????????????? ??????"]} />
        <p className={cx("title")}>CardList</p>
        <div className={cx("frame-big")}>
          <CardList />
        </div>
        <p className={cx("title")}>SummaryCard</p>
        <SummaryCard />
        <p className={cx("title")}>DataCard</p>
        <DataCard />
        <p className={cx("title")}>Chip</p>
        <Chip />
        <Chip clicked={true} />
        <p className={cx("title")}>DataTable</p>
        <DataTable />
        <p className={cx("title")}>Dialog</p>
        <Dialog />
        <p className={cx("title")}>Divider</p>
        <Divider color="primary" />
        <Divider />
        <Divider style="bold" />
        <Divider style="dashed" />
        <p className={cx("title")}>Icon</p>
        <Icon color="outlined" />
        <Icon />
        {/* <Icon type="close" /> */}
        <Icon type="pick_from_data" />
        <Icon clickable={false} />
        <Icon color="white" />
        <Icon color="primary" />
        <Icon color="black" />
        <p className={cx("title")}>Input</p>
        <div className={cx("frame-big")}>
          <Input />
          <Input type="rate" />
          <Input disabled />
          <Input disabled type="rate" />
          <Input active />
          <Input active type="rate" />
        </div>
        <p className={cx("title")}>List</p>
        <List />
        {/* <p className={cx("title")}>Navigation</p>
        <Navigation />
        <p className={cx("title")}>Overlay</p>
        <Button
          onClick={() => {
            setBackdrop(true);
          }}
        >
          Backdrop ?????????
        </Button>
        <Switch
          on={overlay_stack}
          button
          onClick={(on) => {
            if (on) {
              setClose(false);
              setOverlayStack(true);
            } else {
              setClose(true);
            }
          }}
        >
          Stack ?????????
        </Switch>
        <p className={cx("title")}>Sheet</p>
        <Sheet />
        <p className={cx("title")}>Snackbar</p>
        <Snackbar />
        <Snackbar action="????????????">???????????? ?????? ??????????????????.</Snackbar>
        <p className={cx("title")}>Switch</p>
        <Switch />
        <Switch on />
        <Switch disabled />
        <Switch on disabled />
        <Switch button />
        <Switch multiple />
        <p className={cx("title")}>TextField</p>
        <TextField />
        <TextField style="filled" />
        <TextField style="underlined" />
        <TextField status="required" />
        <TextField style="filled" status="required" />
        <TextField style="underlined" status="required" />
        <TextField status="disabled" />
        <TextField style="filled" status="disabled" />
        <TextField style="underlined" status="disabled" />
        <TextField status="error" />
        <TextField style="filled" status="error" />
        <TextField style="underlined" status="error" />
        <TextField status="success" />
        <TextField style="filled" status="success" />
        <TextField style="underlined" status="success" />
        <TextField select />
        <TextField
          status="success"
          label="?????? ?????????"
          placeholder="???????????? ???????????????"
          helper_text="0?????? 1,300 ????????? ??????????????? ?????????."
          width="400px"
        />
        <p className={cx("title")}>COMPONENTS</p>
        <p className={cx("title")}>LawCard</p>
        <LawCard>children</LawCard>
        <LawCard
          title="?????????????????? ?????? ??????"
          sub_title="?????? ????????? ????????? ?????? ??????"
          type="???"
          depth="1"
        >
          <LawCard
            title="?????????????????? ?????? ??????"
            sub_title="?????? ????????? ????????? ?????? ??????"
            type="???"
            depth="2"
          />
        </LawCard>
        <p className={cx("title")}>LawSheet</p>
        <LawSheet />
        <p className={cx("title")}>DataList</p>
        <div className={cx("frame-small")}>
          <DataList />
        </div>
        <div className={cx("frame-small")}>
          <DataList id="land_characteristic" title="????????????">
            {[
              {
                id: "0",
                title: "??????",
                value: "???",
                unit: "",
                type: "string",
              },
              {
                id: "1",
                title: "??????????????? ??????",
                value: 440.23,
                unit: "[area]",
                type: "number_detail_1",
              },
              {
                id: "2",
                title: "??????????????????",
                value: "???",
                unit: "",
                type: "string",
              },
              {
                id: "3",
                title: "????????????, ??????",
                value: "??????, ?????????",
                unit: "",
                type: "string",
              },
            ]}
          </DataList>
        </div>
        <p className={cx("title")}>ServiceCardWithLink</p>
        <div className={cx("frame-small")}>
          <ServiceCardWithLink />
        </div>
        <div className={cx("frame-small")}>
          <ServiceCardWithLink
            link_to="/"
            src_img="/img/hey.png"
            title="????????? ????????????"
            text_illust={[
              "????????? ?????? ?????? ????????? ????????? ",
              "????????? ???????????? ?????? ????????? ??? ?????????.",
            ]}
          />
        </div> */}
        <p className={cx("title")}>E . N . D</p>
      </div>
      {/* <Sheet></Sheet>
      <NavigationBar>test</NavigationBar> */}

      {overlay_stack ? (
        <Overlay
          backdrop={false}
          onClick={{
            Backdrop: () => {
              setBackdrop(false);
            },
          }}
          auto_close
          close={close}
          callback={() => {
            setOverlayStack(false);
          }}
          type="stack"
        >
          <Snackbar
            action="????????????"
            onClick={() => {
              setClose(true);
            }}
          >
            ???????????? ?????? ??????????????????.
          </Snackbar>
        </Overlay>
      ) : (
        <></>
      )}
      <Overlay
        backdrop={backdrop}
        onClick={{
          Backdrop: () => {
            setBackdrop(false);
          },
        }}
        type="center"
      >
        {backdrop ? <Button /> : <></>}
      </Overlay>
      {global_var.snackbar ? <SnackbarScenario /> : <></>}
    </div>
  );
};

export default TestPage;
