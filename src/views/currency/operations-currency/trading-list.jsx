import React from "react";
import { Button } from "../../../components";
import themeColors from "../../../configs/theme";

const TradingList = ({ title }) => {
  return (
    <div className="parentShopping">
      <span style={{ color: "#981b48" }}>{title}</span>
      <div className="wrapperBtn">
        <Button backgroundColor={themeColors.btn.secondary}>
          <i class="fa fa-download" />
          خروجی اکسل
        </Button>
      </div>
    </div>
  );
};

export default TradingList;
