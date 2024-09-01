import React from "react";
import { Tabs } from "../../../../components";
import HandoverFolder from "./handover-folder";
import ClearingCratable from "./clearing-cartable";
import MyAds from "./my-ads";

const ExternalTradeExportLicenseAssignment = () => {
  const tab = [
    { title: "کارتابل واگذاری", component: <HandoverFolder /> },
    { title: "کارتابل تهاتر", component: <ClearingCratable /> },
    { title: "آگهی های من", component: <MyAds /> },
  ];

  return (
    <div style={{ marginTop: "45px" }}>
      <Tabs
        type="card"
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
};

export default ExternalTradeExportLicenseAssignment;
