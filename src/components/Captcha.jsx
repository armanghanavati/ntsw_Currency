import React, { useEffect } from "react";
import persianJs from "persianjs";
import Validation from "../utils/Validation";

const Captcha = ({
  inputsData,
  setInputsData,
  errors,
  setErrors,
  style,
  num1,
  num2,
  randomAttribution,
  handleReset,
}) => {
  const handleChange = (e, validationNameList = [["required"]]) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](e.target.value) === true) {
        } else {
          temp.push(Validation[item[0]](e.target.value));
        }
      });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        answer: [...temp],
      };
    });

    setInputsData((prevstate) => {
      return {
        ...prevstate,
        answer: e.target.value,
      };
    });
  };

  let operators = {
    "+": function (num1, num2) {
      return num1 + num2;
    },
    "-": function (num1, num2) {
      return num1 - num2;
    },
    "/": function (num1, num2) {
      return num1 / num2;
    },
    "*": function (num1, num2) {
      return num1 * num2;
    },
  };

  let numArray = [num1, num2];
  numArray.sort(function (a, b) {
    return a - b;
  });

  let singleDigitMax = numArray[1].toString().split("");
  let singleDigitMin = numArray[0].toString().split("");

  let comparison =
    (numArray[0].toString().length === 2 ||
      numArray[1].toString().length === 2) &&
    (randomAttribution === "/" || randomAttribution === "*");

  let sum = operators[randomAttribution](
    comparison ? singleDigitMax[1] : numArray[1],
    comparison
      ? singleDigitMax[0]
      : numArray[0].toString().length === 2 && randomAttribution === "-"
      ? singleDigitMin[0]
      : numArray[0]
  );

  useEffect(() => {
    if (parseInt(inputsData?.answer) === sum) {
      setErrors((prevstate) => {
        return {
          ...prevstate,
          answer: [],
        };
      });
    } else if (inputsData?.answer !== undefined && inputsData?.answer !== "") {
      setErrors((prevstate) => {
        return {
          ...prevstate,
          answer: ["پاسخ اشتباه است!"],
        };
      });
    }
  }, [inputsData?.answer]);

  return (
    <div style={style}>
      <div className="wrapper-captcha">
        <div className="wrapper-answer">
          <div className="parent-answer">
            <span
              onClick={handleReset}
              id="refreshSpan"
              className="reset-captcha"
              style={{
                borderRight: `${
                  errors && errors?.answer && errors?.answer.length === 1
                    ? "1px solid #ff4630"
                    : errors && errors?.answer && errors?.answer.length === 0
                    ? "1px solid #39bc00"
                    : "1px solid #ccc"
                }`,
                borderTop: `${
                  errors && errors?.answer && errors?.answer.length === 1
                    ? "1px solid #ff4630"
                    : errors && errors?.answer && errors?.answer.length === 0
                    ? "1px solid #39bc00"
                    : "1px solid #ccc"
                }`,
                borderBottom: `${
                  errors && errors?.answer && errors?.answer.length === 1
                    ? "1px solid #ff4630"
                    : errors && errors?.answer && errors?.answer.length === 0
                    ? "1px solid #39bc00"
                    : "1px solid #ccc"
                }`,
              }}
            >
              <div>
                <i className="fa fa-refresh" />
              </div>
            </span>
            <input
              style={{
                width: "90%",
                height: "100%",
                paddingRight: "10px",
                border: `${
                  errors && errors?.answer && errors?.answer.length === 1
                    ? "1px solid #ff4630"
                    : errors && errors?.answer && errors?.answer.length === 0
                    ? "1px solid #39bc00"
                    : "1px solid #ccc"
                }`,
                outline: "none",
              }}
              className="input--main--box"
              placeholder="حاصل عبارت درون تصویر"
              maxLength={8}
              type="text"
              value={inputsData?.answer}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <span className="wrapper-show-question-cpt">
          <span className="parent-random-attribution" />
          <p className="captcha-question">
            {comparison
              ? persianJs(singleDigitMax[1]).digitsToWords()._str
              : persianJs(numArray[1]).digitsToWords()._str}
            {randomAttribution === "-"
              ? " منهای "
              : randomAttribution === "+"
              ? " به علاوه "
              : randomAttribution === "/"
              ? " تقسیم بر "
              : randomAttribution === "*"
              ? " ضرب در "
              : null}
            {comparison
              ? // ? persianJs(singleDigitMax[0]).digitsToWords()._str
                // : numArray[0].toString().length === 2 && randomAttribution === "-"
                //   ? persianJs(singleDigitMin[0]).digitsToWords()._str
                //   : persianJs(numArray[0]).digitsToWords()._str}
                persianJs(singleDigitMax[0]).digitsToWords()._str
              : numArray[0].toString().length === 2 && randomAttribution === "-"
              ? persianJs(singleDigitMin[0]).digitsToWords()._str
              : numArray[1] > numArray[0] && randomAttribution === "/"
              ? persianJs(numArray[1]).digitsToWords()._str
              : persianJs(numArray[0]).digitsToWords()._str}
          </p>
        </span>
      </div>
      <p
        style={{
          color: "#ff4630",
          fontSize: "10px",
          marginTop: "5px",
          textAlign: "start",
        }}
      >
        {errors && errors?.answer && errors?.answer[0] === "پاسخ صحیح است!"
          ? ""
          : errors && errors?.answer}
      </p>
    </div>
  );
};

export default Captcha;
