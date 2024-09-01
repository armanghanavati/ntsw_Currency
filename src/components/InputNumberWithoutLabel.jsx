import { InputNumber } from "antd";

const InputNumberWithoutLabel = ({
  defaultValue,
  value,
  placeholder,
  onChange = () => {},
  size = "small",
  isCurrency,
  id,
  onBlur = () => {},
  disabled,
  controls = false,
  className = "",
}) => {
  return (
    <>
      {isCurrency ? (
        <InputNumber
          id={id}
          size={size}
          placeholder={placeholder}
          controls={controls}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onKeyPress={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          onBlur={onBlur}
          disabled={disabled}
          stringMode={true}
        />
      ) : (
        <InputNumber
          className={className}
          size={size}
          placeholder={placeholder}
          controls={false}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          id={id}
          onBlur={onBlur}
          disabled={disabled}
          stringMode={true}
        />
      )}
    </>
  );
};

export default InputNumberWithoutLabel;
