import { Variable, CONTENT_TYPE } from "./dataTypes";
import { Warning } from "./primitiveTypes";

export const getDefaultVariableData = (): Array<Variable> => {
  return [
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "건물 연면적",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[area]" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "전용률",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[rate]" },
      isValid: (number) => {
        if (number > 100 || number < 10) {
          return new Warning("10 ~ 100% 사이의 값을 입력하세요.");
        }
        return true;
      },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "전용면적",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[area]" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "전용면적당 임대료",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원[/area]/월" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "1년",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, value: 12, unit: "개월" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "연 NOI",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "연 임대료 상승률",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[rate]" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "운용기간",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "년" },
      isValid: (number) => {
        if (number == 0) {
          return new Warning("1 이상의 값을 입력하세요.");
        }
        return true;
      },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "매각년도 연 NOI",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "매각 Cap Rate",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[rate]" },
      isValid: (number) => {
        if (number == 0) {
          return new Warning("0보다 큰 값을 입력하세요.");
        }
        return true;
      },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "매각금액",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "대부비율(LTV)",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[rate]" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "대출금리",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[rate]" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "요구수익률",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[rate]" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "매입금액",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "대출액",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "연 이자액",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "0년차 현금흐름",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "연차별 NOI 목록",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
      nicknaming_rule: "/#+1/년차 NOI",
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "연차별 현금흐름 목록",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "원" },
      nicknaming_rule: "/#+1/년차 현금흐름",
    },
    {
      type: CONTENT_TYPE.VARIABLE,
      id: "내부수익률",
      value: { type: CONTENT_TYPE.VALUE_WITH_UNIT, unit: "[rate]" },
    },
  ];
};
