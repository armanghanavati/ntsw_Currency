import React from "react";
import { ExcelExportButton } from "../../../common";
import themeColors from "../../../configs/theme";

const TradingList = ({
  title,
  children,
  hideBtn = false,
  getData,
  loading,
}) => {
  return (
    <div className="parentShopping">
      <span style={{ color: "#981b48" }}>{title}</span>
      <div className="wrapperBtn">
        {hideBtn === false && (
          <ExcelExportButton
            backgroundColor={themeColors.btn.primary}
            getData={getData}
            icon="fa fa-download"
            loading={loading}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default TradingList;
