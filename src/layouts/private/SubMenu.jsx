import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import themeColors from "../../configs/theme";
import { endpoints } from "../../services/endpoints";
import useFitText from "use-fit-text";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import axios from "axios";
import URLHelpers from "../../configs/helpers/url-helpers";

const SubMenu = ({
  listOfParantActionCodesForOpenedItem,
  item,
  items,
  depth,
}) => {
  const dispatch = useDispatch();

  const { fontSize, ref } = useFitText({ minFontSize: 65, maxFontSize: 100 });
  const { sidebar, theme, role, GUid } = useSelector((state) => state);
  const { pathname, search, state } = useLocation();

  const [depth2, setDepth2] = useState(false);
  const [subnav, setSubnav] = useState(false);
  const [selectedNav, setSelectedNav] = useState([]);
  const [showWithHover, setShowWithHover] = useState(false);
  const [subnavBg, setSubnavBg] = useState("");

  function showSubnav() {
    sidebar && depth !== 0 && setSubnav(!subnav);
    sidebar === false && setSubnav(!subnav);
  }

  useEffect(() => {
    const temp = items?.filter((x) => x.parentActionCode === item.actionCode);
    setSelectedNav(temp);
    setDepth2(depth + 1);
  }, [items]);

  useEffect(() => {
    setSubnav(false);
    if (listOfParantActionCodesForOpenedItem?.includes(item?.actionCode)) {
      showSubnav();
    }
    setShowWithHover(false);
  }, [sidebar]);

  useEffect(() => {
    depth === 0 && setSubnavBg(themeColors[theme]?.boxBg);
    depth !== 0 && setSubnavBg(themeColors[theme]?.submenuBg);
  }, [theme]);

  const getEndpointObj = () => {
    console.log(" i am here", item?.actionCode);

    switch (item?.actionCode) {
      case 1240:
        return handleChangeURL(endpoints.RestAPIs.user.NTSW_GetRankingLoginURL);
      case 1344:
        return handleChangeURL(endpoints.RestAPIs.user.NTSW_JAMVerifyUser);
      case 30013:
        return handleChangeURL(endpoints.RestAPIs.user.NTSW_EnergyInquiry);
      case 1540:
        return handleChangeURL(endpoints.RestAPIs.user.NTSW_Sysytem124Login);
      default:
        if (!sidebar) {
          showSubnav(item?.actionCode);
        }
    }
  };

  const handleChangeURL = (endpoint) => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoint.url,
      method: endpoint.method,
      data: postData,
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          console.log(res.data);
          if (
            URLHelpers.validateURL(
              res.data?.RankingURL || res.data?.Result || res.data?.URL
            )
          ) {
            window.open(
              res.data?.RankingURL || res.data?.Result || res.data?.URL,
              "_blank"
            );
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: "url معتبر نمیباشد.",
              })
            );
          }
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const handleGoExternalURLs = (event) => {
    if (items) {
      getEndpointObj();
    }
  };
  return (
    <>
      {sidebar ? (
        <li
          className={`closedSidebar--item-${depth}`}
          onMouseEnter={() => setShowWithHover(true)}
          onMouseLeave={() => setTimeout(setShowWithHover(false), 200)}
          key={`submenu-${depth}-${item?.actionCode}`}
        >
          <span className={`closedSidebar--item-${depth}--icon1`}>
            <i
              style={{
                color: themeColors[theme]?.text,
              }}
              className={item.icon}
              aria-hidden="true"
            ></i>
          </span>
          {(showWithHover || depth !== 0) && (
            <>
              {item.url === "#" ||
              item.url === null ||
              item.url.includes("AC/Currency/") ? (
                <Link
                  className={`closedSidebar--item-${depth}--all `}
                  to={
                    item.url !== "#" && item.url !== null
                      ? item.url.includes("AC/Currency/")
                        ? `/Users/${item.url}`
                        : {
                            pathname,
                            search,
                            state,
                          }
                      : {
                          pathname,
                          search,
                          state,
                        }
                  }
                  // onClick={
                  //   items &&
                  //   (() => {
                  //     if (item.url !== "#" && item.url !== null) {
                  //       !item.url.includes("AC/Currency/") &&
                  //         item.url.includes("/Users/") &&
                  //         window.location.replace(
                  //           `${endpoints.BaseUrlAddress}${item.url}`
                  //         );
                  //       !item.url.includes("AC/Currency/") &&
                  //         !item.url.includes("/Users/") &&
                  //         window.location.replace(
                  //           `${endpoints.BaseUrlAddress}/Users/${item.url}`
                  //         );
                  //     }
                  //     showSubnav();
                  //   })
                  // }
                  onClick={
                    items &&
                    (() => {
                      if (item?.url !== "#" && item?.url !== null) {
                        !item?.url.includes("AC/") &&
                          item?.url.includes("/Users/") &&
                          handleGoExternalURLs();
                        !item?.url.includes("AC/") &&
                          !item?.url.includes("/Users/") &&
                          window.location.replace(
                            `${endpoints?.BaseUrlAddress}/Users/${item?.url}`
                          );
                      }
                      showSubnav();
                    })
                  }
                  style={{
                    backgroundColor: subnavBg,
                    color: themeColors[theme]?.text,
                  }}
                >
                  <p
                    title={item.actionName}
                    className={`closedSidebar--item-${depth}--title`}
                  >
                    {item.actionName}
                  </p>
                  <>
                    {selectedNav?.length > 0 && subnav && depth !== 0 ? (
                      <span className={`closedSidebar--item-${depth}--icon2`}>
                        <i
                          style={{
                            color: themeColors[theme]?.text,
                          }}
                          className="fa fa-angle-down"
                          aria-hidden="true"
                        ></i>
                      </span>
                    ) : selectedNav?.length > 0 && depth !== 0 ? (
                      <span className={`closedSidebar--item-${depth}--icon2`}>
                        <i
                          style={{
                            color: themeColors[theme]?.text,
                          }}
                          className="fa fa-angle-left"
                          aria-hidden="true"
                        ></i>
                      </span>
                    ) : null}
                  </>
                </Link>
              ) : (
                <a
                  className={`closedSidebar--item-${depth}--all `}
                  href={
                    item.url.includes("http") || item.url.trim() === ""
                      ? null
                      : !item.url.includes("AC/Currency/") &&
                        item.url.includes("/Users/")
                      ? `${endpoints.BaseUrlAddress}${item.url}`
                      : `${endpoints.BaseUrlAddress}/Users/${item.url}`
                  }
                  // onClick={
                  //   items &&
                  //   (() => {
                  //     showSubnav();
                  //   })
                  // }
                  onClick={handleGoExternalURLs}
                  style={{
                    backgroundColor: subnavBg,
                    color: themeColors[theme]?.text,
                  }}
                >
                  <p
                    title={item.actionName}
                    className={`closedSidebar--item-${depth}--title`}
                  >
                    {item.actionName}
                  </p>
                  <>
                    {selectedNav?.length > 0 && subnav && depth !== 0 ? (
                      <span className={`closedSidebar--item-${depth}--icon2`}>
                        <i
                          style={{
                            color: themeColors[theme]?.text,
                          }}
                          className="fa fa-angle-down"
                          aria-hidden="true"
                        ></i>
                      </span>
                    ) : selectedNav?.length > 0 && depth !== 0 ? (
                      <span className={`closedSidebar--item-${depth}--icon2`}>
                        <i
                          style={{
                            color: themeColors[theme]?.text,
                          }}
                          className="fa fa-angle-left"
                          aria-hidden="true"
                        ></i>
                      </span>
                    ) : null}
                  </>
                </a>
              )}
            </>
          )}
          {((showWithHover && depth === 0) || subnav) && (
            <ul
              style={{
                backgroundColor: themeColors[theme]?.submenuBg,
                color: themeColors[theme]?.text,
              }}
              className={`closedSidebar--item-${depth}--submenue`}
            >
              {selectedNav?.map((item, index) => {
                return (
                  <SubMenu
                    item={item}
                    items={items}
                    depth={depth2}
                    key={`submenu0-${depth}-${index}`}
                  />
                );
              })}
            </ul>
          )}
        </li>
      ) : (
        <li
          className={`sidebar--item-${depth}`}
          key={`submenu-${depth}-${item?.actionCode}`}
        >
          {item.url === "#" ||
          item.url === null ||
          item.url.includes("AC/Currency/") ? (
            <Link
              className={
                listOfParantActionCodesForOpenedItem?.includes(
                  item?.actionCode
                ) && depth === 1
                  ? `sidebar--item-${depth}--all sidebar--item-${depth}--all--focused`
                  : `sidebar--item-${depth}--all`
              }
              to={
                item.url !== "#" && item.url !== null
                  ? item.url.includes("AC/Currency/")
                    ? `/Users/${item.url}`
                    : {
                        pathname,
                        search,
                        state,
                      }
                  : {
                      pathname,
                      search,
                      state,
                    }
              }
              onClick={
                items &&
                (() => {
                  showSubnav(item.actionCode);
                })
              }
              // onClick={handleGoExternalURLs}
            >
              <span className={` sidebar--item-${depth}--icon1`}>
                <i
                  style={{
                    color: themeColors[theme]?.text,
                  }}
                  className={item.icon}
                  aria-hidden="true"
                ></i>
              </span>
              <p
                title={item.actionName}
                style={
                  depth === 1
                    ? {
                        color: themeColors[theme]?.text,
                        fontSize,
                        width: "210px",
                        height: 40,
                      }
                    : {
                        color: themeColors[theme]?.text,
                      }
                }
                ref={depth === 1 ? ref : null}
                className={`sidebar--item-${depth}--title`}
              >
                {item.actionName}
              </p>
              <>
                {selectedNav.length > 0 && subnav ? (
                  <span className={`sidebar--item-${depth}--icon2`}>
                    <i
                      style={{
                        color: themeColors[theme]?.text,
                      }}
                      className="fa fa-angle-down"
                      aria-hidden="true"
                    ></i>
                  </span>
                ) : selectedNav.length > 0 ? (
                  <span className={`sidebar--item-${depth}--icon2`}>
                    <i
                      style={{
                        color: themeColors[theme]?.text,
                      }}
                      className="fa fa-angle-left"
                      aria-hidden="true"
                    ></i>
                  </span>
                ) : null}
              </>
            </Link>
          ) : (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              className={
                listOfParantActionCodesForOpenedItem?.includes(
                  item?.actionCode
                ) && depth === 1
                  ? `sidebar--item-${depth}--all sidebar--item-${depth}--all--focused`
                  : `sidebar--item-${depth}--all`
              }
              href={
                item.url.includes("http") ||
                item.actionCode == 30013 ||
                item.url.trim() === ""
                  ? null
                  : !item.url.includes("AC/Currency/") &&
                    item.url.includes("/Users/")
                  ? `${endpoints.BaseUrlAddress}${item.url}`
                  : `${endpoints.BaseUrlAddress}/Users/${item.url}`
              }
              // onClick={
              //   items &&
              //   (() => {
              //     showSubnav(item.actionCode);
              //   })
              // }
              onClick={handleGoExternalURLs}
            >
              <span className={` sidebar--item-${depth}--icon1`}>
                <i
                  style={{
                    color: themeColors[theme]?.text,
                  }}
                  className={item.icon}
                  aria-hidden="true"
                ></i>
              </span>
              <p
                title={item.actionName}
                style={
                  depth === 1
                    ? {
                        color: themeColors[theme]?.text,
                        fontSize,
                        width: "210px",
                        height: 40,
                      }
                    : {
                        color: themeColors[theme]?.text,
                      }
                }
                ref={depth === 1 ? ref : null}
                className={`sidebar--item-${depth}--title`}
              >
                {item.actionName}
              </p>
              <>
                {selectedNav.length > 0 && subnav ? (
                  <span className={`sidebar--item-${depth}--icon2`}>
                    <i
                      style={{
                        color: themeColors[theme]?.text,
                      }}
                      className="fa fa-angle-down"
                      aria-hidden="true"
                    ></i>
                  </span>
                ) : selectedNav.length > 0 ? (
                  <span className={`sidebar--item-${depth}--icon2`}>
                    <i
                      style={{
                        color: themeColors[theme]?.text,
                      }}
                      className="fa fa-angle-left"
                      aria-hidden="true"
                    ></i>
                  </span>
                ) : null}
              </>
            </a>
          )}
          {subnav && (
            <ul className={`sidebar--item-${depth}--submenue`}>
              {selectedNav.map((item, index) => {
                return (
                  <SubMenu
                    listOfParantActionCodesForOpenedItem={
                      listOfParantActionCodesForOpenedItem
                    }
                    item={item}
                    items={items}
                    depth={depth2}
                    key={`submenu0-${depth}-${index}`}
                  />
                );
              })}
            </ul>
          )}
        </li>
      )}
    </>
  );
};

export default SubMenu;
