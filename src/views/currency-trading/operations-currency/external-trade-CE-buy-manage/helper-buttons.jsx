import { useState } from "react";
import { Modal, Row } from "antd";
import { Button, QuestionModal } from "../../../../components";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import themeColors from "../../../../configs/theme";

const HelperButtons = ({ inputsData, setInputsData }) => {
  const { theme, GUid, role } = useSelector((state) => state);
  const [loadingParticipation, setLoadingParticipation] = useState(false);
  const [counter, setCounter] = useState(false);
  const dispatch = useDispatch();
  const surveyOfSarrafiRequest = (e) => {
    setCounter(true);
    e.preventDefault();
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      sfrVCodeInt: 0,
      sofVCodeInt: 0,
      surveyCallStatus: 0,
      result: true,
    };
    setLoadingParticipation(true);
    axios({
      url: endpoints.RestAPIs.buyCurrency.surveyOfSarrafiRequest.url,
      method: endpoints.RestAPIs.buyCurrency.surveyOfSarrafiRequest.method,
      data: postData,
    })
      .then((res) => {
        setInputsData({ ...inputsData, dataModal: res?.data });
        setLoadingParticipation(false);
      })
      .catch((err) => {
        setLoadingParticipation(false);
      });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #e5e5e5",
          margin: "20px 0",
        }}
      />
      <Row
        style={{
          backgroundColor: "white",
          alignItems: "center",
          margin: "10px 0",
          justifyContent: "center",
        }}
      >
        <Button
          loading={loadingParticipation}
          style={{
            height: "30px",
            border: "none",
            backgroundColor: "#53a93f",
            color: "white",
          }}
          onClick={surveyOfSarrafiRequest}
        >
          <i class="fa fa-comment" />
          مشارکت در بازطراحی و بهبود عملکرد سامانه نیما
        </Button>
        <Button>
          <a
            class="gap-icon"
            href="../Upload/Varedat-Aban-97.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-image" style={{ fontSize: "15px" }} />
            اینـفـوگـرافی
          </a>
        </Button>
        <Button>
          <a
            class="gap-icon"
            href="https://www.aparat.com/v/D1LAM"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-film" style={{ fontSize: "15px" }} />
            فیـلم آمـوزشی
          </a>
        </Button>
        <Button>
          <a
            class="gap-icon"
            href="../Upload/buyCurrency.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-file" style={{ fontSize: "15px" }} />
            فایل راهنــما
          </a>
        </Button>
      </Row>
      <QuestionModal />
      <Modal
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        onCancel={() => setCounter(false)}
        footer={[
          <span
            className="colorFooter"
            style={{
              fontSize: "12px",
              justifyContent: "flex-end",
              backgroundColor: themeColors[theme].bg,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                // loading={loading}
                backgroundColor={themeColors.btn.secondary}
                // onClick={insertCompanyDocument}
              >
                بله
              </Button>
              <Button
                backgroundColor={themeColors.btn.danger}
                onClick={() => setCounter(false)}
              >
                خیر
              </Button>
            </div>
          </span>,
        ]}
        open={counter}
        title={"پیغام سیستم"}
      >
        <p>{inputsData?.dataModal?.ErrorDesc}</p>
      </Modal>
    </>
  );
};

export default HelperButtons;
