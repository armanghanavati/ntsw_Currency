import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import { Button, Input, Modal, VerticalSpace } from "../../../components";
import themeColors from "../../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { useHistory, useLocation } from "react-router-dom";
import Validation from "../../../utils/Validation";
import StringHelpers from "../../../configs/helpers/string-helpers";

const CreateTabelReconciliationPortal = () => {
  const { role, GUid } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();

  const [dataSource, setDataSource] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [inputsData, setInputsData] = useState({});

  const [errors, setErrors] = useState({});
  const remainingremainedConciliationAmountRial =
    +dataSource?.conciliationRate * inputsData?.intendedAmount;

  const getConciliationAmount = (event) => {
    event?.preventDefault();
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.currencyTrading.getConciliationAmount.url,
      method: endpoints.RestAPIs.currencyTrading.getConciliationAmount.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Result?.ErrorCode === 0) {
          setDataSource(res?.data?.Result);
          setInputsData({
            intendedAmount: res?.data?.Result?.remainedConciliationAmountEuro,
          });
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.Result?.ErrorDesc,
            })
          );
          history.push({
            pathname: "ReconciliationPortal",
          });
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    if (history?.location?.state?.hasAccess) {
      getConciliationAmount();
    } else {
      history.push({
        pathname: "/Users/AC/Currency/ReconciliationPortal",
      });
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            "لطفا از طریق دکمه مصالحه ریالی اقدام به ورود به این صفحه نمایید. ",
        })
      );
    }
  }, []);

  const getTokenOfPayment = () => {
    //TODO: پس از تست این قسمت کدهای کامنت شده پاک شوند
    const postData = {
      cnpVCodeInt: 0,
      cnpUrlVcodeInt: role,
      cnpNationalCodeStr: dataSource.nationalCodeStr,
      cnpTrackingId: "",
      cnpToken: "",
      cnpEuroAmount: dataSource.remainedConciliationAmountEuro,
      cnpRialAmount: dataSource?.remainedConciliationAmountRial,
      cnpRateInt: dataSource.conciliationRate,
      cnpProductType: dataSource.IsProducer,
      cnpProductTypeStr: "",
      cnpYear: 0,
      cnpPaymentStatus: 0,
      cnpPaymentStatusStr: "",
      cnpSendToCbiStatus: 0,
      cnpSendToCbiStatusStr: "",
      cnpUserEuroAmount: inputsData.intendedAmount,
      sadadResponse: 0,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.reconciliationPortal.getTokenOfPayment.url,
      method: endpoints.RestAPIs.reconciliationPortal.getTokenOfPayment.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          window?.location?.replace(
            `https://sadad.shaparak.ir/VPG/purchase?token=${res.data?.Result}`
          );
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
        dispatch(handleLoading(false));
      });
  };

  const onCancelModal = (event) => {
    event?.preventDefault();
    setIsShowModal(false);
  };

  const handlePaymentButton = (event) => {
    event?.preventDefault();
    //TODO: در صورتی که اینپوت های قابل تغییر توسط کاربر اضافه شد پیش از بازشدن مودال
    // مبلغ remainedConciliationAmountEuro
    // با مبلغ  IntendedAmount
    // مقایسه شود
    setIsShowModal(true);
  };

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
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
  };

  const permitForNextStep = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (let key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputsData[item] === undefined ||
        inputsData[item] === null ||
        JSON.stringify(inputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };
  const submitHandler = () => {
    if (permitForNextStep(["intendedAmount"]) === true) {
      getTokenOfPayment();
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا اطلاعات را به درستی وارد نمایید",
        })
      );
    }
  };

  return (
    <>
      <form>
        <Row>
          <Col sm={24} md={12} xl={8}>
            <Input
              title="معادل یورویی کل مبلغ مصالحه"
              value={dataSource?.totalConciliationAmountEuro}
              labelWidth="450px"
              type="number"
              isCurrency={true}
              readOnly={"readOnly"}
            />
          </Col>
          <Col sm={24} md={12} xl={8}>
            <Input
              title="معادل یورویی مبلغ تسویه شده"
              value={dataSource?.paidConciliationAmountEuro}
              labelWidth="450px"
              type="number"
              isCurrency={true}
              readOnly={"readOnly"}
            />
          </Col>
          <Col sm={24} md={12} xl={8}>
            <Input
              value={dataSource?.remainedConciliationAmountEuro}
              labelWidth="450px"
              title="مبالغ باقیمانده ی تسویه نشده (معادل یورویی)"
              type="number"
              isCurrency={true}
              readOnly={"readOnly"}
            />
          </Col>
          <Col sm={24} md={12} xl={8}>
            <Input
              value={dataSource?.IsProducerStr}
              readOnly={true}
              labelWidth="470px"
              title="وضعیت تولیدی/غیر تولیدی"
            />
          </Col>
          {/* <Col sm={24} md={12} xl={8}>
            <Input
              value={inputsData?.intendedAmount}
              labelWidth="470px"
              title="مبلغ یورویی موردنظر"
              onChange={handleChangeInputs}
              error={errors?.intendedAmount}
              name="intendedAmount"
              readOnly={true}
              isCurrency={true}
            />
          </Col> */}
          <Col sm={24} md={12} xl={8}>
            <Input
              value={dataSource?.conciliationRate}
              labelWidth="450px"
              type="number"
              title="نرخ وجه المصالحه به ازای هر یورو (ریال)"
              isCurrency={true}
              readOnly={"readOnly"}
            />
          </Col>
        </Row>
        <VerticalSpace space="1rem" />
        <Row
          className="flex-order-row-justify-end"
          style={{
            boxShadow: " 0 3px 10px rgb(0 0 0 / 0.2)",
            padding: "5px",
          }}
        >
          <Col sm={24} md={12} xl={12} className="flex-order-row-justify-end">
            <Input
              value={dataSource?.remainedConciliationAmountRial}
              labelWidth="450px"
              type="number"
              title="مبلغ ریالی کل وجه المصالحه"
              isCurrency={true}
              readOnly={"readOnly"}
            />
            <Button
              onClick={handlePaymentButton}
              backgroundColor={themeColors.btn.secondary}
              width="200px"
            >
              پرداخت
            </Button>
          </Col>
        </Row>
      </form>
      <Modal
        onCancel={onCancelModal}
        footer={[
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={onCancelModal}
          >
            انصراف
          </Button>,
          <Button
            backgroundColor={themeColors.btn.secondary}
            onClick={() => submitHandler()}
          >
            تایید
          </Button>,
        ]}
        open={isShowModal}
        title="پرداخت"
      >
        <div className="form">
          <div className="modal--text">
            اینجانب تمایل و رضایت خود را مبنی بر پرداخت{" "}
            <span className="modal--text--bold">
              {StringHelpers.formatNumber(
                remainingremainedConciliationAmountRial
              )}{" "}
            </span>
            ریال بابت تبدیل دیون ارزی ناشی از صادرات سال 1397 (مستند به بند (6)
            تصویبنامه شماره 4353/ت55300هـ هیأت وزیران در تاریخ 1397/1/22 و بند
            اول مصوبات چهاردهمین جلسه شورای عالی هماهنگی اقتصادی مورخ 1397/7/10
            (موضوع ابلاغیه شماره 97405 مورخ 1397/7/23)) به صورت پرداخت ریالی به
            حساب خزانه کل کشور با آگاهی از موارد زیر اعلام می نمایم:
          </div>

          <p className="modal--text">
            1- وجوه واریز شده به حساب خزانه غیرقابل برگشت می باشد.
          </p>
          <p className="modal--text">
            2- این شیوه تسویه دیون ارزی، یکی از روشهای بازگشت ارز محسوب نمی شود
            و معادل یورویی آن از سرجمع تعهدات ارزی حاصل از صادرات کسر می شود.
          </p>
          <p className="modal--text">
            3- تبدیل و تسویه دیون ارزی به صورت ریالی، مشمول برخورداری
            صادرکنندگان از معافیتهای مالیاتی صادرکنندگان نمی باشد.
          </p>
          <div className="modal--warning">
            ⚠️ تذکر مهم 1 : با عنایت به لحاظ شدن معاملات باز فروش ارز (اعم
            سامانه نیما و واگذاری پروانه) به عنوان تعهد ایفانشده، پیشنهاد می شود
            قبل از اقدام به مصالحه ریالی و پرداخت وجه، نسبت به تعیین تکلیف این
            دسته از معاملات خود در بخش فروش ارز (سامانه نیما) و درخواست های
            موجود در کارتابل واگذاری پروانه صادراتی و تهاتر اقدام نموده و پس از
            بروزرسانی اطلاعات در بخش «آمار تعهدات صادراتی»، اقدام به مصالحه
            ریالی مانده تعهدات خود نمائید.
          </div>
          <div className="modal--warning">
            ⚠️ تذکر مهم 2 : چنانچه ارز حاصل از صادرات خود را از طریق سامانه نیما
            (در قالب پیش فروش) یا سامانه سنا به فروش رسانده اید لازم است قبل از
            اقدام به مصالحه ریالی و پرداخت وجه، با مراجعه به «درگاه مدیریت مصارف
            پروانه های صادراتی» نسبت به تناظر رسید سنا با پروانه های صادراتی
            مربوطه اقدام نمائید و پس از بروزرسانی اطلاعات در بخش «آمار تعهدات
            صادراتی»، اقدام به مصالحه ریالی مانده تعهدات خود نمائید. در غیر این
            صورت بانک مرکزی به صورت خودکار و مطابق ضوابط و مقررات مصوب کمیته
            بازگشت ارز حاصل از صادرات، اقدام به تناظر آن ها با پروانه های مجاز
            می نماید.
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateTabelReconciliationPortal;
