import { Select } from "antd";
import { useSelector } from "react-redux";
import themeColors from "./../configs/theme.js";
import VerticalSpace from "./VerticalSpace.jsx";
import { useEffect } from "react";

const ComboBox = ({
  name = "",
  preventDefaultSelect = true,
  defaultValue,
  onChange = () => {},
  options = [],
  error = [],
  title = "",
  optionTitle = "name",
  optionValue = "id",
  disabled = false,
  validations = [],
  index,
  width = "300px",
  borderRadius,
  className,
  onBlur,
  maxWidth,
  placeholder = "",
  minWidth,
  required = false,
  loading = false,
}) => {
  const { theme } = useSelector((state) => state);

  const handleChange = (value) => {
    onChange(name, value, validations || undefined, index);
  };

  const { Option } = Select;

  useEffect(() => {
    if (preventDefaultSelect) {
      if (!!options && Array.isArray(options) && options.length === 1)
        onChange(
          name,
          options[0][optionValue],
          validations || undefined,
          index
        );
    }
  }, [options]);

  return (
    <>
      <span
        style={{
          color: themeColors[theme]?.inputText,
        }}
        className={
          !!className && error.length === 0 ? `input ${className}` : "input"
        }
      >
        <label
          className={
            !!className && error.length === 0
              ? `input--main--label input--main--label--${className} combobox--label`
              : error.length === 0
              ? "input--main--label combobox--label"
              : "input--main--label--error combobox--label"
          }
          style={{
            backgroundColor: themeColors[theme]?.bg,
            color: themeColors[theme]?.inputText,
            height: "35px",
            width: width,
            maxWidth: maxWidth,
          }}
          htmlFor={`${name}`}
        >
          {required ? (
            <span className="input--main--label__required-sign">*</span>
          ) : (
            ""
          )}
          {title}
        </label>
        <Select
          placeholder={placeholder}
          className={
            !!className && error.length === 0
              ? `get-roles--selector--${className} get-roles--selector`
              : error.length === 0
              ? "get-roles--selector"
              : "get-roles--selector--error get-roles--selector"
          }
          name={name}
          id={name}
          showSearch
          optionFilterProp="children"
          onChange={handleChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          dropdownMatchSelectWidth={false}
          style={{
            color: themeColors[theme]?.inputText,
            backgroundColor: themeColors[theme]?.inputBg,
            borderRadius: borderRadius,
            minWidth: minWidth,
          }}
          value={
            preventDefaultSelect &&
            Array.isArray(options) &&
            options?.length === 1
              ? options[0][optionValue]
              : defaultValue
          }
          loading={loading}
          notFoundContent="موجود نیست."
          allowClear
          disabled={disabled}
          dropdownStyle={{
            color: themeColors[theme]?.inputText,
            backgroundColor: themeColors[theme]?.inputBg,
          }}
          onSelect={onBlur}
        >
          {Array.isArray(options) || JSON.stringify(options).startsWith("[")
            ? options?.map((item, index) => (
                <Option
                  style={{
                    color: themeColors[theme]?.inputText,
                    backgroundColor: themeColors[theme]?.inputBg,
                  }}
                  id={`${name}-${index}-${item[optionValue]}`}
                  key={`${name}-${index}-${item[optionValue]}`}
                  value={item[optionValue]}
                >
                  {item[optionTitle]}
                </Option>
              ))
            : undefined}
        </Select>
      </span>
      {!!error &&
        error.map((err, index) => (
          <span
            key={`${name}-errors-${index}`}
            className="input--error-message"
          >
            {err}
          </span>
        ))}
      <VerticalSpace space={error && error.length > 0 ? "20px" : "10px"} />
    </>
  );
};
export default ComboBox;
