import { Tooltip } from "antd";
import modes from "../../../enums/modes";
import { VerticalSpace } from "../../../components";

const Guide = ({ headerTitle, tooltipTitle, mode, iconPosition = "top" ,isRequired}) => {
  return (
    <>
      <span className="flex-order-column-justify-center goods--title">
        {iconPosition === "top" && mode !== modes.Show && (
          <Tooltip title={tooltipTitle}>
            <span>
              <div className="tooltip-custom--without-border">
                <i
                  className="fa fa-2x fa-question-circle no-margin "
                  style={{ fontSize: "1.5em" }}
                />
                <div className="tooltip-animation--light" />
              </div>
            </span>
          </Tooltip>
        )}
        <span>
          {isRequired && mode !== modes.Show&&<span className="text-red" style={{padding:'0 0 0 3px'}}>*</span>}
          {headerTitle}
        </span>
        {iconPosition === "down" && mode !== modes.Show && (
          <>
            <VerticalSpace space="10px" />
            <Tooltip title={tooltipTitle}>
              <span>
                <div className="tooltip-custom--without-border">
                  <i
                    className="fa fa-2x fa-question-circle no-margin "
                    style={{ fontSize: "1.5em" }}
                  />
                  <div className="tooltip-animation--light" />
                </div>
              </span>
            </Tooltip>
          </>
        )}
      </span>
    </>
  );
};

export default Guide;
