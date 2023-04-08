import { Maybe, Warning, Object, getItemByPath } from "./primitiveTypes";
import { Graph, Node } from "./graph";

export const LINKER = "___";

export const CONTENT_TYPE = {
  VALUE_WITH_UNIT: "value_with_unit",
  NICKNAMED_VALUE: "nicknamed_value",
  VARIABLE: "variable",
  VARIABLE_ID: "variable_id",
  VARIABLE_ID_WITH_ID: "variable_id_with_id",
  PARAMETER: "parameter",
  BASIC_PAGE: "basic_page",
  CARD: "card",
  PAGE: "page",
  SECTION: "section",
  ETC: "etc",
} as const;
export type CONTENT_TYPE = typeof CONTENT_TYPE[keyof typeof CONTENT_TYPE];

// Values

export type PrimitiveValue = number | string;
export type PrimitiveData =
  | Maybe<PrimitiveValue>
  | Array<PrimitiveData>
  | { [key: string]: PrimitiveData }
  | ((...args: Array<PrimitiveData>) => PrimitiveData);
export type ValueWithUnit = {
  type: CONTENT_TYPE;
  value?: number;
  unit: string;
};
export type RawValue = PrimitiveValue | ValueWithUnit;
export type Code = string | Card;

// Structures

// export const bind = (
//   fn: (...b: Array<B>) => Maybe<C>,
//   ...args: Array<(...a: Array<A>) => Maybe<B>>
// ): ((...a: Array<A>) => Maybe<C>) => {
//   return (...args2: Array<A>) => {};
// };

export type Value = RawValue | NicknamedValue[] | Object<NicknamedValue>;

export interface NicknamedValue {
  type: CONTENT_TYPE;
  nickname?: string;
  value: Value;
  nicknaming_rule?: Code;
  isValid?(value: PrimitiveValue): Maybe<true>;
}

export interface Variable {
  type: CONTENT_TYPE;
  id: string;
  value: Value;
  nicknaming_rule?: Code;
  isValid?(value: PrimitiveValue): Maybe<true>;
}

export interface VariableId {
  type: CONTENT_TYPE;
  variable_id: string;
  value_path?: Array<number | string>;
}

export class VariableIdWithId implements VariableId {
  type: CONTENT_TYPE;
  id: string;
  variable_id: string;
  value_path?: Array<number | string>;
  constructor(
    id: string,
    variable_id: string,
    value_path?: Array<number | string>
  ) {
    this.type = CONTENT_TYPE.VARIABLE_ID_WITH_ID;
    this.id = id;
    this.variable_id = variable_id;
    this.value_path = value_path;
  }
}

export interface Parameter {
  type: CONTENT_TYPE;
  name: string;
  default?: VariableId;
  op?: string;
  illust?: string;
  show?: boolean;
}

export interface ParameterWithStructure extends Parameter {
  structure: Variable;
}

export interface BasicPage {
  type: CONTENT_TYPE;
  id: string;
  nickname_list?: Array<string>;
  illust?: string;
  calculate: (...args: Array<any>) => Maybe<Array<PrimitiveData>>;
  input_list: Array<Parameter>;
  output_list: Array<Parameter>;
}

export type RegisteredPage = (BasicPage & Page) | BasicPage;

export class Card {
  type: CONTENT_TYPE;
  id: string;
  page_id: string;
  input_list?: Array<VariableId | undefined>;
  output_list?: Array<VariableId | undefined>;
  constructor(
    id: string,
    page_id: string,
    input_list?: Array<VariableId | undefined>,
    output_list?: Array<VariableId | undefined>
  ) {
    this.type = CONTENT_TYPE.CARD;
    this.id = id;
    this.page_id = page_id;
    this.input_list = input_list;
    this.output_list = output_list;
  }
}

export interface Page {
  type: CONTENT_TYPE;
  id: string;
  nickname_list?: Array<string>;
  illust?: string;
  inside_section_list: Array<Section>;
  input_list: Array<ParameterWithStructure>;
  output_list: Array<ParameterWithStructure>;
}

export type Content = Card | VariableIdWithId;

export interface Section {
  type: CONTENT_TYPE;
  title: string;
  illust?: string;
  content_list: Array<Content>;
}

// assistant method

export const toTypedId = (type: CONTENT_TYPE, id: string): string => {
  return type + LINKER + id;
};

export const getFromTypedId = {
  Type: (typed_id: string): CONTENT_TYPE => {
    const temp = typed_id.split(LINKER);
    if (Object.keys(CONTENT_TYPE).includes(temp[0]))
      return temp[0] as CONTENT_TYPE;
    return CONTENT_TYPE.ETC;
  },
  Id: (typed_id: string): string => {
    const temp = typed_id.split(LINKER);
    if (temp.length === 2) return temp[1];
    return temp[0];
  },
};

