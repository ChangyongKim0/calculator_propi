export const getCardListData = (value) => {
  return [
    {
      title: "연간 수입가정",
      data_list: [
        [
          {
            type: "default",
            disabled: false,
            operator: "",
            title: "건물 연면적",
            value: value.bldg_flr_area,
            unit: "[area]",
          },
          {
            type: "rate",
            disabled: false,
            operator: "×",
            title: "전용률",
            value: value.par,
            unit: "%",
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
          { type: "divider" },
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "전용면적",
            value: value.parea,
            unit: "[area]",
          },
        ],
        [
          {
            type: "default",
            disabled: false,
            operator: "×",
            title: "전용면적당 임대료",
            value: value.rent_price,
            unit: "원[/area]·월",
          },
          {
            type: "default",
            disabled: true,
            operator: "×",
            title: "",
            value: value.year,
            unit: "개월",
          },
          { type: "divider" },
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "연 NOI",
            value: value.noi,
            unit: "백만원",
          },
        ],
        [
          {
            type: "rate",
            disabled: false,
            operator: "r",
            title: "연 임대료 상승률",
            value: value.inflation_rate,
            unit: "%",
          },
        ],
      ],
    },
    {
      title: "매각가정",
      data_list: [
        [
          {
            type: "default",
            disabled: true,
            operator: "A",
            title: "연 NOI",
            value: value.noi,
            unit: "백만원",
          },
          {
            type: "default",
            disabled: false,
            operator: "t",
            title: "운용기간",
            value: value.period,
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
          { type: "divider" },
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "매각년도 연 NOI",
            value: value.noi_last,
            unit: "백만원",
            illust: "A × ( 1 + r ) <sup>t</sup>",
          },
        ],
        [
          {
            type: "rate",
            disabled: false,
            operator: "÷",
            title: "매각 Cap Rate",
            value: value.selling_cap_rate,
            unit: "%",
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
          { type: "divider" },
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "매각금액",
            value: value.selling_price,
            unit: "백만원",
          },
        ],
      ],
    },
    {
      title: "재무가정",
      data_list: [
        [
          {
            type: "rate",
            disabled: false,
            operator: "",
            title: "대부비율(LTV)",
            value: value.ltv,
            unit: "%",
          },
          {
            type: "rate",
            disabled: false,
            operator: "",
            title: "대출금리",
            value: value.market_interest,
            unit: "%",
          },
          {
            type: "rate",
            disabled: false,
            operator: "",
            title: "요구수익률",
            value: value.irr,
            unit: "%",
          },
        ],
      ],
    },
    {
      title: "매입금액",
      data_list: [
        [
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "매입금액",
            value: value.appropriate_buying_price,
            unit: "백만원",
            illust: "irr = 요구수익률인 매입금액",
            emph: true,
          },
        ],
        [
          {
            type: "rate",
            disabled: true,
            operator: "×",
            title: "대부비율(LTV)",
            value: value.ltv,
            unit: "%",
          },
          { type: "divider" },
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "대출액",
            value: value.debt,
            unit: "백만원",
          },
        ],
        [
          {
            type: "rate",
            disabled: true,
            operator: "×",
            title: "대출금리",
            value: value.market_interest,
            unit: "%",
          },
          { type: "divider" },
          {
            type: "default",
            disabled: true,
            operator: "",
            title: "연 이자액",
            value: value.interest,
            unit: "백만원",
          },
        ],
      ],
    },
    {
      title: "연차별 현금흐름",
      data_list: [
        ...value.cf_list.map((e, idx) => {
          if (idx == 0) {
            return [
              {
                type: "default",
                disabled: true,
                operator: "",
                title: "대출액",
                value: value.debt,
                unit: "백만원",
              },
              {
                type: "default",
                disabled: true,
                operator: "-",
                title: "매입금액",
                value: value.appropriate_buying_price,
                unit: "백만원",
              },
              { type: "divider" },
              {
                type: "default",
                disabled: true,
                operator: "",
                title: "0년차 현금흐름",
                value: e,
                unit: "백만원",
              },
            ];
          }
          if (idx == Math.round(value.period)) {
            return [
              {
                type: "default",
                disabled: true,
                operator: "",
                title: idx + "년차 NOI",
                value: value.noi_list[idx - 1],
                unit: "백만원",
                illust: "NOI × (1 + r) <sup>" + idx + "</sup>",
              },
              {
                type: "default",
                disabled: true,
                operator: "+",
                title: "매각금액",
                value: value.selling_price,
                unit: "백만원",
              },
              {
                type: "default",
                disabled: true,
                operator: "-",
                title: "연 이자액",
                value: value.interest,
                unit: "백만원",
              },
              {
                type: "default",
                disabled: true,
                operator: "-",
                title: "대출액",
                value: value.debt,
                unit: "백만원",
              },
              { type: "divider" },
              {
                type: "default",
                disabled: true,
                operator: "",
                title: idx + "년차 현금흐름",
                value: e,
                unit: "백만원",
              },
            ];
          }
          return [
            {
              type: "default",
              disabled: true,
              operator: "",
              title: idx + "년차 NOI",
              value: value.noi_list[idx - 1],
              unit: "백만원",
              illust: "NOI × (1 + r) <sup>" + idx + "</sup>",
            },
            {
              type: "default",
              disabled: true,
              operator: "-",
              title: "연 이자액",
              value: value.interest,
              unit: "백만원",
            },
            { type: "divider" },
            {
              type: "default",
              disabled: true,
              operator: "",
              title: idx + "년차 현금흐름",
              value: e,
              unit: "백만원",
            },
          ];
        }),
      ],
    },
    {
      title: "현금흐름 요약",
      data_list: [
        [
          ...value.cf_list.map((e, idx) => {
            return {
              type: "default",
              disabled: true,
              operator: "",
              title: idx + "년차" + (idx == 0 ? " 현금흐름" : ""),
              value: e,
              unit: "백만원",
            };
          }),
          { type: "divider" },
          {
            type: "rate",
            disabled: true,
            operator: "",
            title: "내부수익률(IRR)",
            value: value.irr,
            unit: "%",
          },
        ],
      ],
    },
  ];
};

