import { getDefaultCardData } from "./getDefaultData";

const number_char =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";

const changeNumberBase = (input, from, to) => {
  if (from > 64 || to > 64) {
    return "";
  }
  return _toString(_toNumber(input, from), to);
};

const _toNumber = (string, base) => {
  if (string.length == 0) {
    return 0;
  }
  return (
    _toNumber(string.slice(0, string.length - 1), base) * base +
    number_char.indexOf(string[string.length - 1])
  );
};

const _toString = (number, base) => {
  if (number < 1) {
    return "";
  }
  return (
    _toString(number / base - (number % base) / base, base) +
    number_char[Math.round(number % base)]
  );
};

const _countLatterZeros = (number, prev_zeros = 0) => {
  if (number % 10 == 0 && number != 0) {
    return _countLatterZeros(number / 10, prev_zeros + 1);
  }
  return prev_zeros;
};

export const encodeNumberList = (number_list, version = "v1") => {
  try {
    switch (version) {
      case "v1":
        const pre_encoded_str = number_list
          .map((e, _) => {
            if (e < 10) {
              const latter_zeros = _countLatterZeros(e * 10000);
              return (
                "a" +
                (latter_zeros > 2
                  ? Math.round((e * 10000) / Math.pow(10, latter_zeros)) +
                    "a" +
                    latter_zeros
                  : Math.round(e * 10000))
              );
            }
            const latter_zeros = _countLatterZeros(e);
            return latter_zeros > 2
              ? Math.round(e / Math.pow(10, latter_zeros)) + "a" + latter_zeros
              : Math.round(e);
          })
          .join("b");
        // console.log(pre_encoded_str);
        return (
          "v1" +
          _splitStr(pre_encoded_str, 5)
            .map((e) => _fillZeros(changeNumberBase(e, 12, 63), 3))
            .join("")
        );
      default:
        return "v0" + number_list.join("-");
    }
  } catch (e) {
    return "";
  }
};

export const decodeToNumberList = (string, version = "v1") => {
  try {
    switch (version) {
      case "v1":
        const pre_decoded_str = _splitStr(string.slice(2), 3)
          .map((e) => _fillZeros(changeNumberBase(e, 63, 12), 5))
          .join("");
        const sep_list = pre_decoded_str.split("b").map((e) => e.split("a"));
        // console.log(pre_decoded_str);
        // console.log(sep_list);
        return sep_list
          .map((e) => {
            if (e.length == 1) {
              if (e[0] == "") {
                return NaN;
              }
              return Number(e[0]);
            } else if (e.length == 2) {
              if (e[0] == "") {
                return Number(e[1]) / 10000;
              }
              return Number(e[0]) * Math.pow(10, Number(e[1]));
            } else if (e.length == 3) {
              return (Number(e[1]) * Math.pow(10, Number(e[2]))) / 10000;
            }
            return NaN;
          })
          .filter((e) => !isNaN(e));
      default:
        return string
          .slice(2)
          .split("-")
          .map((e) => Number(e));
    }
  } catch (e) {
    return [];
  }
};

const _splitStr = (string, length) => {
  if (string.length <= length) {
    return [string + "b".repeat(length - string.length)];
  }
  return [string.slice(0, length), ..._splitStr(string.slice(length), length)];
};

const _fillZeros = (string, length) => {
  if (string.length >= length) {
    return string;
  }
  return "0".repeat(length - string.length) + string;
};

// console.log(number_char.indexOf('2'));
// console.log(_toString('62', 11));
// console.log(changeNumberBase('5a9b41', 12, 63));
// console.log(changeNumberBase('5T2N', 63, 12));
// console.log(_countLatterZeros(13500000));
// console.log(_splitStr("hello world!", 3));
// console.log(_fillZeros("300", 7));

// const test = (number_list, version = "v1") => {
//   const new_number_list = decodeToNumberList(
//     encodeNumberList(number_list, version),
//     version
//   );
//   const is_succeeded =
//     number_list.length == new_number_list.length
//       ? number_list.reduce(
//           (prev, current, idx) => prev && current == new_number_list[idx],
//           true
//         )
//       : false;
//   console.log(">> [test] --- " + (is_succeeded ? "SUCCESS" : "FAIL"));
//   console.log(number_list);
//   console.log("is encoded to");
//   console.log(encodeNumberList(number_list, version));
//   if (!is_succeeded) {
//     console.log("and decoded to");
//     console.log(new_number_list);
//     console.log("back.");
//   }
// };

// test([3, 4, 5]);
// test([0.035, 40000, 3679, 0.65]);
// test([2000, 0.65, 40000, 0.002, 5, 0.05, 0.8, 0.005, 0.15]);
// test([3, 4, 5], "v2");
