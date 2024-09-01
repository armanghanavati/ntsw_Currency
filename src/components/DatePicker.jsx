import { useSelector } from "react-redux";
import themeColors from "../configs/theme";
import VerticalSpace from "./VerticalSpace";
import moment from "jalali-moment";
import { useMemo, useState } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import MultiDatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/teal.css";

const Datepicker = ({
  title,
  onChange = () => {},
  required = false,
  error = "",
  value,
  defaultValue,
  name,
  validations = [],
  minimumDate,
  maximumDate,
  locale = "fa",
  className,
  labelWidth = "300px",
  diabeld,
  hasVerticalSpace = true,
}) => {
  const { theme } = useSelector((state) => state);
  const [showRemoveButton, setShowRemoveButton] = useState(false);

  const maxDate = useMemo(() => {
    return !!maximumDate
      ? moment
          .from(maximumDate, "YYYY/MM/DD")
          .subtract(1, "day")
          .format("jYYYY/jMM/jDD")
      : undefined;
  }, [maximumDate]);

  const minDate = useMemo(() => {
    return !!minimumDate
      ? moment
          .from(minimumDate, "YYYY/MM/DD")
          .add(1, "day")
          .format("jYYYY/jMM/jDD")
      : undefined;
  }, [minimumDate]);

  const handleOnChange = (date) => {
    if (!!date) {
      const newDate = !!date
        ? `${date?.year}/${date?.monthIndex + 1}/${date?.day}`
        : undefined;
      const maxDiff = moment(newDate).diff(
        locale === "fa"
          ? moment.from(maximumDate, "YYYY/MM/DD").format("jYYYY/jMM/jDD")
          : maximumDate,
        "days"
      );
      const minDiff = moment(newDate).diff(
        locale === "fa"
          ? moment.from(minimumDate, "YYYY/MM/DD").format("jYYYY/jMM/jDD")
          : minimumDate,
        "days"
      );
      if ((!maximumDate || maxDiff < 0) && (!minimumDate || minDiff > 0)) {
        onChange(
          name,
          { year: date?.year, month: date?.monthIndex + 1, day: date?.day },
          [...validations, ["minimumDate", { year: 1000, day: 1, month: 1 }]]
        );
      } else {
        onChange(name, undefined, [["dateRange"], ...validations]);
      }
    } else {
      onChange(name, undefined, validations);
    }
  };
  const dateFormatList = ["YYYY/MM/DD", "YY/MM/DD", "YYYY-MM-DD", "YY-MM-DD"];

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
            {title}
            {required ? (
              <span className="input--main--label__required-sign">*</span>
            ) : (
              ""
            )}
          </label>
          <span
            className="date-picker"
            onMouseEnter={() => setShowRemoveButton(true)}
            onMouseLeave={() => setShowRemoveButton(false)}
            onClick={() => setShowRemoveButton(false)}
          >
            {locale === "fa" ? (
              <div style={{ direction: locale === "fa" ? "rtl" : "ltr" }}>
                <MultiDatePicker
                  className={`${theme === "dark" ? "bg-dark" : undefined} teal`}
                  value={
                    !!value
                      ? `${value?.year}/${value?.month}/${value?.day}`
                      : !!defaultValue
                      ? `${defaultValue?.year}/${defaultValue?.month}/${defaultValue?.day}`
                      : undefined
                  }
                  onOpenPickNewDate={false}
                  onChange={handleOnChange}
                  format={dateFormatList[0]}
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-left"
                  monthYearSeparator={" "}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            ) : (
              <div style={{ direction: "ltr" }}>
                <MultiDatePicker
                  className={`${theme === "dark" ? "bg-dark" : undefined} teal`}
                  value={
                    !!value
                      ? `${value?.year}/${value?.month}/${value?.day}`
                      : !!defaultValue
                      ? `${defaultValue?.year}/${defaultValue?.month}/${defaultValue?.day}`
                      : undefined
                  }
                  onOpenPickNewDate={false}
                  onChange={handleOnChange}
                  format={dateFormatList[0]}
                  calendarPosition="bottom-right"
                  monthYearSeparator={" "}
                  minDate={
                    !!minimumDate
                      ? new Date(
                          moment
                            .from(minimumDate, "YYYY/MM/DD")
                            .format("YYYY/MM/DD")
                        )
                      : undefined
                  }
                  maxDate={
                    !!maximumDate
                      ? new Date(
                          moment
                            .from(maximumDate, "YYYY/MM/DD")
                            .subtract(1, "day")
                            .format("YYYY/MM/DD")
                        )
                      : undefined
                  }
                />
              </div>
            )}
            {(value || defaultValue) && showRemoveButton && (
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
      <span className="flex-order-column">
        {!!error && Array.isArray(error) ? (
          error?.map((err, index) => (
            <span
              key={`${name}-errors-${index}`}
              className="input--error-message"
            >
              {err}
            </span>
          ))
        ) : !!error ? (
          <>
            <span className="input--error-message">{error}</span>
            <VerticalSpace space="5px" />
          </>
        ) : (
          <></>
        )}
      </span>
      {hasVerticalSpace && <VerticalSpace space="10px" />}
    </>
  );
};
export { Datepicker };
