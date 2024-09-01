import { useState } from "react";

import { Tabs } from "../../../components";
import themeColors from "../../../configs/theme";
import RealRialsToIraqAndAfghanistan from "../Tabs/realRialsToIraqAndAfghanistan";
import RialExportsToOtherCountries from "../Tabs/RialExportsToOtherCountries";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { EmergencyProblem } from "../../../components";

function ExternalTradeRialExportExpressPage() {
  // stats----------------------------
  const tab = [
    {
      title: " صادرات ریالی به عراق و افغانستان",
      component: <RealRialsToIraqAndAfghanistan />,
    },
    {
      title: " صادرات ریالی به سایر کشورها",
      component: <RialExportsToOtherCountries />,
    },
  ];

  // useeffect for get data tabel-------------------------------------------

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
      <EmergencyProblem title="نیما" />
    </div>
  );
}
export default ExternalTradeRialExportExpressPage;
