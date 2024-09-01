import { useState } from "react";
import { Col } from "antd";
import { Button, ComboBox } from "../../../components";
import themeColors from "../../../configs/theme";
import Validation from "../../../utils/Validation";
import EmergingProblem from "../emerging-problem/emerging-problem";

const ExternalTradeAssignmentBoard = () => {
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});

  const [option, setOption] = useState([
    { number: 1223434 },
    { number: 6768678 },
    { number: 6666567 },
    { number: 7867667 },
    { number: 5667656 },
    { number: 4545345 },
  ]);

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

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ddd",
          padding: "15px 10px 10px",
          borderRadius: "4px",
          boxShadow: "0 1px 1px rgba(0,0,0,.05)",
        }}
      >
        <Button>
          <i className="fa fa-file btn-label" aria-hidden="true"></i>
          راهنمای فرایند
        </Button>
        <Button>
          <i className="fa fa-file btn-label" aria-hidden="true"></i>
          راهنمای کاربردی
        </Button>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "35px",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ddd",
          padding: "19px",
          borderRadius: "2px",
          marginTop: "40px",
          boxShadow: "0 0 3px rgba(0,0,0,.2)",
          backgroundColor: "#fbfbfb",
        }}
      >
        <p style={{ fontSize: "14.4px", textAlign: "center" }}>
          جهت مشاهده تابلوی پروانه های صادراتی لازم است ثبت سفارشی که قصد دارید
          جهت تامین ارز آن، از روش «واردات در مقابل صادرات غیر» استفاده نمائید
          را انتخاب کنید.
        </p>
        <p style={{ fontSize: "14.4px", textAlign: "center" }}>
          لازم به ذکر است که ثبت سفارش هایی قابل انتخاب هستند که دارای گواهی ثبت
          آماری تائید شده از نوع «ارز اشخاص-از محل صادرات دیگران» باشند.
        </p>
      </div>
      <Col style={{ margin: "20px auto 0" }} sm={24} md={24} xl={8}>
        <ComboBox
          title="ثبت سفارش"
          defaultValue={inputsData?.status}
          name="status"
          onChange={handleChangeInputs}
          options={option}
          optionTitle="ثبت سفارش"
          optionValue="id"
          validations={[["required"]]}
          error={errors?.status}
        />
      </Col>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "5px",
        }}
      >
        <Button backgroundColor={themeColors.btn.secondary} width="230px">
          تایید
        </Button>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",
          margin: "40px 0 60px",
        }}
      >
        <Col sm={24} md={24} xl={16}>
          <p
            style={{
              backgroundColor: "khaki",
              color: "#095eab",
              padding: "15px 10px",
              borderRadius: "5px",
              fontSize: "13.2px",
              textAlign: "center",
            }}
          >
            مسیر دسترسی جهت درج آگهی واگذاری پروانه توسط صادرکنندگان عبارت است
            از : عملیات ارزی &gt;&gt; معامله ارز &gt;&gt; واگذاری پروانه و تهاتر
            ارزی &gt;&gt; ایجاد آگهی جدید
          </p>
        </Col>
      </div>
      <EmergingProblem />
    </>
  );
};

export default ExternalTradeAssignmentBoard;
