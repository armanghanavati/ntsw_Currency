import React from "react";
import { Tooltip as Tooltiper } from "antd";

const Tooltip = ({ title, color = "#f4b400" }) => {
  return (
    <div>
      <Tooltiper title={title}>
        <span>
          <div className="tooltip-custom">
            <i
              className="fa fa-2x fa-question-circle no-margin success"
              style={{ fontSize: "20px", color: color }}
            />
            <div className="tooltip-animation" />
          </div>
        </span>
      </Tooltiper>
    </div>
  );
};

export default Tooltip;
