import React from "react";
import { Tabs } from "../../../../components";

const Tab = ({ title, component, style }) => {
  const tab = [
    { title: title, component: component },
    { title: title, component: component },
    { title: title, component: component },
  ];

  return (
    <div style={style}>
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

export default Tab;
