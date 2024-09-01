import { InputNumber, Tooltip } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { VerticalSpace } from ".";
import themeColors from "../configs/theme";

const Input = ({
  title,
  value = "",
  name = "",
  onClick = () => {},
  onChange = () => {},
  required = false,
  error,
  type = "text",
  maxLength,
  placeholder,
  labelWidth = "300px",
  validations,
  index,
  readOnly,
  isCurrency = false,
  className = undefined,
  borderRadius,
  onBlur = () => {},
  titleFontSize,
  TooltipTitle = null,
  minWidth,
  maxWidth,
  height,
  centerText = false,
  align = "center",
}) => {
  const { theme } = useSelector((state) => state);
  const [passwordShown, setPasswordShown] = useState(false);

  const handleChange = (event) => {
    event?.preventDefault();
    const { value } = event.target;
    if (
      String(value).trim()?.length == 0 ||
      value == "" ||
      value === undefined ||
      value == null
    ) {
      onChange(name, undefined, validations, index);
    } else {
      onChange(name, value, validations, index);
    }
    // if (!!className && (error?.length === 0 || !!!error)) {
    //   setNewClassName("orange");
    // }
  };

  const handleChangeForCurrencyFormat = (value) => {
    if (value == 0) {
      onChange(name, 0, validations, index);
    } else if (
      String(value).trim()?.length == 0 ||
      value == "" ||
      value === undefined ||
      value == null
    ) {
      onChange(name, undefined, validations, index);
    } else {
      onChange(name, value, validations, index);
    }
  };

  const formatNumberInput = (e) => {
    let checkIfNum;
    let checkDot;
    // if (e.key !== undefined) {
    //   checkIfNum = e.key === "Enter" || e.key === "e" || e.key === "+" || e.key === "-" || e.keyCode === 69 ||
    //     (maxLength !== undefined &&
    //       type === "number" &&
    //       JSON.stringify(value)?.length - 2 === Number(maxLength) &&
    //       e.key !== "Backspace");
    //   // checkDot = e.key === "."
    // }
    if (e.key === ".") {
      const test = e.target.value;
      const getDot = test.split(".");
      console.log(test);
      // e.preventDefault()
    }
    // return checkDot && e.preventDefault()
  };
  const formatInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  let direction = false;
  const handelValue = (value) => {
    // const tempDirection = /[a-zA-Z0-9!@#\$%\^\&*\)/\(+=._-\s]/?.test(value)
    const tempDirection = /\s*[a-zA-Z0-9!@#\$%\^\&*/\)\(+=._-]\s*$/?.test(
      value
    );
    direction = tempDirection;
    return value;
  };

  return (
    <>
      <span
        style={{
          color: themeColors[theme]?.inputText,
        }}
        className="input"
        onClick={onClick}
      >
        <span
          className={
            className?`input--main--${className}`: error?.length === 0 && !!validations
              ? "input--main--valid"
              : error?.length > 0
              ? "input--main--error"
              : "input--main"
          }
        >
          <label
            className={
              className?`input--main--label--${className}`: error?.length === 0 && !!validations
                ? "input--main--label--valid"
                : error?.length > 0
                ? "input--main--label--error"
                : "input--main--label"
            }
            style={{
              backgroundColor: themeColors[theme]?.bg,
              width: labelWidth,
              minWidth: minWidth,
              fontSize: titleFontSize,
              maxWidth: maxWidth,
              height: "100%",
            }}
          >
            {required ? (
              <span className="input--main--label__required-sign">*</span>
            ) : (
              ""
            )}
            {title}
            {TooltipTitle ? (
              <Tooltip title={TooltipTitle}>
                <span style={{ marginRight: "10px", cursor: "pointer" }}>
                  <i className="fa fa-2x fa-question-circle guid-box--container__icon" />
                </span>
              </Tooltip>
            ) : (
              " "
            )}
          </label>
          {type === "textarea" ? (
            <textarea
              className="input--main--box"
              name={name}
              maxLength={maxLength}
              placeholder={placeholder}
              value={value}
              title={value}
              type={type}
              style={{
                color: themeColors[theme]?.inputText,
                backgroundColor: themeColors[theme]?.inputBg,
                padding: "4px",
                height: "100%",
              }}
              onChange={handleChange}
              readOnly={readOnly}
              onKeyDown={type === "number" ? formatNumberInput : formatInput}
            />
          ) : isCurrency ? (
            <InputNumber
              className="input--main--box--currency-mode"
              value={value}
              readOnly={readOnly}
              disabled={readOnly === "readOnly" ? true : false}
              formatter={(value) => {
                let parts = value.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                const newValue = parts.join(".");
                return newValue;
              }}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={handleChangeForCurrencyFormat}
              onKeyDown={formatNumberInput}
              controls={false}
              placeholder={placeholder}
              onBlur={onBlur}
              stringMode={true}
            />
          ) : (
            <>
              {type === "password" && (
                <i
                  className={passwordShown ? ` fa fa-eye` : `fa fa-eye-slash`}
                  onClick={() => setPasswordShown(!passwordShown)}
                  style={{
                    marginRight: "5px",
                    cursor: "pointer",
                    backgroundColor:
                      theme === "dark" ? "rgb(30, 31, 33)" : "#fff",
                  }}
                />
              )}
              <input
                id={name}
                placeholder={placeholder}
                className="input--main--box"
                name={name}
                maxLength={maxLength}
                pattern={
                  maxLength !== undefined && type === "number"
                    ? // ? "/^-?d+.?d*$/"
                      /[^0-9]/g
                    : // "/^-?d+.?d*$/"
                      undefined
                }
                value={handelValue(value)}
                title={value}
                // type={(maxLength && type === 'number') ? 'text' : type}
                type={passwordShown ? "text" : type}
                style={{
                  color: themeColors[theme]?.inputText,
                  backgroundColor: themeColors[theme]?.inputBg,
                  textAlign: centerText
                    ? align
                    : type === "number" || isCurrency || direction
                    ? "left"
                    : "right",
                  direction:
                    type === "number" || isCurrency || direction
                      ? "ltr"
                      : "rtl",
                      height:height?height:""
                }}
                onChange={handleChange}
                readOnly={readOnly}
                onKeyDown={type === "number" ? formatNumberInput : formatInput}
              />
            </>
          )}
        </span>
      </span>
      <span className="flex-order-column">
        {error &&
          error.map((err, index) => (
            <span
              key={`${name}-errors-${index}`}
              className="input--error-message"
            >
              {err}
            </span>
          ))}
      </span>
      <VerticalSpace space="10px" />
    </>
  );
};
export default Input;
