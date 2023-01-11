type NumberListFunction = (args: Array<number>) => Array<number>;

type NumberFunction = (arg: number) => number;

type Optimizer = "GD";

export const optimize = (
  fn: NumberListFunction,
  initial_input: Array<number>,
  input_idx_to_change: number,
  output_idx_to_optimize: number
): Array<number> => {
  const new_input = [...initial_input];
  const new_fn = makeToOneDimension(
    fn,
    new_input,
    input_idx_to_change,
    output_idx_to_optimize
  );
  const optimized_input = oneDimensionOptimize(
    new_fn,
    1000,
    new_input[input_idx_to_change]
  ).value;
  new_input[input_idx_to_change] = optimized_input;
  return fn(new_input);
};

const makeToOneDimension = (
  fn: NumberListFunction,
  initial_input: Array<number>,
  input_idx_to_change: number,
  output_idx_to_optimize: number
): NumberFunction => {
  const new_input = [...initial_input];
  return (arg) => {
    new_input[input_idx_to_change] = arg;
    return fn(new_input)[output_idx_to_optimize];
  };
};

export const oneDimensionOptimize = (
  fn: NumberFunction,
  max_iteration: number = 1000,
  initial_input: number = 0,
  x_threshold?: number,
  y_threshold?: number,
  optimizer: Optimizer = "GD"
): { value: number; message: string } => {
  const sample_input = initial_input == 0 ? 1 : initial_input;
  const sample_output = fn(initial_input) == 0 ? 1 : fn(initial_input);
  const new_fn = (arg: number): number =>
    fn(arg * sample_input) / sample_output;
  const x_diff = 0.00001;
  const learning_rate = 0.01;

  let prev_x = 0.5;
  let curr_x = 1;
  let prev_y = new_fn(prev_x);
  let curr_y = new_fn(curr_x);
  let iteration = 0;

  while (
    Math.abs(curr_x - prev_x) >
      (x_threshold ? x_threshold / sample_input : y_threshold ? -1 : x_diff) &&
    Math.abs(curr_y - prev_y) > (y_threshold ? y_threshold / sample_output : -1)
  ) {
    if (iteration > max_iteration) {
      break;
    }
    const derivative = (new_fn(curr_x + x_diff) - curr_y) / x_diff;
    prev_x = curr_x;
    prev_y = curr_y;
    curr_x -= learning_rate * derivative;
    curr_y = new_fn(curr_x);
    iteration += 1;
  }
  if (iteration > max_iteration) {
    return {
      value: curr_x * sample_input,
      message: "최대 반복 횟수를 초과했습니다.",
    };
  }
  return { value: curr_x * sample_input, message: "" };
};
