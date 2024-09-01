import { LoadingOutlined } from "@ant-design/icons";
import themeColors from "../configs/theme";
import VerticalSpace from "./VerticalSpace";

const Button = ({
  id,
  backgroundColor = themeColors.btn.primary,
  color = themeColors.btn.content,
  width = "fit-content",
  type = "primary",
  children,
  loading = false,
  name,
  margin = "0 0 0 10px",
  borderRadius,
  hasVerticalSpace = true,
  onClick = () => {},
  disabled,
  className = undefined,

  ...others
}) => {
  return (
    <>
      <button
    
        className={
          type === "primary"
            ? `btn ${className}`
            : `btn btn-secondary ${className}`
        }
        style={{
          backgroundColor: backgroundColor,
          border: `1px solid ${backgroundColor}`,
          cursor: disabled ? "not-allowed" : "pointer",
          color:
            backgroundColor === themeColors.btn.content
              ? themeColors.btn.black
              : color,
          width,
          opacity: disabled ? "0.5" : "1",
          margin: type === "primary" ? margin : "0 5px 0 5px",
          borderRadius,
        }}
        {...others}
        onClick={
          loading || disabled ? (event) => event.preventDefault() : onClick
        }
        id={name || id}
      >
        {loading ? (
          <LoadingOutlined
            style={{
              fontSize: 24,
              color: "white",
            }}
            spin
          />
        ) : (
          children
        )}
      </button>
      {hasVerticalSpace && type === "primary" && <VerticalSpace space="10px" />}
    </>
  );
};
export default Button;
