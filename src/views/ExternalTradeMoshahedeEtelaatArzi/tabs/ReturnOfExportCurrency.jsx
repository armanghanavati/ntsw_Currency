import { useEffect } from "react";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { useState } from "react";

import { Button, EmergencyProblem, Input, Modal } from "../../../components";
import { Card, Col, Divider, Row, Tooltip } from "antd";
import themeColors from "../../../configs/theme";

function ReturnOfExportCurrency() {
  const [nastionalCode1, setNationalCode] = useState([]);
  const { theme, colorMode, role, GUid, nationalCode } = useSelector(
    (state) => state
  );
  const [data, setData] = useState(null);
  const [openModal, setOpenMOdal] = useState(false);
  const dispatch = useDispatch();

  //    for get data--------------------------------------------
  function inquiry() {
    if (nationalCode) {
      const postData = {
        urlVCodeInt: role,
        ssdsshGUID: GUid,
      };
      dispatch(handleLoading(true));
      axios({
        url: endpoints.RestAPIs.ObligationEliminate
          .ReturnReportOfCurrencyAllocation.url,
        method:
          endpoints.RestAPIs.ObligationEliminate
            .ReturnReportOfCurrencyAllocation.method,
        data: postData,
      })
        .then((res) => {
          setData(res.data.returnReport);
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
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "کدملی وارد نشده",
        })
      );
    }
  }

  return (
    <div>
      <Modal
        open={openModal}
        children="در صورتی که پروانه صادراتی شما در سامانه گمرک، اصلاح یا ابطال شده و نتیجه آن در میزان تعهدات شما منعکس نشده است می توانید نسبت به بروزرسانی پروانه صادراتی مدنظر از طریق منوی عملیات گمرکی >> صادرات >> مدیریت اظهارنامه صادرات (در بخش جزئیات اظهارنامه)، اقدام نمائید. نتیجه عملیات بروزرسانی پروانه با یک روز تاخیر در سامانه بانک مرکزی اعمال شده و میزان تعهد شما متناسب با این تغییر به روز خواهد شد."
        closeIcon={() => {
          setOpenMOdal(false);
        }}
        title="توضیحات"
        footer={
          <Button
            onClick={() => {
              setOpenMOdal(false);
            }}
            backgroundColor={themeColors.comments.green}
          >
            بستن
          </Button>
        }
      />
      <div
        className="ExternalTradeSummeryofCommitmentsinput"
        style={{ marginTop: "50px" }}
      >
        <Input
          title="شناسه صادر کننده"
          value={nationalCode}
          readOnly
          centerText={true}
        />
        <Button type="primary" onClick={inquiry}>
          استعلام
        </Button>
      </div>
      <div
        style={{
          marginBottom: "20px",
          boxShadow: "0 0 3px rgba(0,0,0,.2)",
          marginTop: "20px",
        }}
      >
        <p
          style={{
            marginBottom: "20px",
            fontSize: "20px",
            color: themeColors.comments.red,
          }}
        >
          تذکر
        </p>
        <p style={{ marginBottom: "10px" }}>
          1- کلیه مبالغ مربوط به میزان صادرات و تعهدات صادراتی از سوی گمرک ج.ا.ا
          و مبالغ بازگشت ارز حاصل از صادرات بر اساس عملکرد صادرکنندگان، توسط
          سامانه های ذیربط بانک مرکزی محاسبه شده و به صورت برخط در اختیار سامانه
          جامع تجارت قرار گرفته و می گیرد. بنابراین در صورت وجود هرگونه مغایرت
          احتمالی از نظر صادرکنندگان در آمار صادرات و تعهدات ارزی صادراتی و
          عملکرد برگشت ارز حاصل از صادرات، مراتب به ترتیب از گمرک ج.ا.ا و بانک
          مرکزی ج.ا.ا قابل پیگیری است.
        </p>
        <p style={{ marginBottom: "10px" }}>
          2- داده های گزارش با{" "}
          <span style={{ color: themeColors.comments.red }}>یک روز</span> تاخیر
          به روزرسانی می شوند.
        </p>
        <p style={{ marginBottom: "10px" }}>
          3- کلیه اعداد براساس{" "}
          <span style={{ color: themeColors.comments.red }}>معادل یورویی</span>{" "}
          می باشند.
        </p>
      </div>
      {data ? (
        <>
          <div
            title="کلیات"
            headStyle={{ background: "#ddd" }}
            style={{
              textAlign: "center",
              marginBottom: "20px",

              marginTop: "20px",
            }}
          >
            <Row>
              <Col xs={24} lg={8}>
                {" "}
                <Input
                  title=" صادرات 1397"
                  value={data.Saderat97.toLocaleString()}
                  readOnly
                  centerText={true}
                />
              </Col>
              <Col xs={24} lg={8}>
                {" "}
                <Input
                  title="  صادرات 1398"
                  value={data.Saderat98.toLocaleString()}
                  readOnly
                  centerText={true}
                />
              </Col>
              <Col xs={24} lg={8}>
                {" "}
                <Input
                  title="صادرات 1399 "
                  value={data.Saderat99.toLocaleString()}
                  readOnly
                  centerText={true}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={8}>
                {" "}
                <Input
                  title=" صادرات 1400"
                  value={data.Saderat00.toLocaleString()}
                  readOnly
                  centerText={true}
                />
              </Col>
              <Col xs={24} lg={8}>
                {" "}
                <Input
                  title="  صادرات 1401"
                  value={data.Saderat01.toLocaleString()}
                  readOnly
                  centerText={true}
                />
              </Col>
              <Col xs={24} lg={8}>
                {" "}
                <Input
                  title=" صادرات 1402"
                  value={data.Saderat02.toLocaleString()}
                  readOnly
                  centerText={true}
                />
              </Col>
            </Row>
            <Divider />
            <Row style={{ marginBottom: "10px" }}>
              <Col xs={24} lg={12}>
                <Input
                  title={<span>کل تعهد صادراتی</span>}
                  backgroundColorLbale="#F1BF98"
                  value={Math.round(data.taahodKol).toLocaleString()}
                  readOnly
                  TooltipTitle="   کلیه  تعهدات بازگشت ارز حاصل از صادرات از تاریخ 1397/01/22 تا دیروز "
                  centerText={true}
                  height="100%"
                />
                <span
                  className="ExternalTradeDescription"
                  onClick={() => {
                    setOpenMOdal(true);
                  }}
                >
                  {" "}
                  + توضیحات{" "}
                </span>
              </Col>
              <Col xs={24} lg={12}>
                <Input
                  title={<span> تعهد صادرات سررسید شده</span>}
                  backgroundColorLbale="#F1BF98"
                  value={Math.round(data.commitment).toLocaleString()}
                  readOnly
                  TooltipTitle=" تعهد بازگشت ارز حاصل از صادرات از تاریخ 1397/01/22 تا چهار ماه قبل از روز جاری"
                  centerText={true}
                  height="100%"
                />
              </Col>{" "}
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Col xs={24} lg={12}>
                <Input
                  title={<span>مبلغ تایید شده ورود موقت </span>}
                  backgroundColorLbale="#F1BF98"
                  value={data.vorodMovaghatEuroyi.toLocaleString()}
                  readOnly
                  centerText={true}
                  height="100%"
                  TooltipTitle="مقدار این فیل بر اساس اطلاعات پروانه های صادرات از محل ورود موقت که توسط گمرک به بانک مرکزی ارسال شده محاسبه می شود این مبلغ از تعهد شما کسر شده و صرفا جهت اطلاع گزارش شده است"
                />
              </Col>{" "}
              <Col xs={24} lg={12}>
                <Input
                  centerText={true}
                  title={<span> مبلغ معافیت از تعهد ارزی</span>}
                  backgroundColorLbale="#F1BF98"
                  value={data.kasrAzTaahod.toLocaleString()}
                  readOnly
                  height="100%"
                  TooltipTitle=" این فیلد نشان دهندهی میزان معافیت از بازگشت ارزاست که به صورت ثابت از تعهد ارزی شما کسر شده و صرفا جهت اطلاع گزارش شده است"
                />
              </Col>{" "}
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Col xs={24} lg={12}>
                <Input
                  centerText={true}
                  title={
                    <span>مجموع ارز بازگردانی شده به چرخه تجاری کشور</span>
                  }
                  backgroundColorLbale="#F1BF98"
                  value={Math.round(data.sum_Bazgashte_Arz).toLocaleString()}
                  readOnly
                  titleFontSize="10px"
                  height="100%"
                />
              </Col>{" "}
              <Col xs={24} lg={12}>
                <Input
                  centerText={true}
                  title={<span> درصد بازگشت ارز</span>}
                  backgroundColorLbale="#F1BF98"
                  readOnly
                  value={`${data.commitmentPercent}%`}
                  height="100%"
                />
              </Col>
            </Row>
          </div>
          <div
            title="جزئیات بازگشت ارز"
            headStyle={{ background: "#ddd" }}
            style={{
              textAlign: "center",
              marginBottom: "20px",

              marginTop: "20px",
            }}
          >
            <Row>
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title=" فروش ارز در سامانه نیما"
                  value={data.nima.toLocaleString()}
                  readOnly
                  TooltipTitle={
                    "صرفا معاملاتی که وضعیت آن ها در سامانه نیما مختومه می باشند"
                  }
                  height="100%"
                />
              </Col>
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title="صادرات ریالی تائید شده عراق وافغانستان"
                  value={data.tasvibNameh.toLocaleString()}
                  readOnly
                  height="100%"
                  titleFontSize="11px"
                />
              </Col>
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title=" صادرات ریالی تایید شده به سایرکشورها"
                  value={data.tasvibNameh2.toLocaleString()}
                  readOnly
                  height="100%"
                  titleFontSize="11px"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title=" واگذاری ارز پروانه صادراتی"
                  value={data.vag_par.toLocaleString()}
                  readOnly
                  height="100%"
                />
              </Col>
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title="پرداخت بدهی ارز به بانک های عامل"
                  value={data.pardakhtBedehi.toLocaleString()}
                  readOnly
                  titleFontSize="10px"
                  height="100%"
                />
              </Col>
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title=" واردات در مقابل صادرات یا واگذاری استثنائات تجاری"
                  value={Math.round(data.gheirBankiPilevari).toLocaleString()}
                  readOnly
                  titleFontSize="8px"
                  height="100%"
                  TooltipTitle={
                    "نشان دهنده میزان بازگشت ارز پیله وران، مرزنشینان و تعاونی های آنها از طریق واردات در مقابل صادرات خود یا واگذاری از پروانه صادراتی به دیگران می باشد."
                  }
                />
              </Col>
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title=" واردات در مقابل صادرات خود "
                  value={data.var_sad.toLocaleString()}
                  readOnly
                  height="100%"
                />
              </Col>{" "}
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title="  سپرده گذاری ارزی نزد بانک های عامل"
                  value={data.sepordeGozari.toLocaleString()}
                  readOnly
                  titleFontSize="10px"
                  height="100%"
                />
              </Col>{" "}
              <Col xs={24} md={12}>
                {" "}
                <Input
                  title=" تهاتر ارزی  "
                  value={data.tahator.toLocaleString()}
                  readOnly
                  centerText={true}
                  height="100%"
                />
              </Col>{" "}
              <Col xs={24} md={12}>
                {" "}
                <Input
                  centerText={true}
                  title="  فروش ارز در سامانه سنا"
                  value={data.sana.toLocaleString()}
                  readOnly
                  height="100%"
                />
              </Col>{" "}
              <Col xs={24} md={12}>
                {" "}
                <Input
                  title="سایر"
                  value={data.sayer.toLocaleString()}
                  readOnly
                  centerText={true}
                  height="100%"
                />
              </Col>
            </Row>
          </div>
        </>
      ) : (
        ""
      )}
      <EmergencyProblem title=" نیما" />
    </div>
  );
}
export default ReturnOfExportCurrency;
