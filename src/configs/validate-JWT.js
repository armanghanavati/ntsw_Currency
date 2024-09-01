import axios from "axios";
import { endpoints } from "../services/endpoints";
import {
  changeRole,
  getAlternativeToken,
  getGUID,
  getJWT,
  handleLoading,
  handleMessageModal,
} from "../state/action-creators";
import { store } from "../state/store";

export const handleUnauthorizedAccess = (description) => {
  
  store.dispatch(getAlternativeToken(null));
  store.dispatch(getGUID(null));
  if (process.env.NODE_ENV === "production") {
    window.location.replace(`${endpoints.BaseUrlAddress}/index.aspx`);
  } else {
    window.location = "/";
  }
};

export const getTokenInfo = async () => {
  const state = store.getState();
  store.dispatch(handleLoading(true));
  const postData = {
    token: state.alternativeToken,
  };
  await axios({
    url: endpoints.RestAPIs.user.getTokenInfo.url,
    method: endpoints.RestAPIs.user.getTokenInfo.method,
    data: postData,
  })
    .then((res) => {
      if (res.data.ErrorCode === 0) {
        store.dispatch(changeRole(res.data?.result?.role));
        store.dispatch(getJWT(res.data?.result?.customJwtToken));
      } else {
        handleUnauthorizedAccess(res.data.message);
      }
      store.dispatch(handleLoading(false));
    })
    .catch((err) => {
      console.log(err);
      handleUnauthorizedAccess();
      store.dispatch(handleLoading(false));
    });
};

export const clearCookie = () => {
  axios({
    url: endpoints.RestAPIs.cookie.clearCookie.url,
    method: endpoints.RestAPIs.cookie.clearCookie.method,
  })
    .then((res) => {
      if (res?.data) {
        handleUnauthorizedAccess();
      }
      store.dispatch(handleLoading(false));
    })
    .catch((err) => {
      store.dispatch(handleLoading(false));
      console.log(err);
    });
};

export const logOut = () => {
  const state = store.getState();
  store.dispatch(handleLoading(true));
  const postData = {
    token: state.alternativeToken,
  };
  axios({
    url: endpoints.RestAPIs.user.logout.url,
    method: endpoints.RestAPIs.user.logout.method,
    data: postData,
  })
    .then((res) => {
      if (res?.data?.ErrorCode === 0) {
        clearCookie();
      } else {
        store.dispatch(handleLoading(false));
      }
    })
    .catch((err) => {
      store.dispatch(handleLoading(false));
      console.log(err);
    });
};
