import { useEffect } from "react";
import axios from "axios";
import moment from "jalali-moment";
import { connect } from "react-redux";
import {
  mapMetadataStateToProps,
  mapRoleStateToProps,
} from "../state/mapStateToProps";

const SendTimingToBackend = ({ metadata, role }) => {
  const convertDate = (date) => {
    if (!!date) {
      const milliseconds = date.getMilliseconds().toString();
      let formattedMilliseconds;
      if (milliseconds.length === 3) {
        formattedMilliseconds = milliseconds;
      } else if (milliseconds.length === 2) {
        formattedMilliseconds = `0${milliseconds}`;
      } else if (milliseconds.length === 1) {
        formattedMilliseconds = `00${milliseconds}`;
      }
      const newDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
      return `${newDate}.${formattedMilliseconds}`;
    } else {
      return undefined;
    }
  };

  const requestLog = () => {
    const mainData = metadata[metadata.length - 1];
    const methodUrl = mainData.url.split("/");
    const postData = {
      MethodName: methodUrl[methodUrl.length - 1],
      InputData: JSON.parse(mainData.postData),
      SummeryData: "",
      OutputData: mainData.responseData,
      PointerId: role,
      CallTime: convertDate(mainData?.metadata?.startTime),
      RequestID: "",
      RequestCallTime: "",
      duration: mainData.duration,
    };
    axios({
      url: "https://ntsw.ir/users/ac/Logger/RequestLog",
      method: "post",
      data: postData,
    }).then((res) => {
      responseLog(res?.data, mainData, methodUrl);
    });
  };

  const responseLog = (requestID, mainData, methodUrl) => {
    const postData = {
      MethodName: methodUrl[methodUrl.length - 1],
      InputData: JSON.parse(mainData.postData),
      SummeryData: "",
      OutputData: mainData.responseData,
      PointerId: role,
      CallTime: convertDate(mainData?.metadata?.endTime),
      RequestID: requestID,
      RequestCallTime: convertDate(mainData?.metadata?.startTime),
      duration: mainData.duration,
    };
    axios({
      url: "https://ntsw.ir/users/ac/Logger/ResponseLog",
      method: "post",
      data: postData,
    }).then();
  };

  useEffect(() => {
    if (metadata?.length > 0) {
      requestLog();
    }
  }, [metadata]);

  return <></>;
};

export default connect(
  mapMetadataStateToProps,
  mapRoleStateToProps
)(SendTimingToBackend);
