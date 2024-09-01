import { Tooltip } from "antd";
import VerticalSpace from "./VerticalSpace";

const GuideBox = ({ GuidedComponent, tooltipTitle, error, style }) => {
  return (
    <>
      <span className="guid-box" style={style}>
        {GuidedComponent}
        <Tooltip title={tooltipTitle}>
          <span className="guid-box--container">
            <i className="fa fa-2x fa-question-circle guid-box--container__icon" />
            <span className="tooltip-animation" />
          </span>
        </Tooltip>
      </span>
      <span className="flex-order-column guide-errors">
        {error &&
          error.map((err, index) => (
            <span
              key={`guide-errors-${index}`}
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

export default GuideBox;
