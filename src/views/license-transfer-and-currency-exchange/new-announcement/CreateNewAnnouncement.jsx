// صفحه ساخت آگهی جدید
import { Card, Col, Row, Table as AntTable, Checkbox } from "antd";
import { Button, Modal, Table, VerticalSpace } from "../../../components";
import themeColors from "../../../configs/theme";
import React, { useEffect, useState } from "react";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
  mapMessageModalStateToProps,
  mapThemeStateToProps,
} from "../../../state/mapStateToProps";
import { connect, useDispatch } from "react-redux";
import moment from "jalali-moment";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";

import StringHelpers from "../../../configs/helpers/string-helpers";
import { useHistory } from "react-router-dom";
import convertJalaliDateToGregorian from "../../../configs/helpers/convert-jalali-date-to-gregorian";
import AnnouncementInputs from "./common/AnnouncementInputs";
import CottageInquiry from "./common/CottageInquiry";
import Guide from "../../../common/currency-origin/goods/Guide";

const CreateNewAnnouncement = ({ role, GUid, messageModal, theme }) => {
  const [inputsData, setInputsData] = useState({ advRialiConditions: 2 });
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [showEquivilantPriceColumn, setShowEquivilantPriceColumn] =
    useState(false);
  const [remainPrice, setRemainPrice] = useState(0);
  const [remainPriceCurrencyType, setRemainPriceCurrencyType] = useState();
  const [showFirstConfirmModal, setShowFirstConfirmModal] = useState(false);
  const [showSecondConfirmModal, setShowSecondConfirmModal] = useState(false);
  const [showFinalConfirmModal, setShowFinalConfirmModal] = useState(false);

  const [finalConfirmModalCheckbox, setFinalConfirmModalCheckbox] =
    useState(false);
  const [confirmRedirectModalStatus, setConfirmRedirectModalStatus] =
    useState(false);

  const history = useHistory();

  const dispatch = useDispatch();

  const columns = [
    {
      title: "سال",
      dataIndex: "cavYearStr",
      align: "center",
    },
    {
      title: "گمرک",
      dataIndex: "ctmNameStr",
      align: "center",
    },
    {
      title: "کوتاژ",
      dataIndex: "cavCotageCodeStr",
      align: "center",
    },
    {
      title: "ارز",
      dataIndex: "curNameStr",
      align: "center",
    },
    {
      title: "تاریخ ارزیابی",
      dataIndex: "cavArzyabiDate",
      align: "center",
    },
    {
      title: "مهلت بازگردانی (روز)",
      dataIndex: "cavRollBackDeadline",
      align: "center",
    },
    {
      title: "تاریخ سررسید",
      dataIndex: "cavTarikhSarresid",
      align: "center",
    },
    {
      title: "نوع نرخ ارز",
      dataIndex: "cavCurrencyRateTypeStr",
      align: "center",
    },
    {
      title: "مبلغ کل",
      dataIndex: "cavTotalPriceMny",
      align: "center",
      render: (value) => <span>{StringHelpers.formatNumber(value)}</span>,
    },
    {
      title: "مانده",
      dataIndex: "cavRemainPriceMny",
      align: "center",
      render: (value) => <span>{StringHelpers.formatNumber(value)}</span>,
    },
    ...(showEquivilantPriceColumn
      ? [
          {
            title: () => {
              return (
                <Guide
                  headerTitle={`معادل مقدار مانده پروانه به ${
                    remainPriceCurrencyType.curNameStr ?? ""
                  } `}
                  tooltipTitle={
                    <p>
                      در این ستون معادل مانده هر یک از پروانه ها بر اساس نرخ
                      تبدیل ارز پروانه و ارز انتخابی نمایش داده می شود. <br />
                      <span style={{ color: "red" }}>تذکر :</span> نرخ تبدیل بین
                      ارزها بر اساس نرخ تبدیل روزانه اعلام شده توسط بانک مرکزی
                      محاسبه شده است.
                    </p>
                  }
                />
              );
            },
            dataIndex: "RemainPriceMnyBySupplyCurrency",
            align: "center",
            className: "green-column-background",
            render: (value) => (
              <span style={{ color: themeColors.light?.text }}>
                {StringHelpers.formatNumber(value)}
              </span>
            ),
          },
        ]
      : []),
    {
      title: "عملیات",
      align: "center",
      render: (item, { cavVCodeLng }, index) => (
        <span className="flex-order-row">
          <Button
            onClick={(e) => deleteRow(e, cavVCodeLng)}
            type="secondary"
            backgroundColor={themeColors.btn.danger}
          >
            حذف
          </Button>
        </span>
      ),
    },
  ];

  const deleteRow = (e, id) => {
    e.preventDefault();
    const newTableData = tableData.filter((item) => item.cavVCodeLng !== id);
    setTableData(newTableData);
    if (!!inputsData?.advCurVCodeInt) {
      getExportCotageInquiryWithEqualPrice(newTableData);
    }
    if (newTableData.length === 0) {
      setShowEquivilantPriceColumn(false);
    }
  };

  const getExportCotageInquiryWithEqualPrice = (CotageList = []) => {
    if (CotageList.length <= 0) return;
    dispatch(handleLoading(true));
    const newArray = CotageList.filter(
      (item, index, array) =>
        array.findIndex(
          (t) =>
            t?.cavCotageCodeStr === item?.cavCotageCodeStr &&
            t?.cavctmVCodeInt === item?.cavctmVCodeInt &&
            t?.cavYearStr === item?.cavYearStr
        ) === index
    );
    const postData = {
      CotageList: newArray.map((item) => item.cavVCodeLng),
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      // year: inquiryInputsData?.year,
      // customCode: Number(inquiryInputsData?.customCode),
      // cotageCode: inquiryInputsData?.cottageCode,
      advcurVcodeInt: inputsData?.advCurVCodeInt,
    };
    axios({
      ...endpoints.RestAPIs.declaration.saderatiCotageInquiryWithEqualPrice,
      data: postData,
    })
      .then((res) => {
        if (res.data.Error === 0) {
          setShowEquivilantPriceColumn(true);
          setTableData(res.data?.CotageList);
          setRemainPrice(res.data?.RemainPriceMnyByAdviseCurrencySum);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    if (!!inputsData.advCurVCodeInt && tableData.length > 0) {
      getExportCotageInquiryWithEqualPrice(tableData);
    }
  }, [inputsData.advCurVCodeInt]);

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputsData[item] === undefined ||
        inputsData[item] === null ||
        String(inputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });

    setErrors(err);
    return err;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    hideModal3();
    const { year, month, day, hour, minute } = inputsData?.showInBoardTime;

    const hourString =
      String(hour).length === 1 ? "0" + String(hour) : String(hour);
    const minuteString =
      String(minute).length === 1 ? "0" + String(minute) : String(minute);
    const postData = {
      SaderatCotageList: tableData,
      sessionID: GUid,
      advUserCode: role,
      advCurVCodeInt: inputsData?.advCurVCodeInt,
      advAmount: inputsData?.advAmount,
      advCountryName: inputsData?.countryList ?? "",
      advBankName: inputsData?.bnkNameEnStr ?? "",
      advUnitPriceMny: Number(inputsData?.advUnitPriceMny),
      advCurrencyCoefficient: 0,
      advDealConditions: inputsData?.description ?? "",
      advShowTime: `${convertJalaliDateToGregorian(
        inputsData?.showInBoardTime
      )}T${hourString}:${minuteString}:00`,
      advRialiConditions: inputsData?.advRialiConditions,
      advDisplayName: inputsData?.ShowName,
      advNameStr: inputsData?.name,
      advPhoneNumber: inputsData?.phoneNumber,
    };

    axios({
      ...endpoints.RestAPIs.declaration.createAdvitise,
      data: postData,
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          setConfirmRedirectModalStatus(true);
          dispatch(
            handleMessageModal({
              name: "CONFIRM_ADDED_ANNOUNCEMENT",
              isModalOpen: true,
              describe: (
                <span>
                  آگهی شما با کد «
                  <span className="confirm-modal-describe">
                    {res.data?.ErrorDesc}
                  </span>
                  » با موفقیت ثبت گردید
                </span>
              ),
              type: "success",
            })
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (confirmRedirectModalStatus === true) {
      if (messageModal.isModalOpen === false) {
        history.push("LicenseTransferAndCurrencyExchange");
      }
    }
  }, [messageModal.isModalOpen]);

  const handleSubmitModal = (event) => {
    const permit = permitForConfirmation([
      "advCurVCodeInt",
      "advAmount",
      "showInBoardTime",
      "ShowName",
      "name",
      "phoneNumber",
    ]);
    if (permit === true && tableData.length > 0) {
      setShowFirstConfirmModal(true);
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            tableData.length <= 0
              ? "حداقل یک پرونده صادراتی اضافه کنید"
              : "تمام اطلاعات لازم را پر نمایید.",
        })
      );
    }
  };

  const hideModal1 = () => {
    setShowFirstConfirmModal(false);
  };
  const hideModal2 = () => {
    setShowSecondConfirmModal(false);
  };
  const hideModal3 = () => {
    setShowFinalConfirmModal(false);
  };

  const confirmFirstModal = () => {
    setShowFirstConfirmModal(false);
    setShowSecondConfirmModal(true);
  };
  const confirmSecondModal = () => {
    setShowSecondConfirmModal(false);
    setShowFinalConfirmModal(true);
  };

  const checkBoxChange = (e) => {
    setFinalConfirmModalCheckbox((prevCheckBox) => !prevCheckBox);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <Card
        className="card-shadow"
        headStyle={{
          backgroundColor: themeColors[theme]?.menueBg,
          borderBottom: `1px solid ${themeColors[theme]?.brdcrumbSlash}`,
          color: themeColors[theme]?.text,
        }}
        title="درج اطلاعات پروانه صادراتی"
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
      >
        <CottageInquiry
          tableData={tableData}
          setTableData={setTableData}
          getExportCotageInquiryWithEqualPrice={
            getExportCotageInquiryWithEqualPrice
          }
          inputsData={inputsData}
          setShowEquivilantPriceColumn={setShowEquivilantPriceColumn}
        />
      </Card>

      <VerticalSpace space="1rem" />

      <Card
        className="card-shadow"
        headStyle={{
          backgroundColor: themeColors[theme]?.menueBg,
          borderBottom: `1px solid ${themeColors[theme]?.brdcrumbSlash}`,
          color: themeColors[theme]?.text,
        }}
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        title="پروانه‌های صادراتی استعلام شده معتبر"
      >
        <Table
          pagination={false}
          dataSource={tableData}
          columns={columns}
          hasPageSizeCombo={false}
          summary={(data) => {
            if (showEquivilantPriceColumn)
              return (
                <>
                  <AntTable.Summary.Row
                    style={{
                      backgroundColor: themeColors[theme]?.menueBg,
                    }}
                  >
                    <AntTable.Summary.Cell
                      align="center"
                      index={0}
                      colSpan={10}
                      className="green-column-background"
                    >
                      <span style={{ color: themeColors.light?.text }}>
                        مجموع معادل مقدار مانده پروانه‌ها
                      </span>
                    </AntTable.Summary.Cell>
                    <AntTable.Summary.Cell
                      className="green-column-background"
                      align="center"
                      index={1}
                    >
                      <span style={{ color: themeColors.light?.text }}>
                        {StringHelpers.formatNumber(remainPrice)}
                      </span>
                    </AntTable.Summary.Cell>
                  </AntTable.Summary.Row>
                </>
              );
          }}
        />
      </Card>

      <VerticalSpace space="2rem" />

      <AnnouncementInputs
        errors={errors}
        setErrors={setErrors}
        inputsData={inputsData}
        setInputsData={setInputsData}
        setRemainPriceCurrencyType={setRemainPriceCurrencyType}
      />

      <div className="steps-action">
        <Button onClick={goBack}>
          <i className="fa fa-share" />
          انصراف
        </Button>
        <Button onClick={handleSubmitModal}>
          ثبت و اتمام
          <i className="fa fa-arrow-left" />
        </Button>
      </div>
      {showFirstConfirmModal && (
        <Modal
          open={showFirstConfirmModal}
          onCancel={hideModal1}
          title="تائیدیه ثبت آگهی جدید"
          footer={[
            <Button
              backgroundColor={themeColors.btn.secondary}
              onClick={confirmFirstModal}
            >
              تایید
            </Button>,
          ]}
        >
          <p>
            هدف از ایجاد قابلیت درج آگهی واگذاری پروانه صادراتی، صرفا تسهیل در
            ارتباطات بازرگانان بوده و سامانه جامع تجارت مسئولیتی در قبال تعهدات
            طرفین معامله نسبت به یکدیگر به عهده ندارد.
          </p>
        </Modal>
      )}
      {showSecondConfirmModal && (
        <Modal
          open={showSecondConfirmModal}
          onCancel={hideModal2}
          title="تائیدیه ثبت آگهی جدید"
          footer={[
            <span>
              جهت مشاهده راهنمای فرآیند واگذاری پروانه های صادراتی اینجا کلیک
              نمایید
            </span>,
            <Button
              backgroundColor={themeColors.btn.secondary}
              onClick={confirmSecondModal}
            >
              تایید
            </Button>,
            <Button
              backgroundColor={themeColors.btn.danger}
              onClick={hideModal2}
            >
              بازگشت
            </Button>,
          ]}
        >
          <p>
            رفع تعهد بازگشت ارز حاصل از صادرات برای صادرکنندگان، منوط به طی
            نمودن کامل فرآیند و ثبت اطلاعات پروانه صادراتی در بانک عامل توسط
            واردکننده خواهد بود و ثبت آگهی به خودی خود موجب رفع تعهد نمی گردد.
          </p>
        </Modal>
      )}
      {showFinalConfirmModal && (
        <Modal
          open={showFinalConfirmModal}
          onCancel={hideModal3}
          title="تائیدیه ثبت آگهی جدید"
          width={750}
          footer={[
            <Button
              backgroundColor={themeColors.btn.secondary}
              onClick={handleSubmit}
              disabled={finalConfirmModalCheckbox ? false : true}
            >
              تایید
            </Button>,
            <Button
              backgroundColor={themeColors.btn.danger}
              onClick={hideModal3}
            >
              بازگشت
            </Button>,
          ]}
        >
          <Row justify="center">
            <Col lg={22} sm={22} md={22}>
              <Checkbox
                checked={finalConfirmModalCheckbox}
                onChange={checkBoxChange}
              >
                <p>
                  بدین وسیله تعهد می کنم که به مبلغ مندرج در این آگهی ارز در
                  اختیار داشته و در صورت معامله با واردکننده، آن را در اختیار وی
                  قرار دهم. در غیر این صورت مسئولیت کلیه عواقب حقوقی آن به عهده
                  اینجانب می باشد.
                </p>
              </Checkbox>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
    ...mapMessageModalStateToProps(state),
    ...mapThemeStateToProps(state),
  };
  return states;
};
export default connect(mapStateToProps)(CreateNewAnnouncement);
