import { Tabs } from "../../../components";
import { useState } from "react";
import themeColors from "../../../configs/theme";
import { useSelector } from "react-redux";
import ReturnOfExportCurrency from "../tabs/ReturnOfExportCurrency";

function ExternalTradeMoshahedeEtelaatArziPage() {
  const { theme, colorMode, role, GUid } = useSelector((state) => state);

  return (
    <div>
      <Tabs
        style={{ color: themeColors[theme]?.text }}
        type="card"
        defaultActiveKey="tab1"
        items={[
          {
            label: "بازگشت ارز حاصل از صادرات",
            key: "1",
            children: <ReturnOfExportCurrency />,
          },
          {
            label: " تخصیص ارز",
            key: "2",

            disabled: true,
          },
          {
            label: " تامین ارز",
            key: "3",

            disabled: true,
          },
          {
            label: "  ابزار پرداخت",
            key: "4",

            disabled: true,
          },
          {
            label: "  تعهدات ارزی (واردات)",
            key: "5",

            disabled: true,
          },
          {
            label: " رسیدهای سنا",
            key: "6",

            disabled: true,
          },
          {
            label: " رفع تعهد",
            key: "7",

            disabled: true,
          },
        ]}
      />
    </div>
  );
}
export default ExternalTradeMoshahedeEtelaatArziPage;
