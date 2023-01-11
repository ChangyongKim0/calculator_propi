import { Tokenizer, Grammar } from "earley-parser";

export const terminal_symbol = [
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

export const Grammar_string = [
  "<Stats> -> <Stat> | <Stats> \n <Stat>",
  "<Stat> -> <Expr> | <AssignStat>",
  "<AssignStat> -> param_var = <Expr> | local_or_predef_var = <Expr>",
  "<Expr> -> <Term> | <Expr> <AddOp> <Term> | <AddOp> <Term> | <Array> | spreader <Factor> | spreader <Array>",
  "<Array> -> ( ) | ( <Expr> , <Args> )",
  "<Tuple> -> ( ) | ( <Args> )",
  "<Args> -> <Expr> | <Expr> , <Args>",
  "<Term> -> <Factor> | <Term> <MulOp> <Factor>",
  "<Factor> -> <Primary> | <Factor> <PowOp> <Factor> | number . number | number | string | local_or_predef_var <Tuple>",
  "<Primary> -> <PrimaryWithoutChain> | <Primary> . <PrimaryWithoutChain> | <Primary> . number | <Primary> . string",
  "<PrimaryWithoutChain> -> <Variable> | ( <Expr> )",
  "<Variable> -> index_var | param_var | local_or_predef_var",
  "<AddOp> -> + | -",
  "<MulOp> -> * | / | quotient | %",
  "<PowOp> -> power",
];

const jsExpressionBuilder = (sublanguage) => {
  // console.log(sublanguage);
  const getInnerText = (str) => {
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
        if (/^[a-zA-Z_]+$/.test(sublanguage[1]) && sublanguage.length == 3) {
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
        return sublanguage.slice(1).join(" ");
      case "<Primary>":
        return sublanguage[2] !== "."
          ? sublanguage[1]
          : /^\d+$/.test(sublanguage[3])
          ? sublanguage[1] + "[" + Number(sublanguage[3] - 1).toString() + "]"
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

const cssExpressionBuilder = (sublanguage) => {
  // console.log(sublanguage);
  const getInnerText = (str) => {
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
        return sublanguage[1] === "..."
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
        }
        if (/"[^"\\]*"/.test(sublanguage[1]) && sublanguage.length == 2) {
          return [{ text: sublanguage.slice(1).join(""), type: "string" }];
        }
        if (/^[a-zA-Z_]+$/.test(sublanguage[1]) && sublanguage.length == 3) {
          return [
            { text: sublanguage[1], type: "local_or_predef" },
            ...sublanguage[2],
          ];
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

export const start_symbol = "<Stats>";

const regularize = (string) => {
  const str_list = string.split(/(\[[^#\[\]]*\])/);
  return str_list
    .map((e, idx) => (idx % 2 === 0 ? e.replace(/ /g, "") : e))
    .join("");
};

const tokenize = (terminal_symbol) => {
  const T = new Tokenizer();
  terminal_symbol.forEach((e) => {
    T.addType(e.regex);
  });
  T.addType(/./);
  return T;
};

const setGrammar = (terminal_symbol, Grammar_string, start_symbol) => {
  const G = new Grammar(start_symbol);
  Grammar_string.forEach((e) => {
    const parts = e.split("->");
    const root = parts[0].trim();
    const productions = parts[1].split("|").map((e) => e.trim());
    const formatSymbol = (symbol) => {
      return /<[a-zA-Z]*>/.test(symbol)
        ? symbol
        : terminal_symbol.find((e) => e.name == symbol).regex;
    };
    G.addRule(
      root,
      ...productions.map((e) => e.split(" ").map((e2) => formatSymbol(e2)))
    );
  });
  return G;
};

const message_mapping_list = [
  { contains: /input_var./, map_to: "입력받을 " },
  { contains: /output_var./, map_to: "내보낼 " },
  { contains: /predef_var./, map_to: "지정되어 있는" },
  { contains: /index_var./, map_to: "번호" },
  { contains: /local_var./, map_to: "내부에서 사용중인 " },
  {
    contains: /(\(intermediate value\))+/,
    map_to: "의도와 다르게 에러가 생긴 값",
  },
  { contains: / is not iterable$/, map_to: "이(가) 리스트 형태가 아니예요." },
  { contains: / is not a function$/, map_to: "이(가) 함수 형태가 아니예요." },
  {
    contains: /^Cannot read property '(.*)' of (.*)$/,
    mapTo: (_, p1, p2) => p2 + "의 하위 값은 불러올 수 없어요.",
  },
  { contains: /undefined/, map_to: "미지정된 값" },
];

const mapErrorMessage = (msg) => {
  if (msg === "") {
    return "";
  }
  let mapped_msg = msg;
  message_mapping_list.forEach(
    (e) => (mapped_msg = mapped_msg.replace(e.contains, e.map_to || e.mapTo))
  );
  return mapped_msg;
};

export const getParser = (
  terminal_symbol,
  Grammar_string,
  start_symbol,
  jsExpressionBuilder = false,
  cssExpressionBuilder = false,
  makeFunction = () => {},
  mapErrorMessage = (msg) => msg
) => {
  const T = tokenize(terminal_symbol);
  const G = setGrammar(terminal_symbol, Grammar_string, start_symbol);
  const G2 = setGrammar(terminal_symbol, Grammar_string, start_symbol);
  G.setOption("tokenizer", T);
  G2.setOption("tokenizer", T);
  G.setOption("addCategories", true);
  G2.setOption("addCategories", true);
  if (jsExpressionBuilder) {
    G.setOption("expressionBuilder", jsExpressionBuilder);
  }
  if (cssExpressionBuilder) {
    G2.setOption("expressionBuilder", cssExpressionBuilder);
  }
  G.parseString = (str) => G.parse(regularize(str));
  G2.parseString = (str) => G2.parse(regularize(str));
  G.makeFunction = (str) => {
    const fn = eval(makeFunction(G.parseString(str)));
    return (inputs) => {
      const output = fn(inputs);
      return { ...output, mapped_message: mapErrorMessage(output.message) };
    };
  };
  G.makeHtml = (str) => {
    return G2.parseString(str);
  };
  return G;
};

const makeFunction = (stats) => {
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
// const G = setGrammar(terminal_symbol, Grammar_string, start_symbol);

// console.log(G.parse("param_var=Expr"));

const parser = getParser(
  terminal_symbol,
  Grammar_string,
  start_symbol,
  jsExpressionBuilder,
  cssExpressionBuilder,
  makeFunction,
  mapErrorMessage
);

const string = `[내부수익률(IRR)]=IRR([0년차 현금흐름], ...[연차별 현금흐름 목록], [매각년도 현금흐름])\n[NPV 제곱]=(NPV([요구수익률],[0년차 현금흐름], ...[연차별 현금흐름 목록], [매각년도 현금흐름]))^2`;

// console.log(tokenize(terminal_symbol).tokenize(regularize(string)));

console.log(parser.parseString(string));
console.log(parser.makeFunction(string));
console.log(parser.makeHtml(string));
const fn = parser.makeFunction(string);
console.log(
  fn({
    input_var: { "0년차 현금흐름": "f" },
    predef_var: { IRR: (x) => x },
    index_var: [1, 2],
  })
);
