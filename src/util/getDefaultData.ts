export type RawValue = string | number;

export interface NicknamedValue {
  nickname?: string;
  value: RawValue | Array<NicknamedValue> | { [key: string]: NicknamedValue };
  naming_rule?: string;
}

export type NestedValue =
  | RawValue
  | Array<NicknamedValue>
  | { [key: string]: NicknamedValue };

export interface IdedValue {
  id: string;
  value: NestedValue;
  naming_rule?: string;
}

export interface VariableData {
  id: string;
  unit: string;
  isValid?(
    value: RawValue
  ): { value: false; message: string } | { value: true };
  value?: NestedValue;
  naming_rule?: string;
}

// string type을 받는 경우
// /로 시작 시 코드 모드로 전환,
// 다시 /를 입력하면 코드 부분 완료, 텍스트 모드로 전환
// []로 묶어지는 경우 전역변수를 지칭
// #n의 경우 n-depth index를 지칭(#0 === #)

export interface LineData {
  id: string;
  op?: string;
  illust?: string;
  show?: boolean;
  nickname?: string;
  path?: Array<number | string>;
}

export interface CardData {
  id: string;
  code_string?: string;
  calculate?(arg: Array<RawValue>): Array<RawValue>;
  input_list: Array<LineData>;
  output_list: Array<LineData>;
  list_length?: number | Array<number> | string;
}

export interface TitleData {
  id: string;
  value: RawValue;
  nickname?: string;
  keymap_value_list: Array<{ id: string }>;
}

export const getDefaultVariableData = (): Array<VariableData> => {
  return [
    {
      id: "건물 연면적",
      unit: "[area]",
    },
    {
      id: "전용률",
      unit: "[rate]",
      isValid: (number) => {
        if (number > 100 || number < 10) {
          return {
            value: false,
            message: "10 ~ 100% 사이의 값을 입력하세요.",
          };
        }
        return { value: true };
      },
    },
    { id: "전용면적", unit: "[area]" },
    { id: "전용면적당 임대료", unit: "원[/area]/월" },
    { id: "1년", unit: "개월", value: 12 },
    { id: "연 NOI", unit: "원" },
    { id: "연 임대료 상승률", unit: "[rate]" },
    {
      id: "운용기간",
      unit: "년",
      isValid: (number) => {
        if (number == 0) {
          return {
            value: false,
            message: "1 이상의 값을 입력하세요.",
          };
        }
        return { value: true };
      },
    },
    {
      id: "매각년도 연 NOI",
      unit: "원",
    },
    {
      id: "매각 Cap Rate",
      unit: "[rate]",
      isValid: (number) => {
        if (number == 0) {
          return {
            value: false,
            message: "0보다 큰 값을 입력하세요.",
          };
        }
        return { value: true };
      },
    },
    { id: "매각금액", unit: "원" },
    { id: "대부비율(LTV)", unit: "[rate]" },
    { id: "대출금리", unit: "[rate]" },
    { id: "요구수익률", unit: "[rate]" },
    { id: "매입금액", unit: "원" },
    { id: "대출액", unit: "원" },
    { id: "연 이자액", unit: "원" },
    { id: "0년차 현금흐름", unit: "원" },
    { id: "연차별 NOI 목록", unit: "원", naming_rule: "/#+1/년차 NOI" },
    {
      id: "연차별 현금흐름 목록",
      unit: "원",
      naming_rule: "/#+1/년차 현금흐름",
    },
    { id: "내부수익률", unit: "[rate]" },
  ];
};

export const getDefaultValueData = (): Array<IdedValue> => {
  return [
    {
      id: "건물 연면적",
      value: 10106,
    },
    {
      id: "전용률",
      value: 1,
    },
    { id: "전용면적당 임대료", value: 48642 },
    { id: "연 임대료 상승률", value: 0.01 },
    {
      id: "운용기간",
      value: 5,
    },
    {
      id: "매각 Cap Rate",
      value: 0.061,
    },
    { id: "대부비율(LTV)", value: 0.6 },
    { id: "대출금리", value: 0.055 },
    { id: "요구수익률", value: 0.055 },
  ];
};

