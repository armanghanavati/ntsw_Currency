import { Col, Form, Row, Tooltip } from "antd";
import themeColors from "../../../configs/theme";
import {
  Button,
  ComboBox,
  EmergencyProblem,
  GuideBox,
  Input,
} from "../../../components";
import ExternalTradeNewCostManagementOfPortQuotasTable1 from "../table/ExternalTradeNewCostManagementOfPortQuotasTable1";
import ExternalTradeNewCostManagementOfPortQuotasTable2 from "../table/ExternalTradeNewCostManagementOfPortQuotasTable2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import { useState } from "react";
import { useEffect } from "react";
import ExternalTradeNewCostManagementOfPortQuotasTable3 from "../table/ExternalTradeNewCostManagementOfPortQuotasTable3";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import SerialNumberInput from "../../../components/SerialNumberInput";
import { useRef } from "react";
import Validation from "../../../utils/Validation";
import Card from "../../../components/Card";

export default function ExternalTradeNewCostManagementOfPortQuotas() {
  const dispatch = useDispatch();
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [inqueryData, setInqueryData] = useState([]);
  const [CotageCode, setCotageCode] = useState(null);
  const [CustomCode, setCustomCode] = useState(null);
  const [combo, setCombo] = useState([]);
  const [RefMasrafCode, setRefMasrafCode] = useState(null);
  const [currencyRateType, setcurrencyRateType] = useState(null);
  const [refId, setRefId] = useState(null);
  const [data, setData] = useState([]);
  const [calculateUseData, setCalculateUseData] = useState([]);
  const history = useHistory();
  const [changeNameCombo, setChangeNameCombo] = useState(null);
  const [inquiryInputsData, setInquiryInputsData] = useState({});
  const [inquiryErrors, setInquiryErrors] = useState({});
  const [form] = Form.useForm();
  const customCodeRef = useRef();
  const [exportLicenseInquiryFlag, setExportLicenseInquiry] = useState(false);
  const [finalyFlag, setFinalyFlag] = useState(false);
  // useefect to get combobox------------------------------
  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      SessionID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.ObligationEliminate.GetMasrafType.url,
      method: endpoints.RestAPIs.ObligationEliminate.GetMasrafType.method,
      data: postData,
    })
      .then((res) => {
        // this is set data
        const convertedData = res.data.Result.map((item) => ({
          name: item.descriptionPersian,
          value: item.value,
        }));
        const add = { name: "انتخاب کنید", value: null };
        convertedData.push(add);
        setCombo(convertedData);
        if (res.data?.ErrorCode === 0) {
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
  }, []);
  // Export license inquiry -------------دکمه استعلام پروانه صادراتی
  function ExportLicenseInquiry() {
    const postData = {
      urlVCodeInt: role,
      SessionID: GUid,
      CotageCode: inquiryInputsData?.cottageCode,
      CustomCode: inquiryInputsData?.customCode,
      RefMasrafCode: null,
      MasrafTypeCode: null,
      InquiryType: 0,
      OriginalCaller: 0,
      nationalcode: null,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.ObligationEliminate.CotageInquiry.url,
      method: endpoints.RestAPIs.ObligationEliminate.CotageInquiry.method,
      data: postData,
    })
      .then((res) => {
        
        if (res.data?.ErrorCode === 0) {
          setcurrencyRateType(res.data.CotageInformation.currencyRateType);
          console.log(
            res.data.CotageInformation.currencyRateType,
            "currencyRateType"
          );
          setInqueryData([res.data.CotageInformation]);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // for change comboBox--------------------------------------------------
  function changeCombox(name, value) {
    setRefMasrafCode(value);
    if (value === 5) {
      setChangeNameCombo(1);
    } else if (value === 10) {
      setChangeNameCombo(2);
    }
  }
  // inquiry function----------دکمه ی استعلام-----------------------------------------------
  function inquiry() {
    setExportLicenseInquiry(true);
    if (refId && RefMasrafCode) {
      const postData = {
        urlVCodeInt: role,
        SessionID: GUid,
        MasrafTypeCode: RefMasrafCode,
        RefID: refId,
        CotageCurCode: currencyRateType,
        // این قسمت در جدول اول ست میشود
        NationalID: "string",
        UseList: [
          {
            MasrafTypeCode: "string",
            RefID: "string",
            UseAmount: 0,
            UseRemain: 0,
            UseDate: "string",
          },
        ],
        Result: {},
        ErrorCode: 0,
        ErrorDesc: "string",
      };

      dispatch(handleLoading(true));

      axios({
        url: endpoints.RestAPIs.ObligationEliminate.SanaNimaInfoInquiry.url,
        method:
          endpoints.RestAPIs.ObligationEliminate.SanaNimaInfoInquiry.method,
        data: postData,
      })
        .then((res) => {
          if (res.data?.ErrorCode === 0) {
            if (!data.some((item) => item.RefID === refId)) {
              setData((prevData) => prevData.concat([res.data]));
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
          dispatch(handleLoading(false));
        });
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا فیلد های مورد نظر را پر کنید",
        })
      );
    }
  }

  // for button frist record-----------دکمه ی ثبت اولیه
  function fristRecord() {

    const transformedUseList = data.map((item) => ({
      MasrafTypeCode: item.MasrafTypeStr,
      RefID: item.RefID,
      UseRemainToCotageCurrency: item.UseRemainToCotageCurrency,
      UseRemainToUseCurrency: item.UseRemainAmount,
      UseCurCode: item.UseCurCode,
      UseCurNameStr: item.UseCurNameStr,
      UseAmountToUseCurrency: item.UseRemainAmount,
      UseAmountToCotageCurrency: item.UseAmountToCotageCurrency,
      UseDate: item.UseDate,
    }));
    
    const postData = {
      UseList: transformedUseList,
      UrlVcodeIntUser: role,
      SessionID: GUid,
      CotageRemainAmount: inqueryData[0].CotageRemainAmount,
      UseRemainToUseCurrency: null,
      cotageCurCode: 1,
      CotageCode: inquiryInputsData?.cottageCode,
      CustomCode: inquiryInputsData?.customCode,
      Result: null,
      ErrorCode: 0,
      ErrorDesc: "",
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.ObligationEliminate.CalculateUses.url,
      method: endpoints.RestAPIs.ObligationEliminate.CalculateUses.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setCalculateUseData(res?.data);
      
          setFinalyFlag(true);
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
  }

  const handleInquiryChangeInputs = (
    name,
    value,
    validationNameList = undefined
  ) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setInquiryErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
    setInquiryInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };


  // return function--------------------------------------
  useEffect(() => {}, [data]);
  // currencyRateType
  return (
    <Form form={form}>
      {" "}
      <Card title="درج اطلاعات پروانه صادراتی">
        <Row gutter={200}>
          <Col xs={24} md={24} lg={16}>
            <Form.Item
              initialValue={inquiryInputsData?.cottageCode}
              name="cottageCode"
            >
              <GuideBox
                tooltipTitle="«شماره سریال اظهارنامه عبارت است از کد گمرک و شماره کوتاژ صادراتی. به عنوان مثال اگر کد گمرک 50100 و شماره کوتاژ 123456 باشد شماره سریال اظهارنامه برابر است با 123456-50100»"
                GuidedComponent={
                  <SerialNumberInput
                    required
                    cottageCodeValue={inquiryInputsData.cottageCode}
                    customCodeValue={inquiryInputsData.customCode}
                    cottageCodeError={inquiryErrors.cottageCode}
                    customCodeError={inquiryErrors.customCode}
                    onChange={handleInquiryChangeInputs}
                    validations={[["required"]]}
                    title="سریال اظهارنامه"
                    customCodeRef={customCodeRef}
                    type="number"
                  />
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8} xl={8}>
            <Button
              width="90%"
              backgroundColor={themeColors.btn.darkGreen}
              onClick={ExportLicenseInquiry}
              disabled={exportLicenseInquiryFlag}
            >
              استعلام پروانه صادراتی
            </Button>
          </Col>
        </Row>
      </Card>
      <Card title="پروانه های صادراتی استعلام شده معتبر">
        <ExternalTradeNewCostManagementOfPortQuotasTable1
          data={inqueryData}
          setData={setInqueryData}
          setcurrencyRateType={setcurrencyRateType}
          disableButton={data}
        />
      </Card>
      <Card title="مصرف پروانه">
        <Row gutter={200}>
          <Col xs={24} md={24} lg={16}>
            <div
              className="ExternalTradeCostManagementOfExportQuotasInputs"
              style={{ gap: "10px" }}
            >
              <ComboBox
                title="نحوه بازگشت "
                onChange={changeCombox}
                width="186px"
                optionTitle="name"
                optionValue="value"
                options={combo}
                defaultValue={RefMasrafCode}
                maxWidth="186px"
              />

              <Input
                title={
                  changeNameCombo === 1
                    ? "شماره پیگیری رسید سنا"
                    : changeNameCombo === 2
                    ? "کد معامله"
                    : " کد"
                }
                backgroundColorLbale="#fffff"
                onChange={(name, value) => {
                  setRefId(value);
                }}
                value={refId}
              />
            </div>
          </Col>
          <Col xs={24} md={24} lg={8} xl={8}>
            <Button
              width="90%"
              disabled={!currencyRateType || finalyFlag}
              onClick={inquiry}
            >
              استعلام{" "}
            </Button>
          </Col>
        </Row>
      </Card>
      <div
        headStyle={{ background: "#ddd" }}
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <ExternalTradeNewCostManagementOfPortQuotasTable2
          data={data}
          setData={setData}
        />
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            backgroundColor={themeColors.btn.warning}
            onClick={() => {
              history.push(
                "/Users/AC/Currency/ExternalTradeCostManagementOfExportQuotas"
              );
            }}
          >
            انصراف
          </Button>

          <Button
            onClick={fristRecord}
            disabled={!currencyRateType || !data.length > 0 || finalyFlag}
          >
            ثبت اولیه
          </Button>
        </div>
      </div>
      {calculateUseData.UseList ? (
        <div
          title="محاسبه میزان مصرف کوتاژ"
          headStyle={{ background: "#ddd" }}
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <ExternalTradeNewCostManagementOfPortQuotasTable3
            data={calculateUseData}
            cottageCode={inquiryInputsData?.cottageCode}
            CustomCode={inquiryInputsData?.customCode}
          />{" "}
        </div>
      ) : (
        ""
      )}
    </Form>
  );
}
