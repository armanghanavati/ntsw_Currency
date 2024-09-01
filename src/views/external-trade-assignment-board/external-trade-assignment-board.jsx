import { useState } from "react";
import { Col } from "antd";
import { Button, ComboBox } from "../../components";
import themeColors from "../../configs/theme";
import Validation from "../../utils/Validation";
import EmergingProblem from "../currency-trading/emerging-problem/emerging-problem";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import { endpoints } from "../../services/endpoints";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import exportLicense from "../../assets/file/exportLicense.pdf";

const ExternalTradeAssignmentBoard = () => {
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [option, setOption] = useState([]);
  const dispatch = useDispatch();
  const { role, GUid } = useSelector((state) => state);
  const history = useHistory();
  const handleChangeInputs = (name, value, validationNameList = undefined) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  const GetOrdersList = () => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.declaration.GetRegedOrderList.url,
      method: endpoints.RestAPIs.declaration.GetRegedOrderList.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data.ErrorCode === 0) {
          setOption(res?.data?.orderList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
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

  const ConfirmForGetAdviseListForOrder = () => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfOrderNoStr: inputsData?.orderList,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.declaration.ConfirmForGetAdviseListForOrder.url,
      method:
        endpoints.RestAPIs.declaration.ConfirmForGetAdviseListForOrder.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data.Error === 0) {
          history?.push(
            `/Users/AC/Currency/ExternalTradeAssignmentBoardConfirm`
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
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

  const submitHandler = (e) => {
    e.preventDefault();
    ConfirmForGetAdviseListForOrder();
  };

  useEffect(() => {
    GetOrdersList();
  }, []);

  return (
    <>
      <div className="border-box-buttons">
        <a href={exportLicense} target="blank">
          <Button>
            <i className="fa fa-file btn-label" aria-hidden="true"></i>
            راهنمای فرآیند
          </Button>
        </a>
        <a>
          <Button>
            <i className="fa fa-file btn-label" aria-hidden="true"></i>
            راهنمای کاربردی
          </Button>
        </a>
      </div>
      <div className="description-box">
        <p>
          جهت مشاهده تابلوی پروانه های صادراتی لازم است ثبت سفارشی که قصد دارید
          جهت تامین ارز آن، از روش «واردات در مقابل صادرات غیر» استفاده نمائید
          را انتخاب کنید.
        </p>
        <p>
          لازم به ذکر است که ثبت سفارش هایی قابل انتخاب هستند که دارای گواهی ثبت
          آماری تائید شده از نوع «ارز اشخاص-از محل صادرات دیگران» باشند.
        </p>
      </div>
      <Col style={{ margin: "20px auto 0" }} sm={24} md={24} xl={8}>
        <ComboBox
          title="ثبت سفارش"
          defaultValue={inputsData?.orderList}
          name="orderList"
          onChange={handleChangeInputs}
          options={option}
          optionTitle="prfOrderNoStr"
          optionValue="prfOrderNoStr"
          validations={[["required"]]}
          error={errors?.orderList}
        />
      </Col>
      <div className="submit-button">
        <Button
          backgroundColor={themeColors.btn.secondary}
          width="230px"
          onClick={(e) => submitHandler(e)}
        >
          تایید
        </Button>
      </div>
      <div className="info-box-currency">
        <Col sm={24} md={24} xl={16}>
          <p className="info-text-Currency">
            مسیر دسترسی جهت درج آگهی واگذاری پروانه توسط صادرکنندگان عبارت است
            از : عملیات ارزی &gt;&gt; معامله ارز &gt;&gt; واگذاری پروانه و تهاتر
            ارزی &gt;&gt; ایجاد آگهی جدید
          </p>
        </Col>
      </div>
      <EmergingProblem />
    </>
  );
};

export default ExternalTradeAssignmentBoard;