// special unit : [area] | [rate]
//                [/area] | [/rate]
// special op : [*] | [/] | [+] | [-]
export const getDefaultCardData = (period: number): Array<CardData> => {
  return [
    {
      id: "전용면적 산정",
      code_string: "[전용면적]=[건물 연면적]*[전용률]",
      input_list: [{ id: "건물 연면적" }, { id: "전용률", op: "[*]" }],
      output_list: [{ id: "전용면적" }],
    },
    {
      id: "전용면적당 임대료로 NOI 산정",
      code_string: "[연 NOI]=[전용면적]*[전용면적당 임대료]*[1년]",
      input_list: [
        { id: "전용면적" },
        { id: "전용면적당 임대료", op: "[*]" },
        { id: "1년", op: "[*]" },
      ],
      output_list: [{ id: "연 NOI", op: "[*]" }],
    },
    {
      id: "연 임대료 상승률 산정",
      code_string: "",
      input_list: [{ id: "연 임대료 상승률", op: "r" }],
      output_list: [],
    },
    {
      id: "매각년도 NOI 산정",
      code_string:
        "[매각년도 연 NOI]=[연 NOI]*(1+[연 임대료 상승률])^[운용기간]",
      input_list: [
        { id: "연 NOI", op: "A" },
        { id: "연 임대료 상승률", op: "r", show: false },
        { id: "운용기간", op: "t" },
      ],
      output_list: [
        {
          id: "매각년도 연 NOI",
          illust: "A × ( 1 + r ) <sup>t</sup>",
        },
      ],
    },
    {
      id: "매각금액 산정",
      code_string: "[매각금액]=[매각년도 연 NOI]/[매각 Cap Rate]",
      input_list: [
        { id: "매각년도 연 NOI" },
        { id: "매각 Cap Rate", op: "[/]" },
      ],
      output_list: [{ id: "매각금액" }],
    },
    {
      id: "일반 재무 가정",
      code_string: "",
      input_list: [
        { id: "대부비율(LTV)" },
        { id: "대출금리" },
        { id: "요구수익률" },
      ],
      output_list: [],
    },
    {
      id: "매입금액 산정",
      code_string: '[매입금액]=optimize("매입금액", "NPV 제곱", [매각금액])',
      input_list: [{ id: "매각금액", show: false }],
      output_list: [{ id: "매입금액", illust: "irr = 요구수익률인 매입금액" }],
    },
    {
      id: "대출액 산정",
      code_string: "[대출액]=[매입금액]*[대부비율(LTV)]",
      input_list: [{ id: "매입금액" }, { id: "대부비율(LTV)" }],
      output_list: [{ id: "대출액" }],
    },
    {
      id: "이자 산정",
      code_string: "[연 이자액]=[대출액]*[대출금리]",
      input_list: [{ id: "대출액", op: "[*]" }, { id: "대출금리" }],
      output_list: [{ id: "연 이자액" }],
    },
    {
      id: "연차별 NOI 산정",
      code_string:
        "blank_list=list([운용기간])\n[연차별 NOI 목록]=map(blank_list, list_index, [연 NOI]*(1+[임대료 상승률])^list_index",
      input_list: [
        { id: "운용기간" },
        { id: "연 NOI" },
        { id: "임대료 상승률" },
      ],
      output_list: [{ id: "연차별 NOI 목록" }],
    },
    {
      id: "초년도 현금흐름 산정",
      code_string: "[0년차 현금흐름]=[대출액]-[매입금액]",
      input_list: [{ id: "대출액" }, { id: "매입금액", op: "[-]" }],
      output_list: [{ id: "0년차 현금흐름" }],
    },
    {
      id: "연차별 현금흐름 산정",
      list_length: "/[운용기간]-1",
      code_string:
        "[연차별 현금흐름 목록].[#]=[연차별 NOI 목록].[#]-[연 이자액]",
      input_list: [
        { id: "연차별 NOI 목록", path: ["/[#]"], nickname: '/[#]+"년차 NOI"' },
        { id: "연 이자액", op: "[-]" },
      ],
      output_list: [
        {
          id: "연차별 현금흐름 목록",
          path: ["/[#]"],
          nickname: "/[#]년차 현금흐름",
        },
      ],
    },
    {
      id: "매각년도 현금흐름 산정",
      code_string:
        "[매각년도 현금흐름]=[연차별 NOI 목록].[운용기간]+[매각금액]-[연 이자액]-[대출액]",
      input_list: [{ id: "대출액" }, { id: "대출금리" }],
      output_list: [
        { id: "매각년도 현금흐름", nickname: '/[운용기간]+"년차 현금흐름"' },
      ],
    },
    {
      id: "내부수익률 산정",
      code_string:
        "[내부수익률(IRR)]=IRR([0년차 현금흐름], ...[연차별 현금흐름 목록], [매각년도 현금흐름])\n[NPV 제곱]=(NPV([요구수익률],[0년차 현금흐름], ...[연차별 현금흐름 목록], [매각년도 현금흐름]))^2",
      input_list: [
        { id: "0년차 현금흐름" },
        { id: "연차별 현금흐름 목록" },
        { id: "매각년도 현금흐름", nickname: "/[운용기간]년차" },
      ],
      output_list: [{ id: "내부수익률(IRR)" }],
    },
  ];
};

