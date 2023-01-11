// production rule
export const terminal_symbol: Array<{
  name: string;
  regex: RegExp;
}> = [
  { name: "index_var", regex: /\[#\d*\]/ },
  { name: "param_var", regex: /\[[^#\[\]]*\]/ },
  { name: "number", regex: /\d+/ },
  { name: "string", regex: /"[^"\\]*"/ },
  { name: "local_or_predef_var", regex: /[a-zA-Z가-힣_]+/ },
  { name: "spreader", regex: /\.\.\./ },
  { name: "quotient", regex: /\/\// },
  { name: "power", regex: /\^|\*\*/ },
  { name: "\n", regex: /\n/ },
  { name: "=", regex: /=/ },
  { name: "(", regex: /\(/ },
  { name: ")", regex: /\)/ },
  { name: ",", regex: /,/ },
  { name: ".", regex: /\./ },
  { name: "+", regex: /\+/ },
  { name: "-", regex: /-/ },
  { name: "*", regex: /\*/ },
  { name: "/", regex: /\// },
  { name: "%", regex: /%/ },
];

export const grammer_string: Array<string> = [
  "<Stats> -> <Stat> | <Stats> \n <Stat>",
  "<Stat> -> <Expr> | <AssignStat>",
  "<AssignStat> -> param_var = <Expr> | local_or_predef_var = <Expr>",
  "<Expr> -> <Term> | <Expr> <AddOp> <Term> | <AddOp> <Term> | local_or_predef_var <Tuple> | <Array> | spreader <Primary> | spreader <Array>",
  "<Array> -> ( ) | ( <Expr> , <Args> )",
  "<Tuple> -> ( ) | ( <Args> )",
  "<Args> -> <Expr> | <Expr> , <Args>",
  "<Term> -> <Factor> | <Term> <MulOp> <Factor>",
  "<Factor> -> <Primary> | <Factor> <PowOp> <Primary> | number . number | number | string",
  "<Primary> -> <PrimaryWithoutChain> | <Primary> . <PrimaryWithoutChain> | <Primary> . number | <Primary> . string",
  "<PrimaryWithoutChain> -> <Variable> | ( <Expr> )",
  "<Variable> -> index_var | param_var | local_or_predef_var",
  "<AddOp> -> + | -",
  "<MulOp> -> * | / | quotient | %",
  "<PowOp> -> power",
];

export const jsExpressionBuilder = (
  sublanguage: string | Array<string>
): string => {
  const getInnerText = (str: string): string => {
    return str.replace(/^\[(.*)\]$/, "$1");
  };
  if (sublanguage instanceof Array) {
    switch (sublanguage[0]) {
      case "<AssignStat>":
        if (/^\[[^#\[\]]*\]$/.test(sublanguage[1])) {
          return (
            'output_var["' +
            getInnerText(sublanguage[1]) +
            '"] ' +
            sublanguage.slice(2).join(" ")
          );
        }
        return (
          'local_var["' +
          getInnerText(sublanguage[1]) +
          '"] ' +
          sublanguage.slice(2).join(" ")
        );
      case "<Expr>":
        if (/^[a-zA-Z_]+$/.test(sublanguage[1])) {
          return (
            '(local_var["' +
            getInnerText(sublanguage[1]) +
            '"] != undefined ? local_var["' +
            getInnerText(sublanguage[1]) +
            '"] : predef_var["' +
            getInnerText(sublanguage[1]) +
            '"])' +
            sublanguage.slice(2).join(" ")
          );
        }
        return sublanguage.slice(1).join(sublanguage[1] === "..." ? "" : " ");
      case "<Array>":
        return sublanguage[2] === ")"
          ? "[]"
          : "[" + sublanguage[2] + ", " + sublanguage[4] + "]";
      case "<Tuple>":
        return sublanguage[2] === ")" ? "()" : "(" + sublanguage[2] + ")";
      case "<Args>":
        return sublanguage[2] === ","
          ? sublanguage[1] + ", " + sublanguage[3]
          : sublanguage[1];
      case "<Factor>":
        if (/^\d+$/.test(sublanguage[1])) {
          if (sublanguage.length == 2) {
            return Number(sublanguage[1]).toString();
          } else if (sublanguage.length == 4 && sublanguage[2] == ".") {
            return Number(sublanguage[1]).toString() + "." + sublanguage[3];
          }
        }
        return sublanguage.slice(1).join(" ");
      case "<Primary>":
        return sublanguage[2] !== "."
          ? sublanguage[1]
          : /^\d+$/.test(sublanguage[3])
          ? sublanguage[1] + "[" + (Number(sublanguage[3]) - 1).toString() + "]"
          : sublanguage[1] + "[" + sublanguage[3] + "]";
      case "<PrimaryWithoutChain>":
        return sublanguage[1] === "("
          ? "(" + sublanguage[2] + ")"
          : sublanguage[1];
      case "<Variable>":
        return /^\[#\d*\]$/.test(sublanguage[1])
          ? "index_var[" +
              Math.max(
                Number(sublanguage[1].replace(/^\[#(\d*)\]$/, "$1")) - 1,
                0
              ) +
              "]"
          : /^\[[^#\[\]]*\]$/.test(sublanguage[1])
          ? 'input_var["' + getInnerText(sublanguage[1]) + '"]'
          : '(local_var["' +
            getInnerText(sublanguage[1]) +
            '"] != undefined ? (local_var["' +
            getInnerText(sublanguage[1]) +
            '"] : predef_var["' +
            getInnerText(sublanguage[1]) +
            '"])' +
            sublanguage.slice(2).join(" ");
      case "<PowOp>":
        return "**";
      default:
        return sublanguage.slice(1).join(" ");
    }
  }
  return sublanguage;
};

type CssType =
  | "default"
  | "number"
  | "output"
  | "local"
  | "local_or_predef"
  | "function"
  | "input"
  | "index"
  | "string";

export const cssExpressionBuilder = (
  sublanguage: any
): Array<string | { text: string; type: CssType }> => {
  const getInnerText = (str: string): string => {
    return str.replace(/^\[(.*)\]$/, "$1");
  };
  if (sublanguage instanceof Array) {
    switch (sublanguage[0]) {
      case "<Stats>":
        return sublanguage[2] === "\n"
          ? [
              ...sublanguage[1],
              { text: sublanguage[2], type: "default" },
              ...sublanguage[3],
            ]
          : sublanguage[1];
      case "<AssignStat>":
        if (/^\[[^#\[\]]*\]$/.test(sublanguage[1])) {
          return [
            { text: sublanguage[1], type: "output" },
            { text: sublanguage[2], type: "default" },
            ...sublanguage[3],
          ];
        }
        return [
          { text: sublanguage[1], type: "local" },
          { text: sublanguage[2], type: "default" },
          ...sublanguage[3],
        ];
      case "<Expr>":
        if (/^[a-zA-Z_]+$/.test(sublanguage[1])) {
          return [
            { text: sublanguage[1], type: "local_or_predef" },
            ...sublanguage[2],
          ];
        }
        return sublanguage[2] === "..."
          ? [{ text: sublanguage[1], type: "default" }, ...sublanguage[2]]
          : sublanguage.slice(1).reduce((pre, curr) => pre.concat(curr), []);
      case "<Array>":
        return sublanguage[2] === ")"
          ? [{ text: "()", type: "default" }]
          : [
              { text: sublanguage[1], type: "default" },
              ...sublanguage[2],
              { text: sublanguage[3], type: "default" },
              ...sublanguage[4],
              { text: sublanguage[5], type: "default" },
            ];
      case "<Tuple>":
        return sublanguage[2] === ")"
          ? [{ text: "()", type: "function" }]
          : [
              { text: sublanguage[1], type: "function" },
              ...sublanguage[2],
              { text: sublanguage[3], type: "function" },
            ];
      case "<Args>":
        return sublanguage[2] === ","
          ? [
              ...sublanguage[1],
              { text: sublanguage[2], type: "default" },
              ...sublanguage[3],
            ]
          : sublanguage[1];
      case "<Factor>":
        if (/^\d+$/.test(sublanguage[1])) {
          if (sublanguage.length == 2) {
            return [{ text: sublanguage[1], type: "number" }];
          } else if (sublanguage.length == 4 && sublanguage[2] == ".") {
            return [{ text: sublanguage.slice(1).join(""), type: "number" }];
          }
        } else if (
          /"[^"\\]*"/.test(sublanguage[1]) &&
          sublanguage.length == 2
        ) {
          return [{ text: sublanguage.slice(1).join(""), type: "string" }];
        }
        return sublanguage.slice(1).reduce((pre, curr) => pre.concat(curr), []);
      case "<Primary>":
        return sublanguage[2] !== "."
          ? sublanguage[1]
          : /^\d+$/.test(sublanguage[3])
          ? [
              ...sublanguage[1],
              { text: sublanguage[2], type: "default" },
              { text: sublanguage[3], type: "number" },
            ]
          : /"[^"\\]*"/.test(sublanguage[3])
          ? [
              ...sublanguage[1],
              { text: sublanguage[2], type: "default" },
              { text: sublanguage[3], type: "string" },
            ]
          : [
              ...sublanguage[1],
              { text: sublanguage[2], type: "default" },
              ...sublanguage[3],
            ];
      case "<PrimaryWithoutChain>":
        return sublanguage[1] === "("
          ? [
              { text: sublanguage[1], type: "default" },
              ...sublanguage[2],
              { text: sublanguage[3], type: "default" },
            ]
          : /\d*(\.\d*)?\d/.test(sublanguage[1])
          ? [{ text: sublanguage[1], type: "number" }]
          : sublanguage[1];
      case "<Variable>":
        return /^\[#\d*\]$/.test(sublanguage[1])
          ? [{ text: sublanguage[1], type: "index" }]
          : /^\[[^#\[\]]*\]$/.test(sublanguage[1])
          ? [{ text: sublanguage[1], type: "input" }]
          : [{ text: sublanguage[1], type: "local_or_predef" }];
      case "<AddOp>":
      case "<MulOp>":
      case "<PowOp>":
        return [{ text: sublanguage[1], type: "default" }];
      default:
        return sublanguage.slice(1).reduce((pre, curr) => pre.concat(curr), []);
    }
  }
  return sublanguage;
};

export const start_symbol: string = "<Stats>";

export const makeFunction = (stats: string): string => {
  return (
    `({input_var, predef_var, index_var}) => {
  const local_var = {};
  const output_var = {};
  let message = "";
  try {
    ` +
    (stats[0] || 'message = "잘못된 문법으로 작성되었어요."') +
    `
    return {output_var, message};
  } catch (e) {
    return {output_var: {}, message: e.message};
  }
}`
  );
};

// [#] [ㄹ]

// export let a:number = 3;

// V=V*V

// 산식
// [전용면적]=[건물 연면적]*[전용률]
// [연 NOI]=[전용면적]*[전용면적당 임대료]*[1년]
// [연 임대료 상승률]
// [매각년도 연 NOI]=[연 NOI]*(1+[연 임대료 상승률])^[운용기간]
// [매각금액]=[매각년도 연 NOI]/[매각 Cap Rate]
// [대부비율(LTV)], [대출금리], [요구수익률]
// [매입금액]
// [대출액]=[매입금액]*[대부비율(LTV)]
// [연 이자액]=[대출액]*[대출금리]
// [연차별 NOI].[#]=[연 NOI]*(1+[연 임대료 상승률])^[#]
// [0년차 현금흐름]=[대출액]-[매입금액]
// [연차별 현금흐름].[#]=[연차별 NOI].[#]-[연 이자액]
// [매각년도 현금흐름]=[연차별 NOI].[운용기간]+[매각금액]-[연 이자액]-[대출액]
// [내부수익률(IRR)]=[IRR]([0년차 현금흐름],...[연차별 현금흐름],[매각년도 현금흐름])
