import { BasicPage, CONTENT_TYPE, PrimitiveData } from "./dataTypes";
import { IRR } from "./IRR";
import { Warning, ArrayTree } from "./primitiveTypes";

const excel_card_list: Array<BasicPage> = [
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "SUM",
    illust: "합계",
    calculate: (...args: ArrayTree<number>[]) => {
      const _forceSum = (data: ArrayTree<number>[]): number =>
        data.reduce((prev: number, curr) => {
          return typeof curr === "number"
            ? prev + curr
            : prev + _forceSum(curr);
        }, 0);
      return [_forceSum(args)];
    },
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "값1" },
      { type: CONTENT_TYPE.PARAMETER, name: "값2" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "합계" }],
  },
];

const basic_card_list: Array<BasicPage> = [
  ...excel_card_list.map((e) => {
    e.id = "EXCEL_" + e.id;
    return e;
  }),
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "*",
    nickname_list: ["×", "곱하기"],
    illust: "곱하기",
    calculate: (a: number, b: number) => [a * b],
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "A" },
      { type: CONTENT_TYPE.PARAMETER, name: "B" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "A × B" }],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "/",
    nickname_list: ["÷", "나누기"],
    illust: "나누기",
    calculate: (a: number, b: number) =>
      b === 0 ? new Warning("0으로는 나눌 수 없어요.") : [a / b],
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "A" },
      { type: CONTENT_TYPE.PARAMETER, name: "B" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "A / B" }],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "+",
    nickname_list: ["＋", "더하기"],
    illust: "더하기",
    calculate: (a: number, b: number) => [a + b],
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "A" },
      { type: CONTENT_TYPE.PARAMETER, name: "B" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "A + B" }],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "-",
    nickname_list: ["－", "빼기"],
    illust: "빼기",
    calculate: (a: number, b: number) => [a - b],
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "A" },
      { type: CONTENT_TYPE.PARAMETER, name: "B" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "A - B" }],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "^",
    nickname_list: ["**", "power", "거듭제곱"],
    illust: "거듭제곱",
    calculate: (a: number, b: number) => [a ** b],
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "A" },
      { type: CONTENT_TYPE.PARAMETER, name: "B" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "A ^ B" }],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "map",
    illust: "리스트 안의 각각의 값을 계산하기",
    calculate: (
      arr: Array<PrimitiveData>,
      fn: (
        e: PrimitiveData,
        idx?: number,
        arr?: Array<PrimitiveData>
      ) => PrimitiveData
    ) => {
      try {
        return [arr.map(fn)];
      } catch (e) {
        return new Warning(
          "리스트 안의 값 중 카드로 계산할 수 없는 값이 있어요."
        );
      }
    },
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "리스트" },
      { type: CONTENT_TYPE.PARAMETER, name: "카드" },
    ],
    output_list: [
      {
        type: CONTENT_TYPE.PARAMETER,
        name: "새 리스트",
        illust:
          "리스트 안의 각각의 값을 카드에 넣고, 나온 값으로 다시 리스트를 만들어요.",
      },
    ],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "irr",
    nickname_list: ["IRR 계산하기"],
    calculate: (args: Array<number>) => {
      const irr = IRR(args);
      return typeof irr === "number"
        ? [irr]
        : new Warning("IRR 값을 계산할 수 없는 리스트예요.");
    },
    input_list: [{ type: CONTENT_TYPE.PARAMETER, name: "값 리스트" }],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "IRR" }],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: "merge",
    nickname_list: ["리스트 합치기"],
    illust: "리스트들을 합쳐 새 리스트를 만들어요.",
    calculate: (...args: Array<Array<PrimitiveData>>) => {
      return args.reduce((prev, curr) => prev.concat(curr), []);
    },
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "리스트1" },
      { type: CONTENT_TYPE.PARAMETER, name: "리스트2" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "새 리스트" }],
  },
  {
    type: CONTENT_TYPE.BASIC_PAGE,
    id: ".",
    nickname_list: ["[]", "item"],
    illust: "아이템",
    calculate: (
      data: Array<PrimitiveData> | { [key: string]: PrimitiveData },
      key: number | string
    ) => {
      let item: PrimitiveData | undefined = undefined;
      if (Array.isArray(data) && typeof key === "number") {
        item = data?.[key];
      }
      if (!Array.isArray(data) && typeof key === "string") {
        item = data?.[key];
      }
      if (item === undefined) {
        return new Warning("맞지 않는 키값이예요.");
      }
      return [item];
    },
    input_list: [
      { type: CONTENT_TYPE.PARAMETER, name: "리스트1" },
      { type: CONTENT_TYPE.PARAMETER, name: "리스트2" },
    ],
    output_list: [{ type: CONTENT_TYPE.PARAMETER, name: "새 리스트" }],
  },
];
