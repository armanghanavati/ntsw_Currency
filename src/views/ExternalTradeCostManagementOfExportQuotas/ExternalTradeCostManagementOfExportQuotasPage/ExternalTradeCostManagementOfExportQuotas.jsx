import { Tabs } from "../../../components";
import { useState } from "react";
import themeColors from "../../../configs/theme";
import ExternalTradeCostManagementOfExportQuotasInquiery from "../tabs/ExternalTradeCostManagementOfExportQuotasInquiery";
import ExternalTradeCostManagementOfExportQuotasRecord from "../tabs/ExternalTradeCostManagementOfExportQuotasRecord";
import { useSelector } from "react-redux";

export default function ExternalTradeCostManagementOfExportQuotas() {
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [tab, setTab] = useState([
    {
      title: "استعلام ",
      component: <ExternalTradeCostManagementOfExportQuotasInquiery />,
    },
    {
      title: " ثبت",
      component: <ExternalTradeCostManagementOfExportQuotasRecord />,
    },
  ]);
  return (
    <div>
      <Tabs
        className="containerRialArzi"
        style={{ color: themeColors[theme]?.text }}
        type="card"
        defaultActiveKey="tab1"
        items={tab.map((item, i) => {
          return {
            label: item.title,
            key: `tab${i}`,
            children: item.component,
          };
        })}
      />
    </div>
  );
}
