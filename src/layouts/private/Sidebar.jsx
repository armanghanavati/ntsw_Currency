import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { endpoints } from "../../services/endpoints";
import { useSelector, useDispatch } from "react-redux";
import {
  handleLoading,
  handleIsCertificateRequiredList,
} from "../../state/action-creators";
import axios from "axios";
import { Layout } from "antd";
import SubMenu from "./SubMenu";
import themeColors from "../../configs/theme.js";
import { memo } from "react";

const { Sider } = Layout;

const Sidebar = ({ children }) => {
  const { sidebar, theme, alternativeToken } = useSelector((state) => state);
  // بعد از درآوردن لیست اکشن پرنت کد های صفحه ای که کاربر در حال حاضر داخل ان است، این استیت ترو میشود
  const [
    isDoneSearchForCurrentPathParent,
    setIsDoneSearchForCurrentPathParent,
  ] = useState(false);
  const [userMenuLevel1, setUserMenuLevel1] = useState([]);
  const [userMenuLevel2, setUserMenuLevel2] = useState([]);

  // برای سبز شدن بولت کنار ساب منو
  // لیست اکشن پرنت کدهای مربوط به منویی که کاربر الان داخل ان است
  const [
    actionCodesListForCurrentPathParent,
    setActionCodesListForCurrentPathParent,
  ] = useState([]);

  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const getUserAccessList = () => {
    const postData = {
      token: alternativeToken,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.user.getUserAccessList.url,
      method: endpoints.RestAPIs.user.getUserAccessList.method,
      data: postData,
    })
      .then((res) => {
        handleFindeParentActionCodes(res?.data?.Result);
        setUserMenuLevel1(
          res?.data?.Result?.filter(
            (x) => x.parentActionCode === 0 && x.isMenuItem === true
          ).sort((a, b) => parseFloat(a.priority) - parseFloat(b.priority))
        );
        setUserMenuLevel2(
          res?.data?.Result?.filter(
            (x) => x.parentActionCode !== 0 && x.isMenuItem === true
          ).sort((a, b) => parseFloat(a.priority) - parseFloat(b.priority))
        );
        dispatch(handleLoading(false));
        const temp = [];
        res.data.Result.map(
          (item) => item.isCertificateRequired && temp.push(item.actionCode)
        );
        dispatch(handleIsCertificateRequiredList(temp));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    getUserAccessList();
  }, []);

  const findParentActionCodes = (list, userMenu, setNewOpenMenuList) => {
    if (list?.parentActionCode !== 0) {
      setNewOpenMenuList(list?.parentActionCode);
      const temp = userMenu?.find(
        (x) => x?.actionCode === list?.parentActionCode
      );
      if (!!temp) {
        findParentActionCodes(temp, userMenu, setNewOpenMenuList);
      }
    }
  };

  const handleFindeParentActionCodes = useCallback(
    (userMenu) => {
      setActionCodesListForCurrentPathParent([]);
      let location;
      if (pathname.toLowerCase().includes("originofbankcurrency")) {
        location = "AC/Currency/OriginOfBankCurrency";
      } else if (pathname.toLowerCase().includes("originofnonbankcurrency")) {
        location = "AC/Currency/OriginOfNonBankCurrency";
      } else if (
        pathname.toLowerCase().includes("currencyoriginwithoutcurrencytransfer")
      ) {
        location = "AC/Currency/CurrencyOriginWithoutCurrencyTransfer";
      } else if (
        pathname
          .toLowerCase()
          .includes("currencyoriginofstatisticalregistration")
      ) {
        location = "AC/Currency/CurrencyOriginOfStatisticalRegistration";
      } else if (
        pathname.toLowerCase().includes("licensetransferandcurrencyexchange") ||
        pathname.toLowerCase().includes("createnewannouncement") ||
        pathname.toLowerCase().includes("announcementdetails")
      ) {
        location = "AC/Currency/LicenseTransferAndCurrencyExchange";
      } else if (pathname.toLowerCase().includes("reconciliationportal")) {
        location = "AC/Currency/reconciliationportal";
      } else {
        location = pathname.toLowerCase().replace("/users/", "");
      }
      const temp = userMenu?.find(
        (x) => x?.url?.toUpperCase() === location?.toUpperCase()
      );
      let newOpenMenuList = [];
      const setNewOpenMenuList = (id) => {
        newOpenMenuList = [...newOpenMenuList, id];
      };

      findParentActionCodes(temp, userMenu, setNewOpenMenuList);
      setTimeout(() => {
        setActionCodesListForCurrentPathParent(newOpenMenuList);
        setTimeout(() => {
          setIsDoneSearchForCurrentPathParent(true);
        }, 200);
      }, 200);
    },
    [pathname]
  );

  useEffect(() => {
    if (isDoneSearchForCurrentPathParent) {
      handleFindeParentActionCodes([...userMenuLevel1, ...userMenuLevel2]);
    }
  }, [pathname]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: themeColors[theme]?.boxBg,
        color: themeColors[theme]?.text,
      }}
    >
      {(sidebar === false || sidebar === true) &&
      isDoneSearchForCurrentPathParent ? (
        <Sider
          className="sidebar"
          width="219px"
          collapsed={sidebar}
          collapsedWidth="42px"
          style={{
            backgroundColor: themeColors[theme]?.boxBg,
            color: themeColors[theme]?.text,
          }}
        >
          {
            <ul className="sidebar--items">
              {userMenuLevel1?.map((item, index) => {
                const depth = 0;
                return (
                  <SubMenu
                    listOfParantActionCodesForOpenedItem={
                      actionCodesListForCurrentPathParent
                    }
                    item={item}
                    items={userMenuLevel2}
                    depth={depth}
                    key={`submenu-${depth}-${item?.ActionCode}-${index}`}
                  />
                );
              })}
            </ul>
          }
        </Sider>
      ) : (
        <Sider style={{ display: "none" }}></Sider>
      )}
      <Layout
        className="layout"
        style={{
          backgroundColor: themeColors[theme]?.bg,
          color: themeColors[theme]?.text,
        }}
      >
        {children}
      </Layout>
    </Layout>
  );
};

export default memo(Sidebar);
