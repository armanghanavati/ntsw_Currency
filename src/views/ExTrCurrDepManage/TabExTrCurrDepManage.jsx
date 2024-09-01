import { Tabs } from "antd";
import React from "react";
import ExTrCurrDepManage from "./ExTrCurrDepManage ";

const TabExTrCurrDepManage = () => {
  const tab = [{ title: "کارتابل سپرده", component: <ExTrCurrDepManage /> }];

  return (
    <div>
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

export default TabExTrCurrDepManage;