import React from "react";
import { Tabs } from "../../../../components";
import Trades from "./trades";
import Supplies from "./supplies";

const ExternalTradeCESellManage = () => {
  const tab = [
    { title: "معاملات", component: <Trades /> },
    { title: "عرضه ها", component: <Supplies /> },
  ];

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
export default ExternalTradeCESellManage;
