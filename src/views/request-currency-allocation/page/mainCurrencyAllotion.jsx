import { Col, Modal, Row } from "antd";
import { Button, ComboBox, DatePicker, Input } from "../../../components";
import themeColors from "../../../configs/theme";
import RequestCurrencyAllocationTable from "../table/requestCurrencyAllocationTable";
import QuickGuide from "../../../components/QuickGuide";
import { useEffect, useState } from "react";
import TooltipButton from "../../../components/TooltipButton";
import SelectMulti from "../../../components/SelectMulti";
import MultyPdf from "../../../components/multyPdf";
import cancellation from "../../../assets/pdfFile/cancellation.pdf";
import create from "../../../assets/pdfFile/create.pdf";
import edit from "../../../assets/pdfFile/edit.pdf";
import divide from "../../../assets/pdfFile/divide.pdf";
import edit2 from "../../../assets/pdfFile/edit2.pdf";
import { ExcelExportButton } from "../../../common";
import pdfFileRout from "../../../assets/pdfFile/RahnamaDargahSabtMasaref.pdf";
function MainCurerncyAllotion({
  openModal,
  setOpenModal,
  handleUpdateAccOrder,
  attention,
  inputsData,
  handleChangeInputs,
  option,
  errors,
  handleOprationNewCurAllReqBtn,
  fetchData,
  tableParams,
  setTableParams,
  dataSource,
  loading,
  totalCount,
  setTotalCount,
  optionStatus,
  setOptionStatus,
  optionActiveStatus,
  setOptionActiveStatus,
}) {
  const [enabled, setEnabled] = useState(false);
  const ItemModalHandler = (event) => {
    event.preventDefault();
    setEnabled(!enabled);
  };
  const [openPdf, setOpenPdf] = useState(false);
  const [openvideo, setOpenvideo] = useState(false);

  const arrayPdf = [
    {
      rout: cancellation,
      name: "راهنمای ابطال درخواست تخصیص ارز.pdf",
      title: "راهنمای ابطال درخواست تخصیص ارز.pdf",
    },
    {
      rout: create,
      name: "راهنمای ایجاد درخواست تخصیص ارز.pdf",
      title: "راهنمای ایجاد درخواست تخصیص ارز.pdf",
    },
    {
      rout: edit2,
      name: "راهنمای به_روزرسانی ثبت سفارش.pdf",
      title: "راهنمای به_روزرسانی ثبت سفارش.pdf",
    },
    {
      rout: divide,
      name: "راهنمای تجزیه درخواست تخصیص ارز.pdf",
      title: "راهنمای تجزیه درخواست تخصیص ارز.pdf",
    },
    {
      rout: edit,
      name: "راهنمای ویرایش درخواست تخصیص ارز.pdf",
      title: "راهنمای ویرایش درخواست تخصیص ارز.pdf",
    },
  ];
  const videoArray = [
    {
      rout: "https://www.aparat.com/v/kmiyL",
      name: "راهنمای درخواست ایجاد تخصیص ارز",
      title: "راهنمای درخواست ایجاد تخصیص ارز",
    },
    {
      rout: "https://www.aparat.com/v/2gV4l",
      name: "راهنمای درخواست تجزیه تخصیص ارز",
      title: "راهنمای درخواست تجزیه تخصیص ارز",
    },
    {
      rout: "https://www.aparat.com/v/GKBim",
      name: "راهنمای درخواست ویرایش تخصیص ارز",
      title: "راهنمای درخواست ویرایش تخصیص ارز",
    },
    {
      rout: "https://www.aparat.com/v/7Q5pR",
      name: "راهنمای درخواست ابطال تخصیص ارز",
      title: "راهنمای درخواست ابطال تخصیص ارز",
    },
    {
      rout: "https://www.aparat.com/v/VyT8l",
      name: "راهنمای درخواست به روزرسانی تخصیص ارز",
      title: "راهنمای درخواست به روز رسانی تخصیص ارز",
    },
  ];

  const steps = [
    {
      element: "#Table",
      intro: `1)
      در این جدول لیست درخواست های تخصیص ارز ثبت شده توسط شما، نمایش داده می شود. در صورت زدن دکمه "جزئیات" می توانید جزئیات بیشتری از هریک از درخواست ها را مشاهده کنید و عملیات های متناسب با وضعیت درخواست مانند "ویرایش"، "انصراف از فرایند"، "تجزیه" یا "ابطال" را شروع کنید.`,
      position: "left",
    },
    {
      element: "#header",
      intro: `2)
      به کمک فیلتر های موجود و دکمه جستجو می توانید درخواست تخصیص مد نظر خود را جست و جو و پیدا کنید.`,
      position: "left",
    },
    {
      element: "#FileInformation",
      intro: `3)
      در صورتیکه می خواهید درخواست تخصیص ارز جدید ثبت نمایید، ابتدا باید شماره ثبت سفارش مد نظر را انتخاب و سپس دکمه " ایجاد درخواست تخصیص ارز" را بزنید.`,

      position: "left",
    },
    {
      element: "#Next",
      intro: `4)
      در صورتیکه ثبت سفارشی را ویرایش کرده اید و برای آن ثبت سفارش درخواست تخصیص ارز با وضعیت "تخصیص یافته" دارید، نیاز است اطلاعات جدید ثبت سفارش خود را در سامانه تخصیص ارز بانک مرکزی نیز بروزرسانی کنید. بدین منظور ابتدا باید شماره ثبت سفارش مد نظر را انتخاب و سپس دکمه "بروزرسانی ثبت سفارش" را بزنید.`,
      position: "left",
    },
  ];

  return (
    <>
      <QuickGuide enabled={enabled} setEnabled={setEnabled} steps={steps} don>
        <form style={{ paddingRight: "15px" }}>
          <div id="header">
            <Row>
              <Col sm={24} md={12} xl={6}>
                <ComboBox
                  title="شماره ثبت سفارش"
                  defaultValue={inputsData?.orderRegistrationNumber}
                  name="orderRegistrationNumber"
                  onChange={handleChangeInputs}
                  options={option}
                  optionTitle="name"
                  optionValue="value"
                  width="200px"
                  error={errors?.orderRegistrationNumber}
                />
              </Col>
              <Button
                onClick={handleOprationNewCurAllReqBtn}
                name="FileInformation"
              >
                <i class="fa fa-plus-square" />
                ایجاد درخواست تخصیص ارز جدید
              </Button>
              <div className="marginBtnUpdate">
                <Button onClick={handleUpdateAccOrder} name="Next">
                  <i class="fa fa-refresh" />
                  بروزرسانی ثبت سفارش
                </Button>
              </div>
            </Row>
            <Row>
              <Col sm={24} md={12} xl={6}>
                <DatePicker
                  title=" تاریخ  درخواست از "
                  name="dateApplicationFrom"
                  value={inputsData?.dateApplicationFrom}
                  onChange={handleChangeInputs}
                  error={errors?.dateApplicationFrom}
                  labelWidth="200px"
                  // validations={[["minimumDate", filters?.beginDate]]}
                />
              </Col>
              <Col sm={24} md={12} xl={6}>
                <DatePicker
                  title=" تاریخ  درخواست تا "
                  name="dateApplicationUntil"
                  value={inputsData?.dateApplicationUntil}
                  onChange={handleChangeInputs}
                  error={errors?.dateApplicationUntil}
                  labelWidth="200px"
                  // validations={[["minimumDate", filters?.beginDate]]}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12} xl={6}>
                <DatePicker
                  title="تاریخ تخصیص از"
                  name="dateAllotmentFrom"
                  value={inputsData?.dateAllotmentFrom}
                  onChange={handleChangeInputs}
                  error={errors?.dateAllotmentFrom}
                  labelWidth="200px"
                  // validations={[["minimumDate", filters?.beginDate]]}
                />
              </Col>

              <Col sm={24} md={12} xl={6}>
                <DatePicker
                  title="تاریخ تخصیص تا"
                  name="dateAllotmentTo"
                  value={inputsData?.dateAllotmentTo}
                  onChange={handleChangeInputs}
                  error={errors?.dateAllotmentTo}
                  labelWidth="200px"
                  // validations={[["minimumDate", filters?.beginDate]]}
                />
              </Col>
              <Col sm={24} md={12} xl={6}>
                <SelectMulti
                  title="وضعیت درخواست"
                  defaultValue={inputsData?.applicationStatus}
                  name="applicationStatus"
                  onChange={handleChangeInputs}
                  options={optionStatus}
                  optionTitle="name"
                  optionValue="value"
                  width="140px"
                  labelWidth="120px"
                  space="0"
                />
              </Col>
              <Col sm={24} md={12} xl={6}>
                <SelectMulti
                  title="فرآیند فعلی"
                  defaultValue={inputsData?.webSite}
                  name="webSite"
                  onChange={handleChangeInputs}
                  options={optionActiveStatus}
                  optionTitle="name"
                  optionValue="value"
                  width="140px"
                  labelWidth="120px"
                  space="0"
                />
              </Col>
            </Row>
            <Row>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (tableParams.pagination.current === 1) {
                    fetchData();
                  } else {
                    setTableParams({
                      ...tableParams,
                      pagination: {
                        ...tableParams.pagination,
                        current: 1,
                      },
                    });
                  }
                }}
              >
                <i class="fa fa-search" />
                جستجو
              </Button>
              <TooltipButton
                onClick={ItemModalHandler}
                iconClass={"fa-info"}
                backgroundColor={themeColors.comments.green}
                tooltipText={"راهنمای سریع"}
              />
            </Row>
          </div>
        </form>
        <div className="gap-shadow" id="Tabel" />
        <Row style={{ marginTop: "13px", paddingRight: "15px" }}>
          <Col sm={24} md={12} xl={8}>
            <ExcelExportButton getData={fetchData} />
          </Col>
          <Button
            onClick={() => {
              setOpenvideo(true);
            }}
          >
            <i class="fa fa-download"></i>
            فیلم آموزشی
          </Button>
          <Button
            onClick={() => {
              setOpenPdf(true);
            }}
          >
            <i class="fa fa-file" />
            فایل راهنما
          </Button>
        </Row>
        <div>
          <RequestCurrencyAllocationTable
            id="Table"
            tableParams={tableParams}
            setTableParams={setTableParams}
            dataSource={dataSource}
            loading={loading}
            totalCount={totalCount}
            setTotalCount={setTotalCount}
          />
        </div>
      </QuickGuide>
      <MultyPdf
        footer={null}
        title="فایل های راهنما"
        arrayPdf={arrayPdf}
        open={openPdf}
        setIsOpen={setOpenPdf}
      />
      <MultyPdf
        footer={null}
        title="ویدیوهای آموزشی"
        arrayPdf={videoArray}
        open={openvideo}
        setIsOpen={setOpenvideo}
      />
    </>
  );
}
export default MainCurerncyAllotion;
