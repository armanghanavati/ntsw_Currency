import { useSelector } from "react-redux";
import themeColors from "../configs/theme";
import VerticalSpace from "./VerticalSpace";
import moment from "jalali-moment";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import MultiDatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useState } from "react";

const DatePickerWithTime = ({
  title,
  onChange = () => {},
  required = false,
  error = "",
  value,
  name,
  defaultValue,
  validations = [],
  minimumDate,
  maximumDate,
  locale = "fa",
  className,
  labelWidth = "300px",
  diabeld = false,
}) => {
  const { theme } = useSelector((state) => state);
  const [showRemoveButton, setShowRemoveButton] = useState(false);

  const handleOnChange = (date) => {
    if (!!date) {
      onChange(
        name,
        {
          year: date?.year,
          month: date?.monthIndex + 1,
          day: date?.day,
          hour: date?.hour,
          minute: date?.minute,
        },
        [...validations, ["minimumDate", { year: 1000, day: 1, month: 1 }]]
      );
    } else {
      onChange(name, date, validations);
    }
  };

  return (
    <>
      <span
        style={{
          color: themeColors[theme]?.inputText,
        }}
        className="input"
      >
        <span
          className={
            !!diabeld
              ? "input--main disabeld"
              : !!className
              ? `input--main--${className}`
              : error.length === 0
              ? "input--main"
              : "input--main--error"
          }
        >
          <label
            className={
              !!className
                ? `input--main--label--${className}`
                : error.length === 0
                ? "input--main--label"
                : "input--main--label--error"
            }
            style={{
              backgroundColor: themeColors[theme]?.bg,
              width: !!labelWidth ? labelWidth : "fit-content",
            }}
          >
            {required ? (
              <span className="input--main--label__required-sign">*</span>
            ) : (
              ""
            )}
            {title}
          </label>
          <span
            className="date-picker"
            onMouseEnter={() => setShowRemoveButton(true)}
            onMouseLeave={() => setShowRemoveButton(false)}
            onClick={() => setShowRemoveButton(false)}
          >
            <div style={{ direction: "rtl" }}>
              <MultiDatePicker
                className={`${theme === "dark" ? "bg-dark" : undefined} teal`}
                value={
                  !!value
                    ? `${value?.year}/${value?.month}/${value?.day} ${value?.hour}:${value?.minute}`
                    : !!defaultValue
                    ? `${defaultValue?.year}/${defaultValue?.month}/${defaultValue?.day} ${defaultValue?.hour}:${defaultValue?.minute}`
                    : undefined
                }
                plugins={[<TimePicker position="bottom" hideSeconds />]}
                onOpenPickNewDate={false}
                onChange={handleOnChange}
                format={"YYYY/MM/DD HH:mm"}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-left"
                monthYearSeparator={" "}
                minDate={
                  !!minimumDate
                    ? moment
                        .from(minimumDate, "YYYY/MM/DD")
                        .format("jYYYY/jMM/jDD")
                    : undefined
                }
                maxDate={
                  !!maximumDate
                    ? moment
                        .from(maximumDate, "YYYY/MM/DD")
                        .subtract(1, "day")
                        .format("jYYYY/jMM/jDD")
                    : undefined
                }
              />
            </div>
            {value && showRemoveButton && (
              <span
                className="date-picker--remove-icon"
                onClick={() => handleOnChange(undefined)}
              >
                <i className="fa fa-times-circle " aria-hidden="true"></i>
              </span>
            )}
          </span>
        </span>
      </span>
      {error && (
        <>
          <span className="input--error-message">{error}</span>
          <VerticalSpace space="5px" />
        </>
      )}
      <VerticalSpace space="10px" />
    </>
  );
};
export { DatePickerWithTime };
