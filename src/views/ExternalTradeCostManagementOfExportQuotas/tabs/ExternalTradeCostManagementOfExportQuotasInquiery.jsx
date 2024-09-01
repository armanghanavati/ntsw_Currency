import { Col, Form, Radio, Row, Space, Tooltip, theme } from "antd";
import { useRef, useState } from "react";
import { Button, ComboBox, EmergencyProblem, GuideBox, Input } from "../../../components";
import themeColors from "../../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import ExternalTradeCostManagementOfExportQuotasTable from "../table/ExternalTradeCostManagementOfExportQuotasTable";
import { useEffect } from "react";
import SerialNumberInput from "../../../components/SerialNumberInput";
import Validation from "../../../utils/Validation";

export default function ExternalTradeCostManagementOfExportQuotasInquiery() {
  const [radioValue, setRadioValue] = useState(0);
  const [CotageCode, setCotageCode] = useState(null);
  const [CustomCode, setCustomCode] = useState(null);
  const [CotageCode1, setCotageCode1] = useState(null);
  const [CustomCode1, setCustomCode1] = useState(null);
  const [RefMasrafCode, setRefMasrafCode] = useState(null);
  const [MasrafTypeCode, setMasrafTypeCode] = useState(null);
  const [readOnlyInputs, setReadOnlyInputs] = useState({
    0: false,
    1: true,
    2: true,
  });
  const [flag, setFlag] = useState(true);
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [combo, setCombo] = useState([]);
  const [form] = Form.useForm();
  const [inquiryInputsData, setInquiryInputsData] = useState({});
  const [inquiryErrors, setInquiryErrors] = useState({});
  const customCodeRef = useRef();
  const customCodeRef1 = useRef();

  const dispatch = useDispatch();
  // this function can het value tree radio button---------------------------
  const readioButtonChange = (e) => {
 
    form.resetFields();
    setCotageCode(null);
    setCustomCode1(null);
    setCustomCode(null);
    setCotageCode1(null);
    setMasrafTypeCode(null);
    setData([]);
    setInquiryInputsData({ customCode1: undefined })

    const value = e.target.value;
    setRadioValue(value);
    setReadOnlyInputs({
      0: value !== 0,
      1: value !== 1,
      2: value !== 2,
    });
    setFlag(value === 0 ? true : false);
  };

  // useefect to get combobox------------------------------
  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      SessionID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.ObligationEliminate.GetRefMasrafType.url,
      method: endpoints.RestAPIs.ObligationEliminate.GetRefMasrafType.method,
      data: postData,
    })
      .then((res) => {
      
        // this is set data
        const convertedData = res.data.Result.map((item) => ({
          name: item.descriptionPersian,
          value: item.value,
        }));
    

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
  //handleInquiryChangeInputs----------------------------------- 
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
 
  // function getInquiry-----------------------------------------------------------------
  function getInquiry() {
    const postData = {
      urlVCodeInt: role,
      SessionID: GUid,
      CotageCode: inquiryInputsData.cottageCode,
      CustomCode: inquiryInputsData.customCode ? inquiryInputsData.customCode : 0,
      RefMasrafCode: inquiryInputsData.MasrafTypeCode,
      MasrafTypeCode: inquiryInputsData?.RefMasrafCode,
      InquiryType: radioValue,
      OriginalCaller: 0,
      nationalcode: null,
    };
    const postData2 = {
      urlVCodeInt: role,
      SessionID: GUid,
      CotageCode: inquiryInputsData.cottageCode1,
      CustomCode: inquiryInputsData.customCode1 ? inquiryInputsData.customCode1 : 0,
      RefMasrafCode: inquiryInputsData.MasrafTypeCode,
      MasrafTypeCode: inquiryInputsData?.RefMasrafCode,
      InquiryType: radioValue,
      OriginalCaller: 0,
      nationalcode: null,
    };
    dispatch(handleLoading(true));

    axios({
      url: flag
        ? endpoints.RestAPIs.ObligationEliminate.CotageInquiry.url
        : endpoints.RestAPIs.ObligationEliminate.InquiryExportCotage.url,

      method: flag
        ? endpoints.RestAPIs.ObligationEliminate.CotageInquiry.method
        : endpoints.RestAPIs.ObligationEliminate.InquiryExportCotage.method,
      data: flag ? postData : postData2,
    })
      .then((res) => {
        // this is set data

        setData(flag ? [res.data.CotageInformation] : res.data.info);
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
  }
  // for change comboBox----------------------------
  function changeCombox(name, value) {
 


    setRefMasrafCode(value);
  }

  // return---------------------------------------------------------------------
  return (
    <Form form={form}>
      <Radio.Group
        onChange={readioButtonChange}
        value={radioValue}
        size="large"

      >
        <Space direction="vertical">
          <div className="ExternalTradeCostManagementOfExportQuotasColumn">
            <Radio value={0}>
              <span className="ExternalTradeCostManagementOfExportQuotasRaido">
                استعلام مانده کوتاژ صادراتی
              </span>
            </Radio>

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
                    readOnly={readOnlyInputs[0]}

                    customCodeRef={customCodeRef}
                    type="number"
                  />
                }
              />
            </Form.Item>
           
          </div>

          {/* radio 2 */}

          <div className="ExternalTradeCostManagementOfExportQuotasColumn" >
            <Radio value={1}>
              <span className="ExternalTradeCostManagementOfExportQuotasRaido">
                استعلام مصارف کوتاژ صادراتی
              </span>
            </Radio>
            <Form.Item
              initialValue={inquiryInputsData?.cottageCode1}
              name="cottageCode1"
       
            >
              <GuideBox
                tooltipTitle="«شماره سریال اظهارنامه عبارت است از کد گمرک و شماره کوتاژ صادراتی. به عنوان مثال اگر کد گمرک 50100 و شماره کوتاژ 123456 باشد شماره سریال اظهارنامه برابر است با 123456-50100»"
                GuidedComponent={
                  <SerialNumberInput title="سریال اظهارنامه" cottageCodeValue={inquiryInputsData.cottageCode1}
                  customCodeValue={inquiryInputsData.customCode1}
                  required
                  cottageCodeError={inquiryErrors.cottageCode1}
                  customCodeError={inquiryErrors.customCode1}

                  onChange={handleInquiryChangeInputs}
                  validations={[["required"]]}
                  focusValue="customCode1"
                  customCodeRef={customCodeRef1}
                  customCodeName="customCode1"
                  cottageCodeName="cottageCode1"
                  readOnly={readOnlyInputs[1]} />
                }
              />
            </Form.Item>
     
          </div>

          {/* radio 3 */}


          <div className="ExternalTradeCostManagementOfExportQuotasColumn">
            <Radio value={2}>
              <span className="ExternalTradeCostManagementOfExportQuotasRaido">
                استعلام براساس نحوه بازگشت ارز
              </span>
            </Radio>
            <div className="ExternalTradeCostManagementOfExportQuotasInputs">
              <div >
                <Form.Item >
                  <ComboBox
                    title="نحوه ی بازگشت "
                    onChange={handleInquiryChangeInputs}
                    width="186px"
                    optionTitle="name"
                    optionValue="value"
                    options={combo}
                    defaultValue={inquiryInputsData.RefMasrafCode}
                    maxWidth="186px"
                    minWidth="145px"
                    name="RefMasrafCode"
                    disabled={readOnlyInputs[2]}
                  />
                </Form.Item>
              </div>

              <div className="flex">
                <Input
                  title="کد"
                  onChange={handleInquiryChangeInputs}
                  value={inquiryInputsData.MasrafTypeCode}
                  readOnly={readOnlyInputs[2]}
                  name="MasrafTypeCode"
                />

              </div>
            </div>
          </div>
        </Space>
        <div className="ExternalTradeCostManagementOfExportQuotasColumn buttonInquiry">
          <div></div>
          <Button onClick={getInquiry} width="150px">
            استعلام
          </Button>
        </div>
      </Radio.Group>
      <Row
        justify="end"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      ></Row>
      <ExternalTradeCostManagementOfExportQuotasTable data={data} flag={flag} />
      <EmergencyProblem title="نیما"/>
    </Form>
  );
}
// {
//   "UrlVCodeInt": 12,
//   "SessionID": "-1",
//   "CotageCode": "305",
//   "CustomCode": 5100,
//   "RefMasrafCode": 1,
//   "MasrafTypeCode": "0",
//   "InquiryType": 0,
//   "OriginalCaller": 0,
//   "nationalcode": null
// }
