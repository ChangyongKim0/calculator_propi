import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
import useGlobalVar, { getCookie } from "../hooks/useGlobalVar";
import List from "../atoms/List";
import CardList from "../component/CardList";
import Header from "../component/Header";
import {
  default_assumption_data,
  getCardListData,
  getValueData,
} from "../util/deprecated/formatCardListData";
import SnackbarOverlay from "../component/SnackbarOverlay";
import NumberpadOverlay from "../component/NumberpadOverlay";
import { decodeToNumberList, encodeNumberList } from "../util/encodeData";
import { formatData } from "../util/formatData";
import useGlobalData from "../hooks/useGlobalData";
import { _transformScroll } from "../util/alias";
import PopupOverlay from "../component/PopupOverlay";
import { useMemo } from "react";
import DataPage from "../component/DataPage";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const HomePage = ({ match }) => {
  return <DataPage match={match} />;
};

export default HomePage;
