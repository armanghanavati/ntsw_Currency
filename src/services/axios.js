import axios from "axios";
import {
  handleMessageModal,
  handleAddMetadata,
} from "../state/action-creators";
import { store } from "./../state/store";
import { logOut } from "../configs/validate-JWT";
import { endpoints } from "./endpoints";

axios.interceptors.request.use(
  function (config) {
    if (
      config.url ===
        endpoints.RestAPIs.CurrencyAllocation.upgradeRegedOrder.url ||
      config.url ===
        endpoints.RestAPIs.CurrencyAllocation.RevokeCurrencyAllocationRequest
          .url
    ) {
      config.metadata = { startTime: new Date() };
      config.data.random = Math.floor(Math.random() * 1000000000 + 1);
    }
    config.headers.post = {
      "Content-Type": "application/json",
    };
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
      URL === endpoints.RestAPIs.CurrencyAllocation.upgradeRegedOrder.url ||
      URL ===
        endpoints.RestAPIs.CurrencyAllocation.RevokeCurrencyAllocationRequest
          .url
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

    if (
      response?.data?.ErrorCode === 1369 ||
      response?.data?.ErrorCode === 1990 ||
      response?.data?.ErrorCode === -401 ||
      response?.data?.Error === 1369 ||
      response?.data?.Error === 1990 ||
      response?.data?.Error === -401
    ) {
      logOut();
    } else if (
      // (!!response?.data?.ErrorCode && response?.data?.ErrorCode !== 0) ||
      !!response?.data?.Error &&
      response?.data?.Error !== 0
    ) {
      store.dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            response?.data?.ErrorDesc || "مشکلی در سرور به وجود آمده است.",
        })
      );
    }
    return response;
  },
  async function (error) {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedErrors) {
      store.dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "مشکلی در سرور به وجود آمده است.",
        })
      );
      return;
    }
  }
);
