export class Warning {
  valid: false;
  message: string;
  warner?: string;

  constructor(message: string, warner?: string) {
    this.valid = false;
    this.message = message;
    if (warner) {
      this.warner = warner;
    }
  }

  replaceMsg(message: string, warner?: string) {
    this.message = message;
    this.warner = warner;
  }

  concatMsg(message: string, warner?: string) {
    this.message = message + "\n[" + this.warner ?? "익명" + "] : " + message;
    this.warner = warner;
  }
}
export type Maybe<T> = Warning | T;

// DataTrees

export type ArrayTree<T> = T | Array<ArrayTree<T>>;
export type ObjectTree<T> = T | { [key: string]: ObjectTree<T> };
export type ArrayObjectTree<T> =
  | T
  | Array<ArrayObjectTree<T>>
  | { [key: string]: ArrayObjectTree<T> };
export type SingletFunctionTree<T> =
  | T
  | ((a: SingletFunctionTree<T>) => SingletFunctionTree<T>);
export type FunctionTree<T> =
  | T
  | ((...args: Array<FunctionTree<T>>) => FunctionTree<T>);
export type DataTree<T> =
  | T
  | Array<DataTree<T>>
  | { [key: string]: DataTree<T> }
  | ((...args: Array<DataTree<T>>) => DataTree<T>);

// Data

export type Object<T> = { [key: string]: T };

export function getItemByPath<T>(
  data: DataTree<T>,
  path?: (number | string)[]
): DataTree<T> | undefined {
  if (path === undefined || path.length === 0) return data;
  const new_path = path.slice(1, -1);
  const new_data = (data as any)?.[path[0]] as DataTree<T> | undefined;
  if (new_data === undefined) return undefined;
  return getItemByPath<T>(new_data, new_path);
}
