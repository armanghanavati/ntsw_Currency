import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { VerticalSpace } from ".";
import themeColors from "../configs/theme";
import { useRef } from "react";

const SerialNumberInput = ({
  title,
  value,
  onClick = () => {},
  onChange = () => {},
  required = false,
  error,
  type = "text",
  maxLength,
  labelWidth = "300px",
  minWidth = "135px",
  firstValidations,
  secondValidations,
  // space = "30px",
  backgroundColorLbale,
  index,
  readOnly,
  isCurrency = false,
  className = undefined,
  titleFontSize,
  TooltipTitle = null,
  customCodeRef = null,
  focusValue = "customCode",
  customCodeName = "customCode",
  cottageCodeName = "cottageCode",
  handleCottageCodeKeyDown = () => {},
}) => {
  const { theme } = useSelector((state) => state);

  const cottageCodeRef = useRef(null);

  const handleChange = (event) => {
    event?.preventDefault();
    const { value, name } = event.target;

    if (name === focusValue && value.length === 5) {
      cottageCodeRef.current.focus();
    }

    if (
      JSON.stringify(value).trim()?.length == 0 ||
      value == "" ||
      value === undefined ||
      value == null
    ) {
      onChange(
        name,
        undefined,
        name === customCodeName ? firstValidations : secondValidations,
        index
      );
    } else {
      onChange(
        name,
        value,
        name === customCodeName ? firstValidations : secondValidations,
        index
      );
    }
  };

  const formatInput = (e) => {
    const { name } = e.target;
    if (e.key === "Tab") {
      e.preventDefault();
      switch (name) {
        case "cottageCode":
          handleCottageCodeKeyDown(e);
          break;
        case "customCode":
          cottageCodeRef.current.focus();
          break;
        default:
      }
    }
    let checkIfNum;
    if (e.key !== undefined) {
      checkIfNum =
        e.key === "Enter" || e.key === "e" || e.key === "+" || e.key === "-";
    } else if (e.keyCode !== undefined) {
      checkIfNum =
        e.keyCode === 69 ||
        e.keyCode === 190 ||
        e.keyCode === 187 ||
        e.keyCode === 189;
    }
    return checkIfNum && e.preventDefault();
  };

  const formatInput2 = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  return (
    <>
      <span
        style={{
          // paddingLeft: space,
          color: themeColors[theme]?.inputText,
        }}
        className="input"
        onClick={onClick}
      >
        <span
          className={
            !!className && !!!error
              ? `input--main input--main--${className}`
              : error?.length === 0
              ? "input--main--valid"
              : error?.length > 0
              ? "input--main--error"
              : "input--main"
          }
        >
          <label
            className={
              !!className && !!!error
                ? `input--main--label input--main--label--${className}`
                : error?.length === 0
                ? "input--main--label--valid"
                : error?.length > 0
                ? "input--main--label--error"
                : "input--main--label"
            }
            style={{
              backgroundColor: backgroundColorLbale
                ? backgroundColorLbale
                : themeColors[theme]?.bg,
              width: labelWidth,
              minWidth: minWidth,
              height: "100%",
              maxWidth: 200,
              fontSize: titleFontSize,
            }}
          >
            {title}
            {TooltipTitle ? (
              <Tooltip title={TooltipTitle}>
                <span style={{ marginRight: "10px" }}>
                  <i className="fa fa-2x fa-question-circle guid-box--container__icon" />
                </span>
              </Tooltip>
            ) : (
              " "
            )}
            {required ? (
              <span className="input--main--label__required-sign">*</span>
            ) : (
              ""
            )}
          </label>
          <div className="serialnumber-input-conatiner" style={{ flexGrow: 1 }}>
            <input
              id={cottageCodeName}
              className="input--main--box"
              name={cottageCodeName}
              ref={cottageCodeRef}
              placeholder="123456"
              maxLength={maxLength}
              pattern={maxLength !== undefined && type === "number" ? "d*" : ""}
              value={value?.cottageCodeValue}
              type={maxLength && type === "number" ? "text" : type}
              style={{
                color: themeColors[theme]?.inputText,
                backgroundColor: themeColors[theme]?.inputBg,
                textAlign: "center",
                direction: type === "number" || isCurrency ? "ltr" : "rtl",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
                borderTopLeftRadius: "4px",
                borderBottomLeftRadius: "4px",
                border: "1px solid #DDD",
                flexGrow: 1,
              }}
              onChange={handleChange}
              readOnly={readOnly}
              onKeyDown={type === "number" ? formatInput : formatInput2}
            />
            <span
              style={{
                paddingInline: "4px",
              }}
            >
              {" - "}
            </span>
            <input
              id={customCodeName}
              className="input--main--box"
              name={customCodeName}
              placeholder="50100"
              maxLength={maxLength}
              pattern={maxLength !== undefined && type === "number" ? "d*" : ""}
              value={value?.customCodeValue}
              type={maxLength && type === "number" ? "text" : type}
              style={{
                color: themeColors[theme]?.inputText,
                backgroundColor: themeColors[theme]?.inputBg,
                textAlign: "center",
                direction: type === "number" || isCurrency ? "ltr" : "rtl",
                borderTopRightRadius: "4px",
                borderBottomRightRadius: "4px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                border: "1px solid #DDD",
                flexGrow: 1,
              }}
              onChange={handleChange}
              readOnly={readOnly}
              onKeyDown={type === "number" ? formatInput : formatInput2}
              ref={customCodeRef}
            />
          </div>
        </span>
      </span>
      <span className="flex-order-column">
        {error?.cottageCodeError &&
          error?.cottageCodeError.map((err, index) => (
            <span
              key={`cottageCode-errors-${index}`}
              className="input--error-message"
            >
              {err}
            </span>
          ))}
      </span>
      <span className="flex-order-column">
        {error?.customCodeError &&
          error?.customCodeError.map((err, index) => (
            <span
              key={`customCode-errors-${index}`}
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

export default SerialNumberInput;
