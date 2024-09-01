import React, { useState, useEffect, useRef } from "react";
import { Col, Divider, Modal, Row, Statistic } from "antd";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeRole, handleMessageModal } from "../../state/action-creators";
import themeColors from "../../configs/theme";
import { Button, Input, VerticalSpace } from "../../components";
import { endpoints } from "../../services/endpoints";
import { clearCookie, logOut } from "../../configs/validate-JWT";
import axios from "axios";
import Validation from "../../utils/Validation";
import Captcha from "../../components/Captcha";

const { Countdown } = Statistic;

const CountDown = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [counter, setCounter] = useState();
  const [appHasMounted, setAppHasMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [num1, setNum1] = useState(Math.floor(Math.random() * 20) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 20) + 1);
  let attribution = ["+", "-", "*", "/"];
  const [randomAttribution, setRandomAttribution] = useState(
    attribution[Math.floor(Math.random() * attribution.length)]
  );
  const [showCountDown, setShowCountDown] = useState(false);
  const boxRef = useRef(null);
  const counterRef = useRef(null);
  const dispatch = useDispatch();
  const { theme, role, GUid } = useSelector((state) => state);
  const { pathname } = useLocation();

  const onFinish = () => {
    dispatch(changeRole(null));
    localStorage.removeItem("roleCode");
    logOut();
  };

  const onChange = (val) => {
    if (119.95 * 1000 < val && val < 120 * 1000) {
      boxRef.current.style.backgroundColor = "#f2dede";
      boxRef.current.style.color = "#f44336";
      boxRef.current.style.border = "1px solid #f44336";
      setModalOpen(true);
    }
  };

  const resetCounter = () => {
    setCounter(Date.now() + 1800 * 1000);
    boxRef.current.style.backgroundColor = "unset";
    boxRef.current.style.color = "unset";
    boxRef.current.style.border = "1px solid #AEACAC";
    setModalOpen(false);
    setShowCountDown(false);
    setTimeout(() => {
      setShowCountDown(true);
    }, 200);
  };

  const extendSession = () => {
    if (permitForNextStep(["password", "answer"]) === true) {
      const postData = {
        prsPasswordStr: inputsData?.password,
        urlVCodeInt: role,
        ssdsshGUID: GUid,
      };
      setLoading(true);
      axios({
        url: endpoints.RestAPIs.user.extendSessionWithPassword.url,
        method: endpoints.RestAPIs.user.extendSessionWithPassword.method,
        data: postData,
      })
        .then((res) => {
          if (res.data.ErrorCode === 0) {
            resetCounter();
          } else if (res.data.ErrorCode !== 10) {
            clearCookie();
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: res.data.ErrorDesc,
              })
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا تمامی اطلاعات را به درستی تکمیل نمایید.",
        })
      );
    }
  };

  useEffect(() => {
    if (appHasMounted) {
      resetCounter();
    }
  }, [pathname, appHasMounted]);

  useEffect(() => {
    setAppHasMounted(true);
  }, []);

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputsData[item] === undefined ||
        inputsData[item] === null ||
        inputsData[item]?.trim() === "" ||
        JSON.stringify(inputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const permitForNextStep = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (var key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleChangeInputs = (name, value, validationNameList) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1], item[2]) === true) {
        } else {
          temp.push(Validation[item[0]](value, item[1], item[2]));
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

  const handleReset = () => {
    setNum1(Math.floor(Math.random() * 20) + 1);
    setNum2(Math.floor(Math.random() * 20) + 1);
    setRandomAttribution(
      attribution[Math.floor(Math.random() * attribution.length)]
    );
    setInputsData((prvs) => ({
      ...prvs,
      answer: "",
    }));
    setErrors((prevstate) => {
      return {
        ...prevstate,
        answer: "",
      };
    });
  };

  return (
    <>
      {showCountDown ? (
        <div className="count-down">
          <span className="count-down--text">زمان باقیمانده </span>
          <span className="count-down--timerbox" ref={boxRef}>
            <Countdown
              format="mm:ss"
              ref={counterRef}
              value={counter}
              onChange={onChange}
              onFinish={onFinish}
            />
          </span>
        </div>
      ) : (
        <div className="count-down">
          <span className="count-down--text">زمان باقیمانده </span>
          <span className="count-down--timerbox" ref={boxRef}></span>
        </div>
      )}

      <Modal
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={700}
        footer={[
          <div
            className="colorFooter"
            style={{
              width: "100%",
              fontSize: "12px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              backgroundColor={themeColors.btn.danger}
              onClick={(event) => {
                event.preventDefault();
                setModalOpen(false);
              }}
            >
              انصراف
            </Button>
            <Button
              backgroundColor={themeColors.btn.secondary}
              loading={loading}
              onClick={(event) => {
                event.preventDefault();
                // window.location.reload(false);
                extendSession();
              }}
            >
              به روز رسانی
            </Button>
          </div>,
        ]}
      >
        <form className="form">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill"
            viewBox="0 0 16 16"
            style={{ color: themeColors.btn.warning }}
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <Divider style={{ margin: "10px 0" }} />
          <p className="count-down--modal__title">
            کاربر گرامی، زمان نشست شما در سامانه جامع تجارت رو به اتمام است.
          </p>
          <Countdown
            className="count-down--modal"
            format="mm:ss"
            value={counter}
          />
          <Row justify="center">
            <Col sm={24} md={22} xl={22}>
              <p className="count-down--modal__content">
                جهت تمدید نشست خود، لطفا پس از وارد نمودن کلمه عبور و کد امنیتی
                گزینه <span style={{ fontWeight: "bold" }}>"به‌روزرسانی"</span>{" "}
                را انتخاب و در غیر این صورت از گزینه{" "}
                <span style={{ fontWeight: "bold" }}>"انصراف"</span> استفاده
                نمایید.
              </p>
            </Col>
          </Row>
          <VerticalSpace />
          <Row justify="end">
            <Col sm={24} md={24} xl={24}>
              <Input
                name="password"
                title="کلمه عبور"
                maxLength={128}
                type="password"
                onChange={handleChangeInputs}
                value={inputsData?.password}
                error={errors.password}
                validations={[["required"]]}
                required="true"
              />
              <VerticalSpace />
            </Col>
            <Col sm={24} md={24} xl={24}>
              <div>
                <Captcha
                  inputsData={inputsData}
                  setInputsData={setInputsData}
                  errors={errors}
                  setErrors={setErrors}
                  num1={num1}
                  num2={num2}
                  randomAttribution={randomAttribution}
                  handleReset={handleReset}
                />
              </div>
            </Col>
          </Row>
        </form>
      </Modal>
    </>
  );
};

export default CountDown;
