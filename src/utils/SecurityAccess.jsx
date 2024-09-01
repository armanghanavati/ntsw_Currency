import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { endpoints } from "../services/endpoints";
import {
  getAlternativeToken,
  handleLoading,
  handleMessageModal,
  changeRole,
  getGUID,
  getNationalCode,
  roleDetails,
} from "../state/action-creators";
import { Loading, QuestionModal } from "../components";
import PrivateLayaout from "../layouts/private/PrivateLayaout";
import { handleUnauthorizedAccess } from "../configs/validate-JWT";
import SendTimingToBackend from "../components/SendTimingToBackend";

const SecurityAccess = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [getCookieService, setGetCookieService] = useState(false);
  const dispatch = useDispatch();
  const { alternativeToken, loading } = useSelector((state) => state);

  const getCookies = () => {
    dispatch(handleLoading(true));
    axios({
      url: `${endpoints.BaseUrlAddress}/users/ac/cookie/token/get`,
      method: "get",
    })
      .then((res) => {
        if (process.env.NODE_ENV === "production") {
          dispatch(getAlternativeToken(res.data?.AlternativeToken));
          dispatch(getGUID(res.data.Session));
        }
        setGetCookieService(true);
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    if (
      process.env.REACT_APP_WEATHER_API_KEY !== "production-operation" &&
      process.env.NODE_ENV === "production"
    ) {
      getCookies();
    } else {
      dispatch(handleLoading(true));
      setGetCookieService(true);
    }
  }, []);

  const getTokenInfo = () => {
    const postData = {
      token: alternativeToken,
    };

    axios(
      {
        url: endpoints.RestAPIs.user.getTokenInfo.url,
        method: endpoints.RestAPIs.user.getTokenInfo.method,
        data: postData,
      },
      { withCredentials: true }
    )
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          dispatch(changeRole(res.data?.result?.role));
          dispatch(getNationalCode(res.data?.result?.nationalId));
          dispatch(roleDetails({ roleType: res.data?.result?.UserRoleType }));

          setHasAccess(true);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.message,
            })
          );
          handleUnauthorizedAccess();
          dispatch(getAlternativeToken(null));
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        handleUnauthorizedAccess();
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    if (getCookieService) {
      getTokenInfo();
    }
  }, [getCookieService]);

  return (
    <>
      <QuestionModal />
      {loading === true && <Loading />}
      {hasAccess && (
        <PrivateLayaout>
          {children}
          <SendTimingToBackend />
        </PrivateLayaout>
      )}
    </>
  );
};

export default SecurityAccess;
