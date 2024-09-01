import axios from "axios";
import { handleUnauthorizedAccess } from "../configs/validate-JWT";
import {
  getJWT,
  handleAddMetadata,
  handleMessageModal,
} from "../state/action-creators";
import { store } from "./../state/store";
import { endpoints } from "./endpoints";
import * as DOMPurify from "dompurify";

axios.interceptors.request.use(
  function (config) {
    // برای ارسال تایمینگ به بکند یک عدد رندوم به ورودی سرویس اضافه میکند و استارت تایم را ست میکند
    if (
      config.url ===
        endpoints.RestAPIs.importDeclaration.create
          .getImportWarehouseWithPagination.url ||
      config.url ===
        endpoints.RestAPIs.importDeclaration.create.upsertImportDeclaration
          .url ||
      config.url === endpoints.RestAPIs.billOfLadding.getGoodsBillOfLadings.url
    ) {
      config.metadata = { startTime: new Date() };
      config.data.random = Math.floor(Math.random() * 1000000000 + 1);
    }

    const { JWT } = store.getState((state) => ({ JWT: state?.JWT }));
    config.headers.post = {
      "Content-Type": "application/json",
    };

    if (JWT != null) {
      config.headers.Authorization = `Bearer ${JWT}`;
    }
    config.timeout = 60000;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async function (response) {
    //   تایمینگ چند سرویس را به بکند ارسال میکند
    const URL = response.config.url;
    if (
      URL === endpoints.RestAPIs.billOfLadding.getGoodsBillOfLadings.url ||
      URL ===
        endpoints.RestAPIs.importDeclaration.create
          .getImportWarehouseWithPagination.url ||
      URL ===
        endpoints.RestAPIs.importDeclaration.create.upsertImportDeclaration.url
    ) {
      response.config.metadata.endTime = new Date();
      store.dispatch(
        handleAddMetadata({
          postData: response.config.data,
          metadata: response.config.metadata,
          url: response.config.url,
          duration:
            response.config.metadata.endTime -
            response.config.metadata.startTime,
          responseData: response.data,
        })
      );
    }
    if (!!response?.data?.code && response?.data?.code !== 0) {
      store.dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            response?.data?.message || "مشکلی در سرور به وجود آمده است.",
        })
      );
    }
    return JSON.parse(DOMPurify.sanitize(JSON.stringify(response)));
  },
  async function (error) {
    const expectedErrors =
      error.response &&
      error.response?.status > 400 &&
      error.response?.status < 500;
    if (!expectedErrors) {
      store.dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: `مشکلی در سامانه به وجود آمده است. کد ارور:${error.response?.status}`,
        })
      );
      return;
    } else if (error.response?.status === 400) {
      store.dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: `ورودی نامعتبر است. کد ارور:${error.response?.status}`,
        })
      );
    }

    const state = store.getState();
    const originalRequest = error.config;

    const refreshAccessTokenFn = async () => {
      var options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: state.alternativeToken }),
      };
      await fetch(endpoints.RestAPIs.user.getTokenInfo.url, options)
        .then(function (res) {
          return res.json();
        })
        .then(
          function (resJson) {
            if (resJson.errorCode === 0) {
              store.dispatch(getJWT(resJson?.customJwtToken));
            } else {
              handleUnauthorizedAccess();
              return;
            }
            return resJson;
          },
          (err) => {
            handleUnauthorizedAccess();
            return;
          }
        );
      return state.JWT;
    };

    //401==> jwt مربوط به unauthorized
    //403==>  Alternative token مربوط به unauthorized
    if (error?.response?.status === 403) {
      handleUnauthorizedAccess();
    } else if (error?.response?.status === 401) {
      if (!!!originalRequest._retry) {
        return axios({
          _retry: true,
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${await refreshAccessTokenFn()}`,
          },
        });
      } else {
        handleUnauthorizedAccess();
      }
    } else {
      return;
    }
  }
);
