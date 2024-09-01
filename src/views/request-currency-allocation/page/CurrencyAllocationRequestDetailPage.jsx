import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import { useEffect } from "react";
import { useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Row } from "antd";
import { Button, Input, Table } from "../../../components";
import themeColors from "../../../configs/theme";
import CurrencyAllocationRequestButtons from "./CurrencyAllocationRequestButtons";
import QuickGuide from "../../../components/QuickGuide";
import EmergingProblem from "../../currency-trading/emerging-problem/emerging-problem";
function CurrencyAllocationRequestDetailPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const history = useHistory();
  const [data, setData] = useState(null);
  const [dataButton, setDataButton] = useState({});
  const [
    AllocatedAmountInRequestCurrencyFlag,
    setAllocatedAmountInRequestCurrencyFlag,
  ] = useState(false);
  const [
    OrganizationViewPointInquiryButtonVisibility,
    setOrganizationViewPointInquiryButtonVisibility,
  ] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
  const [enabled, setEnabled] = useState(false);
  //   useeffect for get data for datagrid
  useEffect(() => {
    const postData = {
      carVCodeLng: location?.search.substring(1),
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .GetCurrencyAllocationRequestDetailPage.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .GetCurrencyAllocationRequestDetailPage.method,
      data: postData,
    })
      .then((res) => {
        setData(res?.data);

        if (res?.data?.ErrorCode === 0) {
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
  }, [location.search.substring(1)]);
  // columns for datagrid-----------------------------
  const ItemModalHandler = (event) => {
    event.preventDefault();
    setEnabled(!enabled);
  };
  const steps = [
    {
      element: "#main",
      intro: `1)
      در این صفحه می توانید اطلاعات کامل درخواست تخصیص ارز خود را مشاهده فرمایید.`,
      position: "left",
    },
    {
      element: "#two",
      intro: `2)
     این فیلد وضعیت کنونی درخواست تخصیص ارز شما را نشان می دهد. وضعیت های درخواست تخصیص ارز شامل موارد ذیل است:

     <br>- منتظر ارسال به بانک: درخواست تخصیص منتظر ارسال به بانک مرکزی است و به زودی ارسال نهایی می شود.
     <br>- منتظر تائید ضوابط مشروط: درخواست تخصیص ارز مشمول شرایطی است که نیاز به تائید شما دارد، در فیلد پاسخ بانک می توانید شرایط را مطالعه و با گزینه های "تائید شروط" یا "رد شروط" در پایین صفحه نتیجه مد نظر خود را اعمال نمایید.

     <br>- منتظر بررسی بانک: درخواست تخصیص ارز منتظر تائید کارشناسان بانک عامل است.

     <br>- منتظر بررسی کارشناس بانک مرکزی: درخواست تخصیص ارز مشمول شرایط خاص بوده و منتظر تائید کارشناسان بانک مرکزی است.

     <br>- آماده برای تخصیص: درخواست تخصیص ارز در صف تخصیص ارز بانک مرکزی قرار دارد.

     <br>- تخصیص یافته: درخواست تخصیص ارز تائید نهایی شده است.

     <br>- رد شده: درخواست تخصیص ارز مورد تائید قرار نگرفته است.
     
     <br>- ابطال: درخواست تخصیص ارز توسط باطل شده است.`,
      position: "left",
    },
    {
      element: "#three",
      intro: `3)
    این فیلد فرایند کنونی که روی درخواست شما در حال انجام است را نمایش می دهد. اگر در حال حاضر درخواست منتظر هیچ فرایندی نباشد مقدار این فیلد "اتمام" است، در غیر این صورت می تواند "در حال ایجاد"، "درحال ویرایش"، "درحال تجزیه"، "درحال بروزرسانی" و یا "درحال ابطال" باشد.`,

      position: "left",
    },
    {
      element: "#four",
      intro: `
      4)
      این فیلد آخرین پاسخ دریافتی از بانک نسبت به درخواست های شما را نشان می دهد.`,
      position: "left",
    },
    {
      element: "#five",
      intro: `5)
در صورتیکه درخواست شما تخصیص گرفته باشد، این فیلد تاریخ تائید نهایی درخواست تخصیص ارز شما را نشان می دهد. در حالت عادی (در صورتیکه مدت به ماه صفر باشد.) از این روز تا پایان مهلت انقضا برای خرید ارز فرصت دارید.`,
      position: "left",
    },
    {
      element: "#six",
      intro: `6)
در صورتیکه به درخواست فایل مستندی پیوست کرده باشید در این جدول قابل ملاحظه خواهد بود. با زدن دکمه"دانلود" در ستون عملیات می توانید فایل مد نظر را مشاهده نمایید.`,
      position: "left",
    },
    {
      element: "#seven",
      intro: `7)
در این قسمت متناسب با وضعیت درخواست تخصیص ارز می توانید فرایند های جدید مانند "ویرایش"، "انصراف از فرایند"، "تجزیه" یا "ابطال" را روی درخواست تخصیص آغاز نمایید. توجه نمایید این فرایند ها در همه ی وضعیت ها قابل انجام نیست و متناسب با وضعیت فعلی درخواست گزینه هریک از فرایند ها به شما نمایش داده خواهد شد.`,
      position: "left",
    },
    {
      element: "#eight",
      intro: `8)
با زدن دکمه "بازگشت" صفحه جزئیات درخواست تخصیص بسته می شود و  به منوی اصلی باز خواهید گشت.`,
      position: "left",
    },
  ];
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
      title: " نام سند ",
      dataIndex: "DocumentName",
      align: "center",
    },
    {
      title: "پسوند فایل ",
      dataIndex: "DocumentFormat",
      align: "center",
    },
    {
      title: "عملیات",
      dataIndex: "DocumentId",
      align: "center",
      render: (record, index) => (
        <div className="flex-order-row">
          <Button
            name={`linkToDetails-${index}`}
            type="secondary"
            onClick={() => {
              getDocumentData(record);
            }}
          >
            دانلود
            <i class="fa fa-download" />
          </Button>
        </div>
      ),
    },
  ];
  // function get documnet data-------------------------------
  function downloadDocument(data, format, filename) {
    const byteCharacters = atob(data);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: format });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // link.download removed to prevent download
    document.body.appendChild(link);

    // Open a new window or tab with the image
    const newWindow = window.open();
    newWindow.document.write(`<img src="${link.href}" alt="${filename}">`);
    newWindow.document.close();

    document.body.removeChild(link);

    // Revoke the Blob URL after the image has loaded in the new window
    link.onload = () => {
      URL.revokeObjectURL(link.href);
    };
  }
  // function getDocument Data -----------------------
  function getDocumentData(id) {
    const postData = {
      DocumentId: id,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .GetCurrencyAllocationRequestDocument.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .GetCurrencyAllocationRequestDocument.method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        downloadDocument(
          res?.data?.documentInfo?.DocumentByteByBase64String,
          res?.data?.documentInfo?.DocumentFormat,
          res?.data?.documentInfo?.DocumentName
        );

        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // return functipn-------------------------------------------
  return (
    <QuickGuide enabled={enabled} setEnabled={setEnabled} steps={steps} don>
      <div
        title="جزئیات"
        headStyle={{ background: "#ddd" }}
        style={{
          textAlign: "center",
          marginBottom: "20px",
          boxShadow: "0 0 3px rgba(0,0,0,.2)",
          marginTop: "20px",
        }}
        id="main"
      >
        {data ? (
          <>
            <Row>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title="  شماره پرونده"
                  value={data?.CurrencyAllocationRequest?.prfVCodeInt}
                  readOnly
                 centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title="  شماره ثبت سفارش"
                  value={data?.CurrencyAllocationRequest?.prfOrderNoStr}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" شماره ردیف"
                  value={data?.CurrencyAllocationRequest?.carRowNoInt}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" نسخه "
                  value={data?.CurrencyAllocationRequest?.carVersionInt}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12} xl={6} id="two">
                {" "}
                <Input
                  title=" وضعیت"
                  value={data?.CurrencyAllocationRequest?.carStatusStr}
                  readOnly
                />
              </Col>
              <Col xs={24} md={12} xl={6} id="three">
                {" "}
                <Input
                  title=" فرایند فعلی"
                  value={data?.CurrencyAllocationRequest?.carActiveStatusStr}
                  readOnly
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" مبلغ درخواست"
                  value={data?.CurrencyAllocationRequest?.carAmountMny}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" ارز درخواست "
                  value={data?.CurrencyAllocationRequest?.carcurNameStr}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" مبلغ به ارز ثبت سفارش"
                  value={
                    data?.CurrencyAllocationRequest
                      ?.carAmountInProformaCurrencyMny
                  }
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title="ارز ثبت سفارش "
                  value={data?.CurrencyAllocationRequest?.prfcurNameStr}
                  readOnly
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" نام بانک"
                  value={data?.CurrencyAllocationRequest?.bnkNameStr}
                  readOnly
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" نام شعبه بانک"
                  value={data?.CurrencyAllocationRequest?.bchNameStr}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title="  شماره درخواست بازرگانی"
                  value={data?.CurrencyAllocationRequest?.carRequestCodeLng}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6}>
                {" "}
                <Input
                  title=" تاریخ ایجاد"
                  value={data?.CurrencyAllocationRequest?.carCreateDateShamsi}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6} id="five">
                {" "}
                <Input
                  title=" تاریخ تخصیص"
                  value={data?.CurrencyAllocationRequest?.carIssueDateShamsi}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={6} id="five">
                {" "}
                <Input
                  title=" تاریخ تایید"
                  value={data?.CurrencyAllocationRequest?.carApprovedDateShamsi}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={24} xl={24} id="four">
                {" "}
                <Input
                  title=" پاسخ بانک"
                  value={data?.CurrencyAllocationRequest?.carBankResultStr}
                  readOnly
                  type="textarea"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title="  نوع معامله"
                  value={data?.CurrencyAllocationRequest?.cdtNameStr}
                  readOnly
                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title=" متعهد"
                  value={data?.CurrencyAllocationRequest?.ccpNameStr}
                  readOnly
                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title=" محل تسهیلات "
                  value={data?.CurrencyAllocationRequest?.cflNameStr}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title=" مهلت باز پرداخت"
                  value={data?.CurrencyAllocationRequest?.crdNameStr}
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title=" محل تامین ارز "
                  value={data?.CurrencyAllocationRequest?.ccsNameStr}
                  readOnly

                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title=" نرخ ارز"
                  value={data?.CurrencyAllocationRequest?.ccrNameStr}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title=" نوع درخواست"
                  value={data?.CurrencyAllocationRequest?.crtNameStr}
                  readOnly
                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title=" مهلت به ماه"
                  value={
                    data?.CurrencyAllocationRequest?.carDeadlinePerMonthInt
                  }
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={8}>
                {" "}
                <Input
                  title="  مهلت انقضا به روز"
                  value={
                    data?.CurrencyAllocationRequest?.carExpireDeadlinePerDayInt
                  }
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12} xl={12}>
                {" "}
                <Input
                  title=" تعرفه هزینه های مالی"
                  value={
                    data?.CurrencyAllocationRequest?.carFinancialCostTariffInt?.toLocaleString()
                  }
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
              <Col xs={24} md={12} xl={12}>
                {" "}
                <Input
                  title=" شرح هزینه های مالی "
                  value={
                    data?.CurrencyAllocationRequest
                      ?.carFinancialCostDescriptionStr?.toLocaleString()
                  }
                  readOnly
                  centerText={true}
                 align="right"
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "20px", marginBottom: "60px" }}>
              <Col xs={24} md={12}>
                <div className="currencyInput">
                  <div
                    className="currencyBox1"
                    style={{
                      backgroundColor: themeColors[theme]?.bg,
                      color: themeColors[theme]?.text,
                    }}
                  >
                    <p className="currencyBox1Tag">
                      {" "}
                      مبلغ تامین شده ی درخواست به ارز درخواست{" "}
                    </p>
                  </div>
                  <div className="currencyBox2">
                    {data?.AllocatedAmountInRequestCurrencyFlag ? (
                      !!AllocatedAmountInRequestCurrencyFlag ? (
                        <p style={{ fontSize: "12px", lineHeight: "15px" }}>
                          {AllocatedAmountInRequestCurrencyFlag}
                        </p>
                      ) : (
                        <Button
                          onClick={() => {
                            const postData = {
                              carVCodeLng: location?.search?.substring(1),
                              urlVCodeInt: role,
                              ssdsshGUID: GUid,
                            };
                            dispatch(handleLoading(true));
                            axios({
                              url: endpoints.RestAPIs.CurrencyAllocation
                                .GetAllocatedAmountOfCurrencyAllocationRequest
                                .url,
                              method:
                                endpoints.RestAPIs.CurrencyAllocation
                                  .GetAllocatedAmountOfCurrencyAllocationRequest
                                  .method,
                              data: postData,
                            })
                              .then((res) => {
                                if (res?.data?.ErrorCode === 0) {
                                  setAllocatedAmountInRequestCurrencyFlag(
                                    res?.data?.AllocatedAmountInRequestCurrency
                                  );
                                }
                                dispatch(handleLoading(false));
                              })
                              .catch((err) => {
                                dispatch(handleLoading(false));
                              });
                          }}
                        >
                          مشاهده
                        </Button>
                      )
                    ) : (
                      <p>0</p>
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                {" "}
                <div className="currencyInput">
                  <div
                    className="currencyBox1"
                    style={{
                      backgroundColor: themeColors[theme]?.bg,
                      color: themeColors[theme]?.text,
                    }}
                  >
                    <p className="currencyBox1Tag">
                      اولویت تخصیص ارز از نظر دستگاه مجوز دهنده
                    </p>
                  </div>
                  <div className="currencyBox2">
                    {data?.OrganizationViewPointInquiryButtonVisibility ? (
                      !!OrganizationViewPointInquiryButtonVisibility ? (
                        <p style={{ fontSize: "12px", lineHeight: "15px" }}>
                          {OrganizationViewPointInquiryButtonVisibility}
                        </p>
                      ) : (
                        <Button
                          onClick={() => {
                            const postData = {
                              carVCodeLng: location?.search?.substring(1),
                              urlVCodeInt: role,
                              ssdsshGUID: GUid,
                            };
                            dispatch(handleLoading(true));
                            axios({
                              url: endpoints.RestAPIs.CurrencyAllocation
                                .GetOrganizationViewPoint.url,
                              method:
                                endpoints.RestAPIs.CurrencyAllocation
                                  .GetOrganizationViewPoint.method,
                              data: postData,
                            })
                              .then((res) => {
                                if (res?.data?.ErrorCode === 0) {
                                  setOrganizationViewPointInquiryButtonVisibility(
                                    res?.data?.OrganizationViewPoint
                                  );
                                }
                                dispatch(handleLoading(false));
                              })
                              .catch((err) => {
                                dispatch(handleLoading(false));
                              });
                          }}
                        >
                          مشاهده
                        </Button>
                      )
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Table
              hasPageSizeCombo={false}
              dataSource={data?.CurrencyAllocationRequest?.DocumentList}
              columns={columns}
              onHeaderRow={() => {
                return {
                  style: { backgroundColor: colorMode },
                };
              }}
              pagination={false}
              id="six"
            />
            <CurrencyAllocationRequestButtons
              data={data}
              enabled={enabled}
              setEnabled={setEnabled}
              id="seven"
              id2="eight"
            />
          </>
        ) : (
          ""
        )}
      </div>
      <EmergingProblem />
    </QuickGuide>
  );
}

export default CurrencyAllocationRequestDetailPage;
