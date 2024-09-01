// قسمت استعلام پروانه در روند ساخت آگهی
import { Col, Form, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Button, ComboBox, GuideBox } from "../../../../components";
import SerialNumberInput from "../../../../components/SerialNumberInput";
import { ButtonWithRef } from "../../../../components/ButtonWithRef";
import themeColors from "../../../../configs/theme";
import Validation from "../../../../utils/Validation";
import { connect, useDispatch } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
} from "../../../../state/mapStateToProps";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";

const CottageInquiry = ({
  GUid,
  role,
  inputsData,
  options,
  tableData,
  setTableData,
  getExportCotageInquiryWithEqualPrice,
  setShowEquivilantPriceColumn,
}) => {
  const [inputsReadOnly, setInputsReadOnly] = useState(false);
  const [inquiryInputsData, setInquiryInputsData] = useState({});
  const [inquiryErrors, setInquiryErrors] = useState({
    cottageCode: [],
    customCode: [],
  });
  const [yearList, setYearList] = useState([]);
  const customCodeRef = useRef();
  const buttonRef = useRef(null);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  //  استفاده از تب برای سویچ فوکوس به اینپوت مورد نظر در فیلدهای بالای صفحه
  const handleComboBoxKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      customCodeRef.current.focus();
    }
  };

  const handleCottageCodeKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      buttonRef.current.focus();
    }
  };

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

  const handleSubmitInquiryButton = (event) => {
    if (permitForConfirmation(["yearList", "customCode", "cottageCode"])) {
      exportCottageInquiry();
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "اطلاعات درست وارد کنید.",
        })
      );
    }
  };

  const permitForConfirmation = (inputsName = []) => {
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
    const err = { ...inquiryErrors };
    inputsName.map((item) => {
      if (
        inquiryInputsData[item] === undefined ||
        inquiryInputsData[item] === null ||
        JSON.stringify(inquiryInputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setInquiryErrors(err);
    return err;
  };

  const handleAddNewCotage = (e) => {
    e.preventDefault();
    setInquiryInputsData({});
    setInquiryErrors({ cottageCode: [], customCode: [] });
    setInputsReadOnly(false);
    form.resetFields();
  };

  const getShamsiYearList = () => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
      year: "numeric",
    });
    const formatted = formatter.formatToParts(date);
    const thisYear = Number(
      formatted.find((part) => part.type === "year")?.value
    );
    const postData = {
      fromYear: thisYear - 22,
      toYear: thisYear + 1,
    };
    axios({
      ...endpoints.RestAPIs.generalData.getShamsiYearList,
      data: postData,
    }).then((res) => {
      if (res.data?.ErrorCode === 0) {
        setYearList(res.data.Result.slice().reverse());
      } else {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: res.data.ErrorDesc,
          })
        );
      }
    });
  };

  useEffect(() => {
    getShamsiYearList();
  }, []);

  const exportCottageInquiry = () => {
    dispatch(handleLoading(true));
    const postData = {
      CotageList: [],
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      year: inquiryInputsData.yearList ?? "",
      customCode: Number(inquiryInputsData.customCode),
      cotageCode: inquiryInputsData.cottageCode,
    };
    axios({
      ...endpoints.RestAPIs.declaration.saderatiCotageInquiry,
      data: postData,
    })
      .then((res) => {
        if (res.data.Error === 0) {
          setInputsReadOnly(true);
          const newTableData = [...tableData, ...res.data?.CotageList].filter(
            (item, index, array) =>
              array.findIndex(
                (t) =>
                  t?.cavCotageCodeStr === item?.cavCotageCodeStr &&
                  t?.cavctmVCodeInt === item?.cavctmVCodeInt &&
                  t?.cavYearStr === item?.cavYearStr
              ) === index
          );
          setTableData(newTableData);
          if (!!inputsData.advCurVCodeInt) {
            getExportCotageInquiryWithEqualPrice(newTableData);
          } else {
            setShowEquivilantPriceColumn(false);
          }
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  const serialNumberErrors = inquiryErrors?.cottageCode.concat(
    inquiryErrors?.customCode
  );

  return (
    <>
      <Form form={form}>
        <Row>
          <Col sm={24} md={12} lg={6}>
            <Form.Item
              initialValue={inquiryInputsData?.selectedYear}
              name="selectedYear"
            >
              <>
                <ComboBox
                  onKeyDown={handleComboBoxKeyDown}
                  width="100%"
                  title="سال"
                  name="yearList"
                  onChange={handleInquiryChangeInputs}
                  options={yearList?.map((item) => ({
                    id: item.Id,
                    name: item.Name,
                  }))}
                  defaultValue={inquiryInputsData?.yearList}
                  validations={[["required"]]}
                  error={inquiryErrors?.yearList}
                  disabled={inputsReadOnly}
                  required
                />
              </>
            </Form.Item>
          </Col>
          <Col sm={24} md={24} lg={12}>
            <Form.Item
              initialValue={inquiryInputsData?.cottageCode}
              name="cottageCode"
            >
              <GuideBox
                tooltipTitle="شماره سریال وارد کنید"
                error={serialNumberErrors}
                GuidedComponent={
                  <SerialNumberInput
                    labelWidth="100%"
                    maxWidth={120}
                    required
                    className={
                      (inquiryErrors?.cottageCode?.length > 0 ||
                        inquiryErrors?.customCode?.length > 0) &&
                      "error"
                    }
                    cottageCodeValue={inquiryInputsData.cottageCode}
                    customCodeValue={inquiryInputsData.customCode}
                    cottageCodeError={inquiryErrors.cottageCode}
                    customCodeError={inquiryErrors.customCode}
                    // error={{
                    //   customCodeError: inquiryErrors.customCode,
                    //   cottageCodeError: inquiryErrors.cottageCode,
                    // }}
                    onChange={handleInquiryChangeInputs}
                    firstValidations={[
                      ["required", "کد گمرکی الزامی است."],
                      ["maxLength", 5],
                    ]}
                    secondValidations={[
                      ["required", "کد کوتاژ الزامی است"],
                      ["maxLength", 12],
                    ]}
                    title="سریال اظهارنامه"
                    readOnly={inputsReadOnly}
                    handleCottageCodeKeyDown={handleCottageCodeKeyDown}
                    customCodeRef={customCodeRef}
                    type="number"
                  />
                }
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={12} lg={6}>
            <ButtonWithRef
              onClick={handleSubmitInquiryButton}
              width="100%"
              disabled={inputsReadOnly}
              backgroundColor={themeColors.btn.secondary}
              ref={buttonRef}
            >
              استعلام پروانه
            </ButtonWithRef>
            {tableData.length >= 0 && inputsReadOnly && (
              <Button
                onClick={handleAddNewCotage}
                width="100%"
                backgroundColor={themeColors.btn.primary}
              >
                <i className="fa fa-plus"></i>
                افزودن پروانه جدید
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
  };
  return states;
};

export default connect(mapStateToProps)(CottageInquiry);
