import React from "react";
import axios from "axios";
import { endpoints } from "../../services/endpoints";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeRole } from "../../state/action-creators";
import themeColors from "../../configs/theme.js";
import { memo } from "react";

const GetRoles = () => {
  const dispatch = useDispatch();
  const { theme, alternativeToken } = useSelector((state) => state);
  const [rolesList, setRolesList] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [showSelectBox, setShowSelectBox] = useState(false);

  const getUserRoles = () => {
    const postData = {
      token: alternativeToken,
    };
    axios({
      url: endpoints.RestAPIs.user.getUserRoles.url,
      method: endpoints.RestAPIs.user.getUserRoles.method,
      data: postData,
    })
      .then((res) => {
        const activeRole = res?.data?.Result.find(
          (item) => item.isSelected === true
        );
        setRolesList(res?.data?.Result);
        setSelectedRole(activeRole);
        setShowSelectBox(true);
      })
      .catch((err) => {
        setShowSelectBox(true);
        console.log(err);
      });
  };
  const getSessionBySelectRole = (newCode) => {
    window.location.replace(
      `${endpoints.BaseUrlAddress}/users/default.aspx?roleCode=${
        newCode.split("//")[0]
      }&type=${newCode.split("//")[1]}`
    );
  };

  useEffect(() => {
    getUserRoles();
  }, []);

  const getRoleCode = (event) => {
    const newRole = event.target.value;
    getSessionBySelectRole(newRole);
    dispatch(changeRole(newRole));
  };

  return (
    <form className="get-roles">
      {showSelectBox && (
        <>
          <label
            className="get-roles--label"
            htmlFor="selectRole"
            style={{
              color: themeColors[theme]?.inputText,
              height: "35px",
            }}
          >
            {" "}
            نقش جاری
          </label>
          <select
            className="get-roles--selector"
            onChange={getRoleCode}
            id="selectRole"
            style={{
              color: themeColors[theme]?.inputText,
              backgroundColor: themeColors[theme]?.inputBg,
              height: "35px",
            }}
            title={
              selectedRole &&
              `${selectedRole?.roleName} - ${selectedRole?.urlStatusStr}`
            }
            defaultValue={
              selectedRole &&
              `${selectedRole?.roleId}//${selectedRole?.bussinesRoleType}`
            }
          >
            {rolesList &&
              (Array.isArray(rolesList) ||
                JSON.stringify(rolesList).startsWith("[")) &&
              rolesList?.map((item, index) => (
                <option
                  style={{
                    color: themeColors[theme]?.inputText,
                    backgroundColor: themeColors[theme]?.inputBg,
                  }}
                  title={`${item.roleName} - ${item.urlStatusStr}`}
                  className="get-roles--option"
                  key={`${item.urlStatusInt}-${index}`}
                  value={`${item.roleId}//${item.bussinesRoleType}`}
                >
                  {item.roleName} - {item.urlStatusStr}
                </option>
              ))}
          </select>
        </>
      )}
    </form>
  );
};

export default memo(GetRoles);
