import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import themeColors from "../../configs/theme.js";
import GetRoles from "./GetRoles";
import CountDown from "./CountDown";
import { Col, Row } from "antd";
import {
  handleBreadCrumbData,
  handleSidebar,
} from "../../state/action-creators/index.js";
import BreadCrumbData from "../../utils/BreadCrumbData.js";
import { useState } from "react";
import { useEffect } from "react";
import { endpoints } from "../../services/endpoints.js";

const Header = ({ handleFullScreen }) => {
  const [showCountDown, setShowCountDown] = useState(true);
  const { theme, sidebar, colorMode, breadCrumbData } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  let { pathname, state, search } = useLocation();
  const [breadCrumb, setBreadCrumb] = useState([{ link: "#", name: "" }]);
  const [multiBreadCrumb, setMultiBreadCrumb] = useState("");
  const handleNavbar = () => {
    if (sidebar === true) {
      dispatch(handleSidebar("closed"));
    } else {
      dispatch(handleSidebar(true));
    }
  };

  useEffect(() => {
    // if (breadCrumbData !== "") {
    setBreadCrumb(breadCrumbData);
    // setMultiBreadCrumb(breadCrumbData)
    // }
  }, []);

  useEffect(() => {
    setBreadCrumb(
      BreadCrumbData[pathname.toLocaleLowerCase()] || [
        { link: "#", name: "خانه" },
      ]
    );
    setShowCountDown(false);
    setTimeout(() => {
      setShowCountDown(true);
    }, 200);
  }, [pathname]);

  return (
    <div className="user-header">
      <Row className="user-header__row1">
        <Col sm={24} lg={16}>
          <ul className="user-header__row1--breadcrumb">
            <li className="user-header__row1--breadcrumb__icon">
              <i className="fa fa-home"></i>
            </li>
            {breadCrumb !== null &&
              breadCrumb?.map((item, index) => (
                <li key={`breadCrumb-${index}`}>
                  {index !== 0 && index !== breadCrumb.length && (
                    <span
                      style={{
                        color: themeColors[theme]?.brdcrumbSlash,
                      }}
                    >
                      /
                    </span>
                  )}
                  {index === 0 ? (
                    <a
                      className="user-header__row1--breadcrumb__title"
                      href={endpoints.ExternalLink.default}
                      style={{
                        color:
                          theme === "dark"
                            ? themeColors[theme]?.inputText
                            : colorMode,
                      }}
                    >
                      {item?.name}
                    </a>
                  ) : (<Link
                    className="user-header__row1--breadcrumb__title"
                    to={{
                      pathname: `${
                        item?.id === "multiName" ? pathname :item.link==='#'?pathname: item.link
                      }`,
                      state:index===breadCrumb.length-1?state:undefined,
                      search:index===breadCrumb.length-1?search:undefined,
                    }}
                    style={{
                      color:
                        theme === "dark"
                          ? themeColors[theme]?.inputText
                          : colorMode,
                    }}
                  >
                    {item?.id === "multiName" ? breadCrumbData : item.name}
                  </Link>)}
                </li>
              ))}
          </ul>
        </Col>
        <Col sm={24} lg={8}>
          <GetRoles />
        </Col>
      </Row>
      <ul
        className="user-header__row2"
        style={{
          backgroundImage: themeColors[theme]?.userHeader,
        }}
      >
        <li className="user-header__row2--right">
          {pathname === "/Users/AC/Currency/ExternalTradeAssignmentBoardConfirm"
            ? "تابلوی آگهی های واگذاری ارز حاصل از صادرات"
            : breadCrumb[breadCrumb.length - 1]?.id === "multiName"
            ? breadCrumbData
            : breadCrumb[breadCrumb.length - 1].name}
        </li>
        <li className="user-header__row2--left">
          <span>{showCountDown && <CountDown />}</span>
          <span
            style={{
              color: themeColors[theme]?.icon,
            }}
            onClick={
              handleFullScreen.active
                ? handleFullScreen.exit
                : handleFullScreen.enter
            }
          >
            <i className="fa fa-arrows-alt" aria-hidden="true"></i>
          </span>
          <span
            style={{
              color: themeColors[theme]?.icon,
            }}
            onClick={handleNavbar}
          >
            <i className="fa fa-arrows-h" aria-hidden="true"></i>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Header;
