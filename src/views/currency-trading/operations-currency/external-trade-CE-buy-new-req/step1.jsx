import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Step2 from "./step2";
import { Col, Modal, Row, Table, Tooltip } from "antd";
import { Button, ComboBox, Input } from "../../../../components";
import Validation from "../../../../utils/Validation";
import themeColors from "../../../../configs/theme";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
const Step1 = ({ inputsData, setInputsData, errors, setErrors, editingId }) => {
  const [showModale, setShowModale] = useState(false);
  const [otheCodes, setOtheCodes] = useState(undefined);
  const [countryList, setcountryList] = useState(undefined);
  const dispatch = useDispatch();
  const { role, GUid, theme, colorMode, stepsOfCreatePage } = useSelector(
    (state) => state
  );
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
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

  const select = (e, record) => {
    e.preventDefault();
    setInputsData((prvs) => ({
      ...prvs,
      bnkNameEnStr: record?.bnkNameEnStr,
      bnkSwiftCodeStr: record?.bnkSwiftCodeStr,
    }));
    setErrors((prevstate) => {
      return {
        ...prevstate,
        bnkNameEnStr: [],
        bnkSwiftCodeStr: [],
      };
    });

    setShowModale(false);
  };

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },
    {
      title: "کد",
      dataIndex: "bnkSwiftCodeStr",
      align: "center",
    },
    {
      title: "عنوان",
      dataIndex: "bnkNameEnStr",
      align: "center",
    },
    {
      title: "کشور مقصد",
      dataIndex: "cnyNameStr",
      align: "center",
    },
    {
      title: "انتخاب",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={(e) => select(e, record)}
            backgroundColor={themeColors.btn.secondary}
          >
            <i class="fa fa-check" />
            انتخاب
          </Button>
        </div>
      ),
    },
  ];

  const getDestinationBankList = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      bnkNameEnStr: inputsData?.bnkNameEnStrr || null,
      bnkSwiftCodeStr: inputsData?.bnkSwiftCodeStrr || null,
      startIndex: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getDestinationBankList.url,
      method: endpoints.RestAPIs.buyCurrency.getDestinationBankList.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          setInputsData({
            ...inputsData,
            sarrafiCompanyList: res?.data?.sarrafiCompanyList,
          });
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

  const getCountryListByListNew = () => {
    const postData = {
      urlVCodelogin: role,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getCountryListByListNew.url + role,
      method: endpoints.RestAPIs.buyCurrency.getCountryListByListNew.method,
      data: postData,
    })
      .then((res) => {
        setcountryList(res?.data);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  const getSarrafiPaymentAccountType = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt: 0,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSarrafiPaymentAccountType.url,
      method:
        endpoints.RestAPIs.buyCurrency.getSarrafiPaymentAccountType.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          setOtheCodes(res?.data?.sarrafiPaymentAccountTypeList);
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

  const openModal = (e) => {
    e.preventDefault();
    setShowModale(true);
  };

  useEffect(() => {
    getDestinationBankList();
  }, [!!inputsData?.sfrVCodeInt]);

  useEffect(() => {
    getSarrafiPaymentAccountType();
    getCountryListByListNew();
  }, []);

  return (
    <div>
      {stepsOfCreatePage.CNR === 1 && (
        <>
          <div
            style={{
              boxShadow: "0 0 3px rgba(0,0,0,.2)",
              borderRadius: "2px",
              padding: "15px 10px 0 15px",
              marginTop: "30px",
            }}
          >
            <Col sm={24} md={16} xl={16} style={{ padding: "0 1px 0 5px" }}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Input
                    value={inputsData?.bnkNameEnStr}
                    name="bnkNameEnStr"
                    onChange={handleChangeInputs}
                    validations={[["required"]]}
                    error={errors?.bnkNameEnStr}
                    required
                    type="text"
                    labelWidth="150px"
                    space="5px"
                    title="بانک مقصد"
                  />
                </div>
                <Button
                  className="btn-destination-bank"
                  backgroundColor={themeColors.btn.content}
                  onClick={openModal}
                >
                  <i class="fa fa-search" />
                </Button>
                <Tooltip title="با کلیک بر روی علامت ذره بین، می توانید بانک مقصد را انتخاب کنید. در صورتی که نام بانک مورد نظر در لیست موجود نبود می توانید در همین فیلد به صورت دستی آن را تایپ نمایید.">
                  <span>
                    <div className="tooltip-company-profile">
                      <i
                        className="fa fa-2x fa-question-circle no-margin success"
                        style={{ fontSize: "1.5em", color: "#53a93f" }}
                      />
                      <div className="tooltip-animation" />
                    </div>
                  </span>
                </Tooltip>
              </div>
            </Col>
            <Modal
              className="questionModal"
              style={{
                backgroundColor: themeColors[theme]?.menueBg,
                color: themeColors[theme]?.text,
              }}
              onCancel={() => setShowModale(false)}
              footer={[<div></div>]}
              open={showModale}
              title={"انتخاب بانک مقصد"}
            >
              <div style={{ padding: "10px" }}>
                <Row>
                  <Col sm={24} md={12} xl={10}>
                    <Input
                      title="کد سوئیفت"
                      value={inputsData?.bnkSwiftCodeStrr}
                      name="bnkSwiftCodeStrr"
                      onChange={handleChangeInputs}
                      // validations={[["required"]]}
                      // error={errors?.bnkSwiftCodeStrr}
                    />
                  </Col>
                  <Col sm={24} md={12} xl={10}>
                    <Input
                      title="بانک مقصد"
                      value={inputsData?.bnkNameEnStrr}
                      name="bnkNameEnStrr"
                      onChange={handleChangeInputs}
                      // validations={[["required"]]}
                      // error={errors?.bnkNameEnStrr}
                    />
                  </Col>
                  <Col sm={24} md={12} xl={4}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Button onClick={getDestinationBankList}>جستجو</Button>
                    </div>
                  </Col>
                </Row>
                <span className="page-size-combo">
                  <label className="page-size-combo--label" htmlFor="page-size">
                    نمایش محتویات
                  </label>
                  <select
                    className="page-size-combo--selector"
                    id="page-size"
                    value={tableParams.pagination.pageSize}
                    onChange={handleChangePageSize}
                  >
                    <option
                      value="10"
                      style={{
                        backgroundColor: themeColors[theme]?.bg,
                      }}
                    >
                      10
                    </option>
                    <option
                      value="25"
                      style={{
                        backgroundColor: themeColors[theme]?.bg,
                      }}
                    >
                      25
                    </option>
                    <option
                      value="50"
                      style={{
                        backgroundColor: themeColors[theme]?.bg,
                      }}
                    >
                      50
                    </option>
                    <option
                      value="100"
                      style={{
                        backgroundColor: themeColors[theme]?.bg,
                      }}
                    >
                      100
                    </option>
                  </select>
                </span>
                <Table
                  dataSource={inputsData?.sarrafiCompanyList}
                  columns={columns}
                  pagination={tableParams.pagination}
                  // loading={loading}
                  onChange={handleTableChange}
                  onHeaderRow={() => {
                    return {
                      style: { backgroundColor: colorMode },
                    };
                  }}
                />
              </div>
            </Modal>
            <Row>
              <Col sm={24} md={12} xl={8}>
                <Input
                  value={inputsData?.bnkSwiftCodeStr}
                  name="bnkSwiftCodeStr"
                  onChange={handleChangeInputs}
                  validations={[["required"]]}
                  error={errors?.bnkSwiftCodeStr}
                  labelWidth="150px"
                  space="5px"
                  title="کد سوئیفت"
                  required
                />
              </Col>
              <Col sm={24} md={12} xl={8}>
                <ComboBox
                  title="سایر کدها"
                  defaultValue={inputsData?.sfrOtherPaymentCodeStr}
                  name="sfrOtherPaymentCodeStr"
                  onChange={handleChangeInputs}
                  options={otheCodes}
                  width="150px"
                  optionTitle="sptNameStr"
                  optionValue="sptVCodeInt"
                  // validations={[["required"]]}
                  // error={errors?.sfrOtherPaymentCodeStr}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12} xl={8}>
                <ComboBox
                  title="کشور مقصد"
                  defaultValue={inputsData?.sfrcnyVCodeIntDestination}
                  name="sfrcnyVCodeIntDestination"
                  onChange={handleChangeInputs}
                  options={countryList}
                  width="150px"
                  optionTitle="CountryName"
                  optionValue="CountryCode"
                  validations={[["required"]]}
                  error={errors?.sfrcnyVCodeIntDestination}
                />
              </Col>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="آدرس بانک"
                  value={inputsData?.sfrbnkAddressStr}
                  name="sfrbnkAddressStr"
                  onChange={handleChangeInputs}
                  validations={[["required"]]}
                  error={errors?.sfrbnkAddressStr}
                  labelWidth="150px"
                  type="text"
                  space="5px"
                />
              </Col>
            </Row>
          </div>{" "}
          <div
            style={{
              boxShadow: "0 0 3px rgba(0,0,0,.2)",
              borderRadius: "2px",
              padding: "15px 10px 0 15px",
              marginTop: "30px",
            }}
          >
            <Row>
              <Col sm={24} md={12} xl={8}>
                <Input
                  value={inputsData?.sfrBeneficiaryNameStr}
                  name="sfrBeneficiaryNameStr"
                  onChange={handleChangeInputs}
                  validations={[["required"]]}
                  error={errors?.sfrBeneficiaryNameStr}
                  labelWidth="150px"
                  type="text"
                  space="5px"
                  title="صاحب حساب"
                  required
                />
              </Col>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="آدرس"
                  value={inputsData?.sfrBeneficiaryAddressStr}
                  name="sfrBeneficiaryAddressStr"
                  onChange={handleChangeInputs}
                  validations={[["required"]]}
                  error={errors?.sfrBeneficiaryAddressStr}
                  labelWidth="150px"
                  type="text"
                  space="5px"
                />
              </Col>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="تلفن/فکس"
                  value={inputsData?.sfrBeneficiaryTelAndFaxStr}
                  name="sfrBeneficiaryTelAndFaxStr"
                  onChange={handleChangeInputs}
                  validations={[["required"]]}
                  error={errors?.sfrBeneficiaryTelAndFaxStr}
                  labelWidth="150px"
                  type="number"
                  space="5px"
                />
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="شماره حساب"
                  value={inputsData?.sfrAccountNumDestinationStr}
                  name="sfrAccountNumDestinationStr"
                  onChange={handleChangeInputs}
                  labelWidth="150px"
                  type="text"
                  space="5px"
                />
              </Col>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="IBAN"
                  value={inputsData?.sfrIBANStr}
                  name="sfrIBANStr"
                  onChange={handleChangeInputs}
                  validations={[["required"]]}
                  error={errors?.sfrIBANStr}
                  labelWidth="150px"
                  type="text"
                  space="5px"
                />
              </Col>
            </Row>
          </div>
        </>
      )}
      {stepsOfCreatePage.CNR === 2 && (
        <Step2
          inputsData={inputsData}
          setInputsData={setInputsData}
          errors={errors}
          setErrors={setErrors}
          editingId={editingId}
        />
      )}
    </div>
  );
};

export default Step1;
