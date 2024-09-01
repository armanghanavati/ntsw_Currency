import { LoadingOutlined } from "@ant-design/icons";
import themeColors from "../configs/theme";
import VerticalSpace from "./VerticalSpace";
import { forwardRef } from "react";

export const ButtonWithRef = forwardRef(
  (
    {
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
    },
    ref
  ) => {
    return (
      <>
        <button
          ref={ref}
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
            width: width,
            opacity: disabled ? "0.5" : "1",
            margin: type === "primary" ? margin : "0 5px 0 5px",
            borderRadius: borderRadius,
          }}
          onClick={
            loading || disabled ? (event) => event.preventDefault() : onClick
          }
          id={name}
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
        {hasVerticalSpace && type === "primary" && (
          <VerticalSpace space="10px" />
        )}
      </>
    );
  }
);