export const default_assumption_data = [
  6612, 0.65, 12100, 0.02, 5, 0.05, 0.8, 0.05, 0.15,
];

export const getValueData = (assumption) => {
  if (assumption.length != 9) {
    return undefined;
  }
  const [
    bldg_flr_area,
    par,
    rent_price,
    inflation_rate,
    period,
    selling_cap_rate,
    ltv,
    market_interest,
    irr,
  ] = assumption;
  const parea = bldg_flr_area * par;
  const year = 12;
  const noi = (parea * rent_price * year) / 1000000;
  const noi_last = noi * Math.pow(1 + inflation_rate, period);
  const selling_price = noi_last / selling_cap_rate;
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
  const pv_sum = pv_list.reduce((prev, curr) => prev + curr, 0);
  const appropriate_buying_price =
    cf_in_pv_sum /
    (1 -
      ltv +
      ltv / Math.pow(1 + irr, period) +
      ltv * market_interest * pv_sum);
  const debt = appropriate_buying_price * ltv;
  const interest = debt * market_interest;
  const cf_list = Array(period + 1)
    .fill(0)
    .map((_, idx) => {
      if (idx == 0) {
        return debt - appropriate_buying_price;
      }
      if (idx == Math.round(period)) {
        return noi_list[idx - 1] + selling_price - interest - debt;
      }
      return noi_list[idx - 1] - interest;
    });

  return {
    bldg_flr_area,
    par,
    rent_price,
    inflation_rate,
    period,
    selling_cap_rate,
    ltv,
    market_interest,
    irr,
    parea,
    year,
    noi,
    noi_last,
    selling_price,
    noi_list,
    appropriate_buying_price,
    debt,
    interest,
    cf_list,
  };
};

// export const getValueData = (assumption) => {
//   if (assumption.length != 9) {
//     return undefined;
//   }
//   const [
//     bldg_flr_area,
//     par,
//     rent_price,
//     inflation_rate,
//     period,
//     selling_cap_rate,
//     ltv,
//     market_interest,
//     ror,
//   ] = assumption;
//   const parea = bldg_flr_area * par;
//   const year = 12;
//   const noi = (parea * rent_price * year) / 1000000;
//   const noi_last = noi * Math.pow(1 + inflation_rate, period);
//   const selling_price = noi_last / selling_cap_rate;
//   const irr = ltv * market_interest + (1 - ltv) * ror;
//   const noi_pv_list = Array(period - 1)
//     .fill(0)
//     .map((_, idx) => noi * Math.pow((1 + inflation_rate) / (1 + irr), idx + 1));
//   const noi_pv_sum = noi_pv_list.reduce((prev, curr) => prev + curr, noi);
//   const selling_price_pv = selling_price / Math.pow(1 + irr, period);
//   const appropriate_buying_price = noi_pv_sum + selling_price_pv;
//   return {
//     bldg_flr_area,
//     par,
//     rent_price,
//     inflation_rate,
//     period,
//     selling_cap_rate,
//     ltv,
//     market_interest,
//     ror,
//     parea,
//     year,
//     noi,
//     noi_last,
//     selling_price,
//     irr,
//     noi_pv_list,
//     noi_pv_sum,
//     selling_price_pv,
//     appropriate_buying_price,
//   };
// };

