import { useState, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";
import {
  Dastine,
  DastineInstaller,
  BrowserDetector,
} from "../assets/dastine/Dastine";
import themeColors from "../configs/theme";
import DastineConfig from "../assets/dastine/Dastine-Config";
import { handleLoading, handleMessageModal } from "../state/action-creators";
import { useDispatch } from "react-redux";
import {
  dastineVisibleMessage,
  handleDastineError,
} from "../assets/dastine/Dastine-Errors";
import { notification } from "antd";
import { Link } from "react-router-dom";
import { endpoints } from "../services/endpoints";
import { store } from "./../state/store";

const Signature = ({
  backgroundColor = themeColors.btn.primary,
  title = "امضاء",
  base64CertificateInfo = "",
  service = () => {},
  beforeSigning = () => {},
  hasbeforeSigningFunction = false,
  counter = 0,
  beSigned = true,
}) => {
  const [dastineIsNotInstalled, setDastineIsNotInstalled] = useState(false);
  const [appIsMounted, setAppIsMounted] = useState(false);

  const dispatch = useDispatch();
  const handleSignatureButton = (event) => {
    event?.preventDefault();
    if (Dastine.isInstalled) {
      store.dispatch(handleLoading(true));
      Dastine.Reset(function (event) {
        let errorMessage;
        Dastine.SelectCertificateFromWindowsByUI("", "", (select) => {
     
          errorMessage = handleDastineError(select.data.Result);
          if (errorMessage != "SUCCESSFUL") {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: dastineVisibleMessage[select.data.Result],
              })
            );
            store.dispatch(handleLoading(false));
            return;
          }
          Dastine.GetSelectedCertificate((certificateRes) => {
     
            errorMessage = handleDastineError(certificateRes.data.Result);
            if (errorMessage != "SUCCESSFUL") {
              dispatch(
                handleMessageModal({
                  isModalOpen: true,
                  describe: dastineVisibleMessage[certificateRes.data.Result],
                })
              );
              store.dispatch(handleLoading(false));
              return;
            }
            Dastine.CmsSign(base64CertificateInfo, "SHA1", (cmsSignRes) => {
          
              errorMessage = handleDastineError(cmsSignRes.data.Result);
              if (errorMessage != "SUCCESSFUL") {
                dispatch(
                  handleMessageModal({
                    isModalOpen: true,
                    describe: dastineVisibleMessage[cmsSignRes.data.Result],
                  })
                );
                store.dispatch(handleLoading(false));
                return;
              } else {
                notification.open({
                  message: "گواهی با موفقیت انتخاب شد.",
                  rtl: true,
                  duration: 4,
                  style: {
                    backgroundColor: themeColors.btn.secondary,
                  },
                });
                store.dispatch(handleLoading(false));
              }
              service(certificateRes.data.Result, cmsSignRes.data.Result);
            });
          });
        });
      });
    } else {
      store.dispatch(handleLoading(false));
      if (Dastine.errorMessage == "DASTINE_NOT_INSTALLED") {
        console.log("DASTINE_NOT_INSTALLED");
        setDastineIsNotInstalled(true);
      } else {
      
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe:
              Dastine.errorMessage === "WAITING_FOR_DASTINE_SERVICE"
                ? "انتظار برای اتصال به سرویس دستینه!! لطفا صفحه را باز بگذارید و چند ثانیه بعد مجدد امتحان کنید. "
                : Dastine.errorMessage,
          })
        );
        setDastineIsNotInstalled(true);
        store.dispatch(handleLoading(false));
      }
    }
  };

  useEffect(() => {
    DastineConfig.init();
    BrowserDetector.init();
    // DastineInstaller.init();
    DastineInstaller.createConnection();
    setAppIsMounted(true);
  }, []);

  useEffect(() => {
    if (appIsMounted && hasbeforeSigningFunction && counter !== 0) {
      handleSignatureButton();
    }
  }, [counter]);
  return (
    <>
      <Button
        backgroundColor={backgroundColor}
        onClick={(event) => {
          event?.preventDefault();
          if (beSigned && hasbeforeSigningFunction) {
            beforeSigning();
          } else if (beSigned) {
            handleSignatureButton();
          } else {
            service();
          }
        }}
        name="signature"
      >
        {title}
      </Button>
      <Modal
        width={700}
        onCancel={() => {
          setDastineIsNotInstalled(false);
        }}
        footer={[
          <Link
            to={{
              pathname: `${endpoints.BaseUrlAddress}/Upload/token_1.1.pdf`,
            }}
            target="_blank"
          >
            <Button
              onClick={() => {
                setDastineIsNotInstalled(false);
              }}
            >
              راهنمای استفاده از گواهی امضای الکرونیک
            </Button>
          </Link>,
          <Link
            to={{
              pathname:
                "https://www.gica.ir/totalCA/index.aspx?portal=MFPortal&Page=79&lang=fa",
            }}
            target="_blank"
          >
            <Button
              backgroundColor={themeColors.btn.secondary}
              onClick={() => {
                setDastineIsNotInstalled(false);
              }}
            >
              ثبت نام و تهیه گواهی امضاء الکترونیکی
            </Button>
          </Link>,
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={() => {
              setDastineIsNotInstalled(false);
            }}
          >
            لغو
          </Button>,
        ]}
        open={dastineIsNotInstalled}
        title="پیغام سیستم"
      >
        <p className="modal--text" style={{ textAlign: "right" }}>
          کاربر گرامی
          <br />
          برای استفاده از این بخش از سامانه، نیازمند اخذ گواهی امضای الکترونیکی،
          نصب نرم افزار دستینه و اتصال سخت افزار مربوطه (توکن) به رایانه خود
          می‌باشید.
        </p>
      </Modal>
    </>
  );
};

export default Signature;