const _getVariableDependencyData = (
  content_list: Array<Content>
): Maybe<Object<{ from?: Node; to: Node[] }>> => {
  const variable_dependency_data: Object<{ from?: Node; to: Node[] }> = {};
  for (let content of content_list) {
    const node_id = toTypedId(content.type, content.id);
    if (content instanceof Card) {
      content.input_list?.forEach((input) => {
        if (input !== undefined) {
          const input_id = toTypedId(input.type, input.variable_id);
          variable_dependency_data[input_id] ??= { to: [] };
          variable_dependency_data[input_id].to.push(node_id);
        }
      });
      if (content.output_list) {
        for (let output of content.output_list) {
          if (output !== undefined) {
            const output_id = toTypedId(output.type, output.variable_id);
            variable_dependency_data[output_id] ??= { to: [] };
            const previous_from = variable_dependency_data[output_id].from;
            if (previous_from) {
              return new Warning(
                `변수 ${output_id}가 카드 ${getFromTypedId.Id(
                  previous_from
                )}와 ${content.id}의 결과값으로 중복되어 있어요.`,
                "_getVariableDependencyData"
              );
            } else {
              variable_dependency_data[output_id].from = node_id;
            }
          }
        }
      }
    }
  }
  return _removeDependencyDuplicates(variable_dependency_data);
};

const _removeDependencyDuplicates = (
  data: Object<{ from?: Node; to: Node[] }>
): Object<{ from?: Node; to: Node[] }> => {
  Object.keys(data).forEach((key) => {
    const to_set = new Set(data[key].to);
    to_set.delete(data[key].from ?? "");
    data[key].to = Array.from(to_set);
  });
  return data;
};

/** @param path idx의 list를 입력하세요. */
export const getValueByPathFromVariable = (
  data: Variable | NicknamedValue,
  path?: (number | string)[]
): Value | undefined => {
  if (path === undefined || path.length === 0) return data.value;
  const new_path = path.slice(1, -1);
  const new_data = (data.value as any)?.[path[0]] as NicknamedValue | undefined;
  if (new_data === undefined) return undefined;
  return getValueByPathFromVariable(new_data, new_path);
};

// main methods

/** initial var, interm fn, terminal var로 이루어진 dep graph 생성 */
export const getDependencyGraph = (page: Page): Maybe<Graph> => {
  const content_list = page.inside_section_list.reduce(
    (prev: Content[], curr) => prev.concat(curr.content_list),
    []
  );
  const card_list = content_list.filter((content) => content instanceof Card);
  let g = new Graph();
  const var_dep_data = _getVariableDependencyData(content_list);

  if (var_dep_data instanceof Warning) return var_dep_data;

  card_list.forEach((card) => {
    g.addNode(toTypedId(card.type, card.id));
  });
  Object.keys(var_dep_data).forEach((key) => {
    const from = var_dep_data[key].from;
    if (from !== undefined) {
      if (var_dep_data[key].to.length === 0) {
        g.addNode(key);
        g.addDirectedEdge(from, key);
      }
      for (let to of var_dep_data[key].to) {
        g.addDirectedEdge(from, to);
      }
    } else {
      g.addNode(key);
      for (let to of var_dep_data[key].to) {
        g.addDirectedEdge(key, to);
      }
    }
  });

  return g;
};

export const primitify = (value: Value): PrimitiveData => {
  if (Array.isArray(value)) return value.map((e) => primitify(e.value));
  if (typeof value === "number" || typeof value === "string") return value;
  if ((value as ValueWithUnit).type === CONTENT_TYPE.VALUE_WITH_UNIT)
    return (
      (value as ValueWithUnit).value ??
      new Warning("값을 입력하세요.", "_primitify")
    );
  return Object.keys(value as Object<NicknamedValue>).reduce(
    (prev, curr_key) => {
      return {
        ...prev,
        curr_key: primitify((value as Object<NicknamedValue>)[curr_key].value),
      };
    },
    {}
  );
};

export const unprimitify = (
  value: Value,
  primitive_data: PrimitiveData
): Maybe<Value> => {
  const warning = new Warning("맞지 않는 값이 입력되었어요.", "_unprimitify");
  try {
    if (primitive_data instanceof Warning) return warning;

    if (Array.isArray(value)) {
      if (!Array.isArray(primitive_data)) return warning;
      const result: NicknamedValue[] = [];
      for (let idx in value) {
        const output = unprimitify(
          value[idx].value,
          (primitive_data as PrimitiveData[])[idx]
        );
        if (output instanceof Warning) return output;
        result.push({ ...value[idx], value: output });
      }
      return result;
    }

    if (typeof value === "number") {
      if (typeof primitive_data !== "number") return warning;
      return primitive_data;
    }

    if (typeof value === "string") {
      if (typeof primitive_data !== "string") return warning;
      return primitive_data;
    }

    if ((value as ValueWithUnit).type === CONTENT_TYPE.VALUE_WITH_UNIT) {
      if (typeof primitive_data !== "number") return warning;
      return { ...(value as ValueWithUnit), value: primitive_data };
    }

    const output_value: Object<NicknamedValue> = {};
    for (let key in value as Object<NicknamedValue>) {
      if ((primitive_data as Object<PrimitiveData>)[key] === undefined)
        return warning;
      const output = unprimitify(
        (value as Object<NicknamedValue>)[key].value,
        (primitive_data as Object<PrimitiveData>)[key]
      );
      if (output instanceof Warning) return warning;
      output_value[key] = { ...output_value[key], value: output };
    }
    return output_value;
  } catch (e) {
    return warning;
  }
};
