import { _isValidString, _ifValidString, _stringfy } from "./alias";

const formatMapApiData = (type, raw_data, global_var) => {
  const data = raw_data[type.split("_")[0]] || {};
  switch (type) {
    case "my_data":
      return [
        {
          id: "my_default",
          title: "원하는 정보만 골라봐요!",
          nav: "골라담기",
          children: [],
        },
      ];
    case "land_data":
      const jeochok_list = data["NSDI:F176"]
        ? _stringfy(data["NSDI:F176"]["NSDI:CNFLC_AT_LIST"]).split(",")
        : undefined;
      const district_code_list = data["NSDI:F176"]
        ? _stringfy(data["NSDI:F176"]["NSDI:PRPOS_AREA_DSTRC_CODE_LIST"]).split(
            ","
          )
        : undefined;
      const district_list = data["NSDI:F176"]
        ? _stringfy(data["NSDI:F176"]["NSDI:PRPOS_AREA_DSTRC_NM_LIST"])
            .replace(/, /g, "[comma]")
            .replace(/(\([^\(\)]*)(,)([^\(\)]*\))/g, "$1[comma]$3")
            .split(",")
            .map((e) => e.replace(/\[comma\]/g, ", "))
        : undefined;

      return [
        {
          id: "land_frl",
          title: data.regstrSeCodeNm ?? "토지(임야)대장",
          nav: data.regstrSeCodeNm ?? "토지대장",
          children: [
            {
              id: "0",
              title: "고유번호",
              value: data.pnu
                ? data.pnu.slice(0, 10) +
                  "-" +
                  data.pnu.slice(10, 15) +
                  "-" +
                  data.pnu.slice(15)
                : "-",
              unit: "",
              type: "string",
            },
            {
              id: "1",
              title: "토지소재",
              value: data.ldCodeNm ?? "-",
              unit: "",
              type: "string",
            },
            {
              id: "2",
              title: "지번",
              value: data.mnnmSlno ?? "-",
              unit: "",
              type: "string",
            },
            {
              id: "3",
              title: "축척",
              value:
                data.ladFrtlSc == "00"
                  ? "수치(수치지적부)"
                  : data.ladFrtlScNm ?? "-",
              unit: "",
              type: "string",
            },
            {
              id: "4",
              title: "지목",
              value: data.lndcgrCodeNm ?? "-",
              unit: "",
              type: "string",
            },
            {
              id: "5",
              title: "면적",
              value: data.lndpclAr ?? "-",
              unit: "[area]",
              type: "number_detail_1",
            },
            {
              id: "6",
              title: "소유구분",
              value: data.posesnSeCodeNm ?? "-",
              unit: "",
              type: "string",
            },
          ],
        },
        {
          id: "land_usage",
          title: "토지이용계획",
          nav: "토지이용",
          children: [
            {
              id: "subsection_0",
              title: "국토계획법의 용도지역지구",
              value: "",
              unit: "",
              type: "string",
            },
            {
              id: "0",
              title: "포함",
              value: district_list
                ? district_list
                    .filter(
                      (_, idx) =>
                        jeochok_list[idx] == "1" &&
                        district_code_list[idx].includes("UQA")
                    )
                    .join(" | ")
                    .replace(/\([^\(\)]*\)/g, "") || "-"
                : "_",
              unit: "",
              type: "string",
            },
            {
              id: "1",
              title: "저촉",
              value: district_list
                ? district_list
                    .filter(
                      (_, idx) =>
                        jeochok_list[idx] == "2" &&
                        district_code_list[idx].includes("UQA")
                    )
                    .join(" | ")
                    .replace(/\(저촉\)/g, "") || "-"
                : "_",
              unit: "",
              type: "string",
            },
            {
              id: "2",
              title: "접함",
              value: district_list
                ? district_list
                    .filter(
                      (_, idx) =>
                        jeochok_list[idx] == "3" &&
                        district_code_list[idx].includes("UQA")
                    )
                    .join(" | ")
                    .replace(/\(접함\)/g, "")
                    .replace(/\(접합\)/g, "") || "-"
                : "_",
              unit: "",
              type: "string",
            },
            {
              id: "subsection_1",
              title: "타 법령에서의 지역지구등",
              value: "",
              unit: "",
              type: "string",
            },
            {
              id: "3",
              title: "포함",
              value: district_list
                ? district_list
                    .filter(
                      (_, idx) =>
                        jeochok_list[idx] == "1" &&
                        !district_code_list[idx].includes("UQA")
                    )
                    .join(" | ") || "-"
                : "_",
              unit: "",
              type: "string",
            },
            {
              id: "4",
              title: "저촉",
              value: district_list
                ? district_list
                    .filter(
                      (_, idx) =>
                        jeochok_list[idx] == "2" &&
                        !district_code_list[idx].includes("UQA")
                    )
                    .join(" | ")
                    .replace(/\(저촉\)/g, "") || "-"
                : "_",
              unit: "",
              type: "string",
            },
            {
              id: "5",
              title: "접함",
              value: district_list
                ? district_list
                    .filter(
                      (_, idx) =>
                        jeochok_list[idx] == "3" &&
                        !district_code_list[idx].includes("UQA")
                    )
                    .join(" | ")
                    .replace(/\(접함\)/g, "")
                    .replace(/\(접합\)/g, "") || "-"
                : "_",
              unit: "",
              type: "string",
            },
          ],
        },
        {
          id: "land_characteristics",
          title: "기타 특성",
          nav: "기타특성",
          children: [
            {
              id: "0",
              title: "실제이용용도",
              value: data["NSDI:F251"]
                ? data["NSDI:F251"]["NSDI:LAD_USE_SITTN_NM"] || "-"
                : "-",
              unit: "",
              type: "string",
            },
            {
              id: "1",
              title: "지형높이, 형상",
              value:
                (data["NSDI:F251"]
                  ? data["NSDI:F251"]["NSDI:TPGRPH_HG_CODE"] == "00"
                    ? "미지정"
                    : data["NSDI:F251"]["NSDI:TPGRPH_HG_CODE_NM"] || "-"
                  : "-") +
                ", " +
                (data["NSDI:F251"]
                  ? data["NSDI:F251"]["NSDI:TPGRPH_FRM_CODE"] == "00"
                    ? "미지정"
                    : data["NSDI:F251"]["NSDI:TPGRPH_FRM_CODE_NM"] || "-"
                  : "-"),
              unit: "",
              type: "string",
            },
            {
              id: "2",
              title: "도로접면",
              value: data["NSDI:F251"]
                ? data["NSDI:F251"]["NSDI:ROAD_SIDE_CODE"] == "00"
                  ? "미지정"
                  : data["NSDI:F251"]["NSDI:ROAD_SIDE_CODE_NM"] || "-"
                : "-",
              unit: "",
              type: "string",
            },
          ],
        },
      ];
    case "building_data":
      let common_data = {};
      let land_area = "";

      const no_building_data = {
        id: "building_common",
        title: "",
        children: [
          {
            id: "0",
            title: "건물 정보가 없어요.",
            value: "",
            unit: "",
            type: "string",
          },
        ],
      };

      try {
        common_data =
          data.bldg_recap_title_list.length == 0
            ? data.bldg_title_list[0]
            : data.bldg_recap_title_list[0];
        land_area =
          common_data.platArea == "0"
            ? raw_data.land.lndpclAr
            : common_data.platArea;
      } catch {
        return [no_building_data];
      }

      const building_title_list = data.bldg_title_list.sort((a, b) => {
        if (a.mainAtchGbCd != b.mainAtchGbCd) {
          return a.mainAtchGbCd > b.mainAtchGbCd ? 1 : -1;
        }
        if (
          _isValidString(a.dongNm, "\u00A0") !=
          _isValidString(b.dongNm, "\u00A0")
        ) {
          return _isValidString(a.dongNm, "\u00A0") >
            _isValidString(b.dongNm, "\u00A0")
            ? 1
            : -1;
        }
        if (_isValidString(a.totArea, "-") != _isValidString(b.totArea, "-")) {
          return _ifValidString(a.totArea, (data) => Number(data), 0) >
            _ifValidString(b.totArea, (data) => Number(data), 0)
            ? -1
            : 1;
        }
        return a.id > b.id ? 1 : -1;
      });

      const main_building_number = building_title_list.filter(
        (e) => e.mainAtchGbCd == "0"
      ).length;

      const building_common_data = {
        id: "building_common",
        title: "건축물대장 공통개요",
        nav: "공통개요",
        children: [
          {
            id: "2",
            title: "건축물명칭",
            value: common_data?.bldNm ?? "-",
            unit: "",
            type: "string",
          },
          {
            id: "3",
            title:
              common_data.platArea == "0" ? "대지면적(토지대장)" : "대지면적",
            value: land_area,
            unit: "[area]",
            type: "number_detail_1",
          },
          {
            id: "4",
            title: "건축면적",
            value: Number(common_data?.archArea ?? "0") || "-",
            unit: "[area]",
            type: "number_detail_1",
          },
          {
            id: "5",
            title: "연면적",
            value: Number(common_data?.totArea ?? "0") || "-",
            unit: "[area]",
            type: "number_detail_1",
          },
          {
            id: "6",
            title: "용적률산정연면적",
            value: Number(common_data?.vlRatEstmTotArea ?? "0") || "-",
            unit: "[area]",
            type: "number_detail_1",
          },
          {
            id: "7",
            title:
              common_data?.bcRat == "0" && common_data?.archArea != "0"
                ? "건폐율 / 용적률(계산치)"
                : "건폐율 / 용적률",
            value:
              common_data?.bcRat == "0"
                ? [
                    (common_data?.archArea ?? 0) / land_area || "-",
                    (common_data?.vlRatEstmTotArea ?? 0) / land_area || "-",
                  ]
                : [
                    (common_data?.bcRat ?? 0) / 100,
                    (common_data?.vlRat ?? 0) / 100,
                  ],
            unit: "%",
            type: "rate_list",
          },
          {
            id: "8",
            title: "지역지구등",
            value:
              _getJiJiguCdNmList(
                data?.bldg_district_list ?? [],
                common_data.mgmBldrgstPk
              ).join(" | ") || "-",
            unit: "",
            type: "string",
          },
          {
            id: "9",
            title: "건축물수",
            value:
              "주 " +
              (data.bldg_recap_title_list.length == 0
                ? "1"
                : _isValidString(
                    common_data?.mainBldCnt ?? "0",
                    main_building_number,
                    true
                  )) +
              " / 부속 " +
              _isValidString(
                common_data?.atchBldCnt ?? "0",
                building_title_list.length - main_building_number,
                true
              ),
            unit: "동",
            type: "string",
          },
        ],
      };

      if (
        data.bldg_recap_title_list.length == 0 &&
        data.bldg_title_list.length > 1
      ) {
        building_common_data.children.push(
          {
            id: "subsection_1",
            title: "건축물 현황",
            value: "",
            unit: "",
            type: "string",
          },
          {
            id: "building_title",
            style: "card_list",
            title: "건축물 현황",
            value: "",
            unit: "",
            type: "string",
            children: building_title_list.map((e, idx) => {
              return {
                id: e.id,
                title:
                  e.mainAtchGbCd == "0"
                    ? "주" + (idx + 1)
                    : "부" + (idx + 1 - main_building_number),
                subtitle: _isValidString(e.dongNm, "-"),
                children: [
                  {
                    value:
                      e.etcPurps == e.dongNm
                        ? "\u00A0"
                        : _isValidString(e.etcPurps, "-"),
                    unit: "",
                    type: "string",
                  },
                  {
                    value: _isValidString(e.strctCdNm, "-"),
                    unit: "",
                    type: "string",
                  },
                  {
                    value:
                      "B" +
                      _isValidString(e.ugrndFlrCnt, "-") +
                      "/" +
                      _isValidString(e.grndFlrCnt, "-"),
                    unit: "F",
                    type: "string",
                  },
                  {
                    value: _isValidString(e.totArea, "-"),
                    unit: "[area]",
                    type: "number_detail_1",
                  },
                ],
              };
            }),
          }
        );
      }

      const building_recap_title_data = {
        id: "building_recap_title",
        title: "총괄표제부",
        nav: "총괄표제",
        children: [
          {
            id: "8",
            title: "주용도",
            value: common_data?.mainPurpsCdNm ?? "-",
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "기타용도",
            value:
              common_data?.mainPurpsCdNm != common_data?.etcPurps
                ? _isValidString(common_data?.etcPurps, "-")
                : "-",
            unit: "",
            type: "string",
          },
          {
            id: "9",
            title: "총주차수",
            value:
              common_data?.totPkngCnt == "0"
                ? "-"
                : common_data?.totPkngCnt ?? "-",
            unit: "대",
            type: "number_detail",
          },
          {
            id: "8",
            title: "호 / 가구 / 세대수",
            value:
              _isValidString(common_data?.hoCnt, "0") +
              "호 / " +
              _isValidString(common_data?.fmlyCnt, "0") +
              "가구 / " +
              _isValidString(common_data?.hhldCnt, "0") +
              "세대",
            unit: "",
            type: "string",
          },
          {
            id: "10",
            title: "건축물 대지",
            value:
              String(Number(common_data?.bun)) +
              (common_data?.ji == "0000"
                ? ""
                : "-" + String(Number(common_data?.ji))) +
              " 외  " +
              common_data?.bylotCnt,
            unit: "필지",
            type: "string",
          },
          {
            id: "8",
            title: "허가일",
            value: _ifValidString(
              common_data.pmsDay,
              (data) =>
                data.length == 8
                  ? [data.slice(0, 4), data.slice(4, 6), data.slice(6)].join(
                      "."
                    )
                  : "-",
              "-"
            ),
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "착공일",
            value: _ifValidString(
              common_data.stcnsDay,
              (data) =>
                data.length == 8
                  ? [data.slice(0, 4), data.slice(4, 6), data.slice(6)].join(
                      "."
                    )
                  : "-",
              "-"
            ),
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "사용승인일",
            value: _ifValidString(
              common_data.useAprDay,
              (data) =>
                data.length == 8
                  ? [data.slice(0, 4), data.slice(4, 6), data.slice(6)].join(
                      "."
                    )
                  : "-",
              "-"
            ),
            unit: "",
            type: "string",
          },
          {
            id: "subsection_1",
            title: "건축물 현황",
            value: "",
            unit: "",
            type: "string",
          },
          {
            id: "building_title",
            style: "card_list",
            title: "건축물 현황",
            value: "",
            unit: "",
            type: "string",
            children: building_title_list.map((e, idx) => {
              return {
                id: e.id,
                title:
                  e.mainAtchGbCd == "0"
                    ? "주" + (idx + 1)
                    : "부" + (idx + 1 - main_building_number),
                subtitle: _isValidString(e.dongNm, "-"),
                children: [
                  {
                    value:
                      e.etcPurps == e.dongNm
                        ? "\u00A0"
                        : _isValidString(e.etcPurps, "-"),
                    unit: "",
                    type: "string",
                  },
                  {
                    value: _isValidString(e.strctCdNm, "-"),
                    unit: "",
                    type: "string",
                  },
                  {
                    value:
                      "B" +
                      _isValidString(e.ugrndFlrCnt, "-") +
                      "/" +
                      _isValidString(e.grndFlrCnt, "-"),
                    unit: "F",
                    type: "string",
                  },
                  {
                    value: _isValidString(e.totArea, "-"),
                    unit: "[area]",
                    type: "number_detail_1",
                  },
                ],
              };
            }),
          },
        ],
      };

      const building_title_current =
        building_title_list[global_var.building_title_current_idx] || {};
      const building_title_data = {
        id: "building_title",
        title:
          building_title_current.regstrGbCdNm == "일반"
            ? "일반건축물대장" +
              "(" +
              (building_title_current?.mainAtchGbCd == "0"
                ? "주" + (global_var.building_title_current_idx + 1)
                : "부" +
                  (global_var.building_title_current_idx +
                    1 -
                    main_building_number)) +
              _ifValidString(
                building_title_current?.dongNm,
                (data) => ": " + data,
                ""
              ) +
              ")"
            : "집합표제부" +
              "(" +
              (building_title_current?.mainAtchGbCd == "0"
                ? "주" + (global_var.building_title_current_idx + 1)
                : "부" +
                  (global_var.building_title_current_idx +
                    1 -
                    main_building_number)) +
              _ifValidString(
                building_title_current?.dongNm,
                (data) => ": " + data,
                ""
              ) +
              ")",
        nav:
          building_title_current.regstrGbCdNm == "일반"
            ? "일반대장"
            : "집합표제",
        children: [
          {
            id: "8",
            title: "주용도",
            value: _isValidString(building_title_current?.mainPurpsCdNm, "-"),
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "기타용도",
            value:
              building_title_current?.mainPurpsCdNm !=
              building_title_current?.etcPurps
                ? _isValidString(building_title_current?.etcPurps, "-")
                    .replace(/,([0-9])/g, "[comma]$1")
                    .split(",")
                    .join(" | ")
                    .replace(/\[comma\]/g, ", ")
                : "-",
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "구조",
            value:
              building_title_current?.strctCdNm ==
              building_title_current?.etcStrct
                ? _isValidString(building_title_current?.strctCdNm, "-")
                : _isValidString(building_title_current?.strctCdNm, "-") +
                  " | " +
                  _isValidString(building_title_current?.etcStrct, "-")
                    .split(",")
                    .join(" | "),
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "지붕형태",
            value:
              building_title_current?.roofCdNm ==
              building_title_current?.etcRoof
                ? _isValidString(building_title_current?.roofCdNm, "-")
                : _isValidString(building_title_current?.roofCdNm, "-") +
                  " | " +
                  _isValidString(building_title_current?.etcRoof, "-")
                    .split(",")
                    .join(" | "),
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "층수",
            value:
              "B" +
              _isValidString(building_title_current.ugrndFlrCnt, "-") +
              "/" +
              _isValidString(building_title_current.grndFlrCnt, "-"),
            unit: "F",
            type: "string",
          },
          {
            id: "4",
            title: "건축면적",
            value: Number(building_title_current?.archArea ?? "0") || "-",
            unit: "[area]",
            type: "number_detail_1",
          },
          {
            id: "5",
            title: "연면적",
            value: Number(building_title_current?.totArea ?? "0") || "-",
            unit: "[area]",
            type: "number_detail_1",
          },
          {
            id: "6",
            title: "용적률산정연면적",
            value:
              Number(building_title_current?.vlRatEstmTotArea ?? "0") || "-",
            unit: "[area]",
            type: "number_detail_1",
          },
          {
            id: "7",
            title:
              building_title_current?.bcRat == "0" &&
              building_title_current?.archArea != "0"
                ? "건폐율 / 용적률(계산치)"
                : "건폐율 / 용적률",
            value:
              building_title_current?.bcRat == "0"
                ? [
                    (building_title_current?.archArea ?? 0) / land_area || "-",
                    (building_title_current?.vlRatEstmTotArea ?? 0) /
                      land_area || "-",
                  ]
                : [
                    (building_title_current?.bcRat ?? 0) / 100,
                    (building_title_current?.vlRat ?? 0) / 100,
                  ],
            unit: "%",
            type: "rate_list",
          },
          {
            id: "8",
            title: "연면적",
            value:
              "B" +
              _isValidString(building_title_current.ugrndFlrCnt, "-") +
              "/" +
              _isValidString(building_title_current.grndFlrCnt, "-"),
            unit: "F",
            type: "string",
          },
          {
            id: "8",
            title: "호 / 가구 / 세대수",
            value:
              _isValidString(building_title_current?.hoCnt, "0") +
              "호 / " +
              _isValidString(building_title_current?.fmlyCnt, "0") +
              "가구 / " +
              _isValidString(building_title_current?.hhldCnt, "0") +
              "세대",
            unit: "",
            type: "string",
          },
          {
            id: "10",
            title: "건축물 대지",
            value:
              String(Number(building_title_current?.bun)) +
              (building_title_current?.ji == "0000"
                ? ""
                : "-" + String(Number(building_title_current?.ji))) +
              " 외  " +
              building_title_current?.bylotCnt,
            unit: "필지",
            type: "string",
          },
          {
            id: "8",
            title: "허가일",
            value: _ifValidString(
              building_title_current.pmsDay,
              (data) =>
                data.length == 8
                  ? [data.slice(0, 4), data.slice(4, 6), data.slice(6)].join(
                      "."
                    )
                  : "-",
              "-"
            ),
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "착공일",
            value: _ifValidString(
              building_title_current.stcnsDay,
              (data) =>
                data.length == 8
                  ? [data.slice(0, 4), data.slice(4, 6), data.slice(6)].join(
                      "."
                    )
                  : "-",
              "-"
            ),
            unit: "",
            type: "string",
          },
          {
            id: "8",
            title: "사용승인일",
            value: _ifValidString(
              building_title_current.useAprDay,
              (data) =>
                data.length == 8
                  ? [data.slice(0, 4), data.slice(4, 6), data.slice(6)].join(
                      "."
                    )
                  : "-",
              "-"
            ),
            unit: "",
            type: "string",
          },
        ],
      };
      const building_expose_data = {
        id: "building_expose",
        title: "전유부",
        nav: "전유부",

        children: [
          {
            id: "8",
            title: "호 / 가구 / 세대수",
            value:
              (common_data?.hoCnt ?? "0") +
              "호 / " +
              (common_data?.fmlyCnt ?? "0") +
              "가구 / " +
              (common_data?.hhldCnt ?? "0") +
              "세대",
            unit: "",
            type: "string",
          },
          {
            id: "9",
            title: "총주차수",
            value:
              common_data?.totPkngCnt == "0"
                ? "-"
                : common_data?.totPkngCnt ?? "-",
            unit: "대",
            type: "number_detail",
          },
        ],
      };

      let building_data =
        data.bldg_recap_title_list.length == 0
          ? building_title_current.regstrGbCdNm == "일반"
            ? [building_common_data, building_title_data]
            : [building_common_data, building_title_data, building_expose_data]
          : building_title_current.regstrGbCdNm == "일반"
          ? [
              building_common_data,
              building_recap_title_data,
              building_title_data,
            ]
          : [
              building_common_data,
              building_recap_title_data,
              building_title_data,
              building_expose_data,
            ];

      return building_data;
    case "price_data":
      return [];
    default:
      return [];
  }
};