// export const getCardListData = (value) => {
//   return [
//     {
//       title: "연간 수입가정",
//       data_list: [
//         [
//           {
//             type: "default",
//             disabled: false,
//             operator: "",
//             title: "건물 연면적",
//             value: value.bldg_flr_area,
//             unit: "[area]",
//           },
//           {
//             type: "rate",
//             disabled: false,
//             operator: "×",
//             title: "전용률",
//             value: value.par,
//             unit: "%",
//             isValid: (number) => {
//               if (number > 100 || number < 10) {
//                 return {
//                   value: false,
//                   message: "10 ~ 100% 사이의 값을 입력하세요.",
//                 };
//               }
//               return { value: true };
//             },
//           },
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "전용면적",
//             value: value.parea,
//             unit: "[area]",
//           },
//         ],
//         [
//           {
//             type: "default",
//             disabled: false,
//             operator: "×",
//             title: "전용면적당 임대료",
//             value: value.rent_price,
//             unit: "원[/area]·월",
//           },
//           {
//             type: "default",
//             disabled: true,
//             operator: "×",
//             title: "",
//             value: value.year,
//             unit: "개월",
//           },
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "연 NOI",
//             value: value.noi,
//             unit: "백만원",
//           },
//         ],
//         [
//           {
//             type: "rate",
//             disabled: false,
//             operator: "r",
//             title: "연 임대료 상승률",
//             value: value.inflation_rate,
//             unit: "%",
//           },
//         ],
//       ],
//     },
//     {
//       title: "매각가정",
//       data_list: [
//         [
//           {
//             type: "default",
//             disabled: true,
//             operator: "A",
//             title: "연 NOI",
//             value: value.noi,
//             unit: "백만원",
//           },
//           {
//             type: "default",
//             disabled: false,
//             operator: "t",
//             title: "운용기간",
//             value: value.period,
//             unit: "년",
//             isValid: (number) => {
//               if (number == 0) {
//                 return {
//                   value: false,
//                   message: "1 이상의 값을 입력하세요.",
//                 };
//               }
//               return { value: true };
//             },
//           },
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "매각년도 연 NOI",
//             value: value.noi_last,
//             unit: "백만원",
//             illust: "A × ( 1 + r ) <sup>t</sup>",
//           },
//         ],
//         [
//           {
//             type: "rate",
//             disabled: false,
//             operator: "÷",
//             title: "매각 Cap Rate",
//             value: value.selling_cap_rate,
//             unit: "%",
//             isValid: (number) => {
//               if (number == 0) {
//                 return {
//                   value: false,
//                   message: "0보다 큰 값을 입력하세요.",
//                 };
//               }
//               return { value: true };
//             },
//           },
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "매각금액",
//             value: value.selling_price,
//             unit: "백만원",
//           },
//         ],
//       ],
//     },
//     {
//       title: "재무가정",
//       data_list: [
//         [
//           {
//             type: "rate",
//             disabled: false,
//             operator: "A",
//             title: "대부비율(LTV)",
//             value: value.ltv,
//             unit: "%",
//           },
//           {
//             type: "rate",
//             disabled: false,
//             operator: "B",
//             title: "대출금리",
//             value: value.market_interest,
//             unit: "%",
//           },
//           {
//             type: "rate",
//             disabled: false,
//             operator: "C",
//             title: "목표 자본수익률",
//             value: value.ror,
//             unit: "%",
//           },
//           { type: "divider" },
//           {
//             type: "rate",
//             disabled: true,
//             operator: "",
//             title: "목표 내부수익률(IRR)",
//             value: value.irr,
//             unit: "%",
//             illust: "A × B + ( 1 - A ) × C",
//           },
//         ],
//       ],
//     },
//     {
//       title: "매입금액 산정",
//       data_list: [
//         [
//           {
//             type: "default",
//             disabled: true,
//             operator: "A",
//             title: "연 NOI",
//             value: value.noi,
//             unit: "백만원",
//           },
//           {
//             type: "rate",
//             disabled: true,
//             operator: "B",
//             title: "목표 내부수익률(IRR)",
//             value: value.irr,
//             unit: "%",
//           },
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "1년차 NOI 현재가치",
//             value: value.noi,
//             unit: "백만원",
//             illust: "A × [( 1 + r ) / ( 1 + B )] <sup>n - 1</sup>",
//           },
//         ],
//         [
//           ...value.noi_pv_list.map((e, idx) => {
//             return {
//               type: "default",
//               disabled: true,
//               operator: "+",
//               title: idx + 2 + "년차",
//               value: e,
//               unit: "백만원",
//             };
//           }),
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "미래 NOI 현재가치 합",
//             value: value.noi_pv_sum,
//             unit: "백만원",
//           },
//         ],
//         [
//           {
//             type: "default",
//             disabled: true,
//             operator: "A",
//             title: "매각금액",
//             value: value.selling_price,
//             unit: "백만원",
//           },
//           {
//             type: "rate",
//             disabled: true,
//             operator: "B",
//             title: "목표 내부수익률(IRR)",
//             value: value.irr,
//             unit: "%",
//           },
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "매각금액의 현재가치",
//             value: value.selling_price_pv,
//             unit: "백만원",
//             illust: "A  / ( 1 + B ) <sup>t</sup>",
//           },
//         ],
//         [
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "미래 NOI 현재가치 합",
//             value: value.noi_pv_sum,
//             unit: "백만원",
//           },
//           {
//             type: "default",
//             disabled: true,
//             operator: "+",
//             title: "매각금액의 현재가치",
//             value: value.selling_price_pv,
//             unit: "백만원",
//           },
//           { type: "divider" },
//           {
//             type: "default",
//             disabled: true,
//             operator: "",
//             title: "적정 매입금액",
//             value: value.appropriate_buying_price,
//             unit: "백만원",
//           },
//         ],
//       ],
//     },
//   ];
// };
