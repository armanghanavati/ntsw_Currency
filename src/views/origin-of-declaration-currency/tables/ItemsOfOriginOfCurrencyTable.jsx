// اطلاعات اقلام منشا ارز
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ComboBox,
  Input,
  Table,
  TitleBox,
  VerticalSpace,
} from "../../../components";
import { useHistory } from "react-router-dom";
import { Col, Form, Row } from "antd";
import Validation from "../../../utils/Validation";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import themeColors from "../../../configs/theme";

const ItemsOfOriginOfCurrencyTable = ({
  loading,
  inputsData,
  errors,
  setErrors,
  setInputsData,
}) => {
  const { GUid, role } = useSelector((state) => state);
  const history = useHistory();

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const clickHandler = (id) => {
    history?.push(
      `/Users/AC/Currency/CurrencyAllocationRequestDetailPage?${id}`
    );
  };

  const columns = [
    {
      title: "نوع قلم",
      dataIndex: "prfOrderNoStr",
      align: "center",
    },
    {
      title: "مبلغ ارزی",
      dataIndex: "currency",
      align: "center",
    },
    {
      title: "نوع ارز",
      dataIndex: "sourceType",
      align: "center",
    },
    {
      title: "مبلغ معادل ثبت آماری",
      dataIndex: "carStatusStr",
      align: "center",
    },
    {
      title: "شماره رسید سنا",
      dataIndex: "carActiveStatusStr",
      align: "center",
    },
    {
      title: "شماره کوتاژ",
      dataIndex: "exportCotageID",
      align: "center",
      render: (text) => {
        if (text !== null && text !== undefined) {
          return text === 0 ? "0.00" : Number(text).toLocaleString();
        }
        return null;
      },
    },
    {
      title: "سال ترخیص",
      dataIndex: "releaseYear",
      align: "center",
    },
    {
      title: "کد گمرک",
      dataIndex: "exportCustom",
      align: "center",
    },
    {
      title: "توضیحات بازرگان",
      dataIndex: "merchantDesc",
      align: "center",
    },
    {
      title: "مهلت پرداخت",
      dataIndex: "carVCodeLng",
      align: "center",
    },
    {
      title: "حذف",
      dataIndex: "carVCodeLng",
      align: "center",
      render: (_, { id, isSelected }) => (
        <div className="flex-order-row">
          <Button
            disabled={isSelected}
            onClick={() => clickHandler(id)}
            type="secondary"
            backgroundColor={themeColors.btn.danger}
          >
            حذف
            <i class="fa fa-delete" />
          </Button>
        </div>
      ),
    },
  ];

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

  const convertCurrencyValue = () => {
    if (
      // currencyOperationType ===
      //   currencyOperationTypes.StatisticalRegistration &&
      !!inputsData?.pcsAmountLng &&
      !!inputsData?.pcscurVCodeInt
    ) {
      if (errors?.pcsAmountLng?.length === 0) {
        convertPreCotageSourceCurrencyToProformaCurrency();
      } else {
        setInputsData({
          ...inputsData,
          currencyConvertError: "در محاسبه معادل ارز خطایی رخ داده است!",
          convertCurrencyAmount: undefined,
        });
      }
    }
  };

  const convertPreCotageSourceCurrencyToProformaCurrency = (
    callServiceAgain = true
  ) => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      // prfVCodeInt,
      pcsAmountLng: inputsData?.pcsAmountLng,
      pcscurVCodeInt: inputsData?.pcscurVCodeInt,
    };
    axios({
      url: endpoints.RestAPIs.preCotageSG
        .convertPreCotageSourceCurrencyToProformaCurrency.url,
      method:
        endpoints.RestAPIs.preCotageSG
          .convertPreCotageSourceCurrencyToProformaCurrency.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
          setInputsData({
            ...inputsData,
            currencyTypeTitle: inputsData?.currencyOptions.find(
              (x) => x?.curVCodeInt === inputsData?.pcscurVCodeInt
            ),
            convertCurrencyAmount: res?.data?.Result,
            currencyConvertError: undefined,
          });
          dispatch(handleLoading(false));
        } else {
          if (callServiceAgain) {
            convertPreCotageSourceCurrencyToProformaCurrency(false);
          } else {
            dispatch(handleLoading(false));
            setInputsData({
              ...inputsData,
              currencyConvertError: "در محاسبه معادل ارز خطایی رخ داده است!",
              convertCurrencyAmount: undefined,
            });
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: res?.data?.ErrorDesc,
              })
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
        if (callServiceAgain) {
          convertPreCotageSourceCurrencyToProformaCurrency(false);
        } else {
          dispatch(handleLoading(false));
          setInputsData({
            ...inputsData,
            currencyConvertError: "در محاسبه معادل ارز خطایی رخ داده است!",
            convertCurrencyAmount: undefined,
          });
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: "در محاسبه معادل ارز خطایی رخ داده است!",
            })
          );
        }
      });
  };

  return (
    <>
      <div className="container-with-border container-with-border__contain">
        <Row>
          <Col sm={24} md={24} lg={24}>
            <TitleBox title={"اطلاعات اقلام منشا ارز"} />
          </Col>
        </Row>
        <VerticalSpace />
        <Form form={form}>
          <Row>
            <Col sm={24} md={12} xl={8}>
              <Form.Item
                initialValue={inputsData?.prfcurVCodeInt}
                name="prfcurVCodeInt"
              >
                <ComboBox
                  title="نوع منشا ارز"
                  name="prfcurVCodeInt"
                  onChange={handleChangeInputs}
                  options={inputsData?.sourceTypeList}
                  defaultValue={inputsData?.prfcurVCodeInt}
                  optionTitle="descriptionPersian"
                  optionValue="value"
                  validations={[["required"]]}
                  error={errors?.prfcurVCodeInt}
                  preventDefaultSelect={false}
                  disabled={inputsData?.disabledPrfcurVCodeInt}
                />
              </Form.Item>
            </Col>
            {inputsData?.isShowUserSourceDescriptionField && (
              <Col sm={24} md={12} xl={16}>
                <Input
                  title="توضیحات بازرگان"
                  name="pcsMerchantDescStr"
                  onChange={handleChangeInputs}
                  value={inputsData?.pcsMerchantDescStr}
                  error={errors?.pcsMerchantDescStr}
                  labelWidth="235px"
                  type="textarea"
                />
              </Col>
            )}
            {inputsData?.isShowExportInfoFields || (
              <>
                <Col sm={24} md={12} xl={8}>
                  <Form.Item
                    initialValue={inputsData?.pcsctmVCodeInt}
                    name="pcsctmVCodeInt"
                  >
                    <ComboBox
                      title="گمرک صادرکننده"
                      name="pcsctmVCodeInt"
                      onChange={handleChangeInputs}
                      options={inputsData?.exportCustomList}
                      defaultValue={inputsData?.pcsctmVCodeInt}
                      optionTitle="ctmNameStr"
                      optionValue="ctmVCodeInt"
                      validations={[["required"]]}
                      error={errors?.pcsctmVCodeInt}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} xl={8}>
                  <Input
                    title="شماره کوتاژ صادراتی"
                    name="pcsExportCotageID"
                    onChange={handleChangeInputs}
                    value={inputsData?.pcsExportCotageID}
                    error={errors?.pcsExportCotageID}
                    validations={[["required"], ["decimal", 0]]}
                    maxLength={10}
                  />
                </Col>
                <Col sm={24} md={12} xl={8}>
                  <Input
                    title="سال ترخیص"
                    name="pcsReleaseYearStr"
                    onChange={handleChangeInputs}
                    value={inputsData?.pcsReleaseYearStr}
                    error={errors?.pcsReleaseYearStr}
                    placeholder="سال(شمسی) مثال:1394"
                    validations={[["required"], ["year"]]}
                    type="number"
                    maxLength={4}
                  />
                </Col>
              </>
            )}
          </Row>
          {inputsData?.IsShowExportInfoFields && (
            <Row>
              <Col sm={24} md={12} xl={8}>
                <Form.Item
                  initialValue={inputsData?.pcscurVCodeInt}
                  name="pcscurVCodeInt"
                >
                  <ComboBox
                    title="نوع ارز"
                    name="pcscurVCodeInt"
                    onChange={handleChangeInputs}
                    options={inputsData?.currencyList}
                    defaultValue={inputsData?.pcscurVCodeInt}
                    optionTitle="curNameStr"
                    optionValue="curVCodeInt"
                    validations={[["required"]]}
                    error={errors?.pcscurVCodeInt}
                    // onBlur={convertCurrencyValue}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="مبلغ ارزی"
                  name="pcsAmountLng"
                  onChange={handleChangeInputs}
                  value={inputsData?.pcsAmountLng}
                  isCurrency={true}
                  error={errors?.pcsAmountLng}
                  validations={[["required"], ["decimal", 0]]}
                  onBlur={convertCurrencyValue}
                />
              </Col>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="مبلغ به ارز ثبت آماری"
                  name="pcsAmountLng"
                  onChange={handleChangeInputs}
                  value={inputsData?.pcsAmountLng}
                  isCurrency={true}
                  error={errors?.pcsAmountLng}
                  validations={[["required"], ["decimal", 0]]}
                  readOnly={"readOnly"}
                />
              </Col>
            </Row>
          )}
        </Form>
        <VerticalSpace />
        <Button
          // disabled={isSelected}
          onClick={() => clickHandler()}
        >
          {/* AddSourceButtonText  */}
          استعلام از بانک مرکزی
          <i class="fa fa-search" />
        </Button>
        <Row>
          <Col sm={24} md={24} lg={24}>
            <Table
              dataSource={inputsData?.dataSource}
              columns={columns}
              pagination={false}
              loading={loading}
              hasPageSizeCombo={false}
            />
          </Col>
        </Row>
      </div>
      <VerticalSpace space="2rem" />
    </>
  );
};
export default ItemsOfOriginOfCurrencyTable;