const _getJiJiguCdNmList = (data_list, id) => {
  data_list.sort((a, b) => {
    if (Number(a.crtnDay) == Number(b.crtnDay)) {
      return Number(a.jijiguGbCd) - Number(b.jijiguGbCd);
    }
    return Number(b.crtnDay) - Number(a.crtnDay);
  });
  if (data_list.length == 0) {
    return [];
  }
  return data_list
    .filter((e) => e.mgmBldrgstPk == id)
    .filter(
      (e) =>
        data_list[0].crtnDay == e.crtnDay &&
        e.reprYn == "1" &&
        _ifValidString(e.jijiguCdNm)
    )
    .map((e) =>
      e.jijiguCdNm == e.etcJijigu || !_ifValidString(e.etcJijigu)
        ? e.jijiguCdNm
        : e.jijiguCdNm + "(" + e.etcJijigu + ")"
    );
};

export const _getAttachLandList = (
  building_data,
  pnu_to_add,
  pnu_to_remove
) => {
  const building_set = Array.from(
    new Set(
      building_data.map(
        (e) =>
          e.atchSigunguCd +
          e.atchBjdongCd +
          (e.atchPlatGbCd == "1" ? "2" : "1") +
          e.atchBun +
          e.atchJi
      )
    )
  );
  building_set.push(pnu_to_add);
  const pnu_to_remove_idx = building_set.findIndex((e) => e == pnu_to_remove);
  if (pnu_to_remove_idx > -1) {
    building_set.splice(pnu_to_remove_idx, 1);
  } else {
    return [-1];
  }
  return building_set;
};

export default formatMapApiData;