const _getNPV = ({
  period,
  noi,
  inflation_rate,
  irr,
  selling_price,
  ltv,
  market_interest,
  buying_price,
}: {
  [key: string]: number;
}): number => {
  const noi_list = Array(period)
    .fill(0)
    .map((_, idx) => noi * Math.pow(1 + inflation_rate, idx));
  const pv_list = Array(period)
    .fill(0)
    .map((_, idx) => 1 / Math.pow(1 + irr, idx + 1));
  const cf_in_pv_sum =
    noi_list
      .map((e, idx) => e * pv_list[idx])
      .reduce((prev, curr) => prev + curr, 0) +
    selling_price / Math.pow(1 + irr, period);
  const cf_out_pv_sum =
    pv_list
      .map((e) => e * buying_price * ltv * market_interest)
      .reduce((prev, curr) => prev + curr, 0) +
    buying_price * (1 - ltv) +
    (buying_price * ltv) / Math.pow(1 + irr, period);
  return cf_in_pv_sum - cf_out_pv_sum;
};

export const getDefaultSectionData = (
  period: number
): {
  [key: string]: Array<string>;
} => {
  return {
    "연간 수입가정": [
      "전용면적 산정",
      "전용면적당 임대료로 NOI 산정",
      "연 임대료 상승률 산정",
    ],
    매각가정: ["매각년도 NOI 산정", "매각금액 산정"],
    재무가정: ["일반 재무 가정"],
  };
};

export const getDefaultSectionDataBackUp = (
  period: number
): {
  [key: string]: Array<string>;
} => {
  return {
    "연간 수입가정": [
      "전용면적 산정",
      "전용면적당 임대료로 NOI 산정",
      "연 임대료 상승률 산정",
    ],
    매각가정: ["매각년도 NOI 산정", "매각금액 산정"],
    재무가정: ["일반 재무 가정"],
    매입금액: ["매입금액 산정", "대출액 산정", "이자 산정"],
    "연차별 현금흐름": [
      "연차별 NOI 산정",
      "초년도 현금흐름 산정",
      "연차별 현금흐름 산정",
      "매각년도 현금흐름 산정",
    ],
    "현금흐름 요약": ["내부수익률 산정"],
  };
};
