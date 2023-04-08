import { Warning, Maybe, Object } from "./primitiveTypes";
import {
  Card,
  Value,
  RegisteredPage,
  Page,
  PrimitiveData,
  VariableIdWithId,
  VariableId,
  Variable,
  getValueByPathFromVariable,
  getDependencyGraph,
  getFromTypedId,
  CONTENT_TYPE,
  primitify,
  unprimitify,
  Content,
} from "./dataTypes";

export const getRegisteredPage = (
  card: Card,
  registered_pages: Object<RegisteredPage>
): Maybe<RegisteredPage> => {
  const page = registered_pages[card.page_id];
  if (page === undefined)
    return new Warning(
      `카드 ${card.id}에 해당하는 페이지가 없어요.`,
      "getPage"
    );
  return page;
};

export const getRegisteredVariable = (
  parameter: VariableIdWithId | VariableId,
  registered_variables: Object<Variable>
): Maybe<Variable> => {
  const variable = registered_variables[parameter.variable_id];
  if (variable === undefined)
    return new Warning(
      `변수 ${parameter.variable_id}는 존재하지 않아요.`,
      "getRegisteredVariable"
    );
  return variable;
};

export const getRegisteredValue = (
  parameter: VariableIdWithId | VariableId,
  registered_variables: Object<Variable>
): Maybe<Value> => {
  const value = getValueByPathFromVariable(
    registered_variables[parameter.variable_id],
    parameter.value_path
  );
  if (value === undefined)
    return new Warning(
      `변수 ${parameter.variable_id}에 값이 정의되지 않았어요.`,
      "getRegisteredValue"
    );
  return value;
};

export const registerCard = (
  card: Card,
  registered_pages: Object<RegisteredPage>,
  registered_variables: Object<Variable>
): Maybe<Object<Variable>> => {
  try {
    const page = getRegisteredPage(card, registered_pages);
    if (page instanceof Warning) return page;

    const input_value_list: Value[] = [];

    for (let idx in page.input_list) {
      const variable_id =
        card.input_list?.[idx] ?? page.input_list[idx].default;
      if (variable_id === undefined)
        return new Warning(
          `변수 ${page.input_list[idx].name}에 들어갈 값을 입력하세요.`,
          "registerCard"
        );
      const value = getRegisteredValue(variable_id, registered_variables);
      if (value instanceof Warning) return value;
      input_value_list.push(value);
    }

    const result = page.calculate(...input_value_list.map((e) => primitify(e)));

    if (result instanceof Warning) return result;

    for (let idx in page.output_list) {
      const variable_id =
        card.output_list?.[idx] ?? page.output_list[idx].default;
      if (variable_id === undefined)
        return new Warning(
          `변수 ${page.output_list[idx].name}에 들어갈 값을 입력하세요.`,
          "registerCard"
        );
      const output_variable = getRegisteredVariable(
        variable_id,
        registered_variables
      );
      if (output_variable instanceof Warning) return output_variable;
      const output_value = unprimitify(output_variable.value, result[idx]);
      if (output_value instanceof Warning) return output_value;
      registered_variables[output_variable.id] = {
        ...output_variable,
        value: output_value,
      };
    }
    return registered_variables;
  } catch (e) {
    return new Warning(`카드 ${card.id} 등록에 실패했어요.`, "registerCard");
  }
};

export const getPageCalculationFunction = (
  page: Page,
  registered_pages: Object<RegisteredPage>
): Maybe<
  (...args: Array<any>) => Maybe<{
    output_data: Array<PrimitiveData>;
    registered_variables: Object<Variable>;
  }>
> => {
  const dep_g = getDependencyGraph(page);
  if (dep_g instanceof Warning) return dep_g;

  const dep_list = dep_g.topologicalSort();
  if (dep_list instanceof Warning) return dep_list;

  const content_list = page.inside_section_list.reduce(
    (prev: Content[], curr) => [...prev, ...curr.content_list],
    []
  );
  const card_list = content_list.filter(
    (content) => content.type === CONTENT_TYPE.CARD
  ) as Card[];

  return (
    ...args: Array<any>
  ): Maybe<{
    output_data: Array<PrimitiveData>;
    registered_variables: Object<Variable>;
  }> => {
    try {
      let registered_variables: Object<Variable> = {};
      for (let idx in page.input_list) {
        const structure = page.input_list[idx].structure;
        const input_value = unprimitify(structure.value, args[idx]);
        if (input_value instanceof Warning) return input_value;
        const input_variable = {
          ...structure,
          value: input_value,
        };
        registered_variables[structure.id] = input_variable;
      }

      for (let idx in dep_list) {
        const card = card_list.filter(
          (e) => e.id === getFromTypedId.Id(dep_list[idx])
        )[0];
        const temp_registered_variables = registerCard(
          card,
          registered_pages,
          registered_variables
        );
        if (temp_registered_variables instanceof Warning)
          return temp_registered_variables;
        registered_variables = temp_registered_variables;
      }

      const output_data = [];
      for (let idx in page.output_list) {
        const structure = page.output_list[idx].structure;
        const output_value = unprimitify(structure.value, args[idx]);
        if (output_value instanceof Warning) return output_value;
        output_data.push(primitify(output_value));
      }
      return { output_data, registered_variables };
    } catch (e) {
      return new Warning("");
    }
  };
};

export const registerPage = (
  page: Page,
  registered_pages: Object<RegisteredPage>
): Maybe<RegisteredPage> => {
  const calculate = (...args: Array<any>) => {
    const pageCalculationFunction = getPageCalculationFunction(
      page,
      registered_pages
    );
    if (pageCalculationFunction instanceof Warning)
      return pageCalculationFunction;
    const output = pageCalculationFunction(...args);
    if (output instanceof Warning) return output;
    return output.output_data;
  };
  return { ...page, calculate };
};

export const getPageVariableRegister = (
  page: Page,
  registered_pages: Object<RegisteredPage>
): ((...args: Array<any>) => Maybe<Object<Variable>>) => {
  return (...args: Array<any>) => {
    const pageCalculationFunction = getPageCalculationFunction(
      page,
      registered_pages
    );
    if (pageCalculationFunction instanceof Warning)
      return pageCalculationFunction;
    const output = pageCalculationFunction(...args);
    if (output instanceof Warning) return output;
    return output.registered_variables;
  };
};
