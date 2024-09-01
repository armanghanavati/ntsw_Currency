import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { endpoints } from "../../../services/endpoints";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLoading } from "../../../state/action-creators";
import axios from "axios";
import { useEffect } from "react";
import { Col, Modal, Result, Row } from "antd";
import { Button } from "../../../components";
import themeColors from "../../../configs/theme";

const PaymentReturnPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { search } = useLocation();
  const { GUid, role, theme } = useSelector((state) => state);
  const [paymentResult, setPaymentResult] = useState();
  const status = paymentResult?.ErrorCode === 0 ? "success" : "error";

  const queryParams = new URLSearchParams(search);
  const orderId = queryParams.get("OrderId");
  const hashedCardNo = queryParams.get("hashedCardNo");
  const primaryAccNo = queryParams.get("primaryAccNo");
  const switchResCode = queryParams.get("switchResCode") ?? 0;
  const resCode = queryParams.get("ResCode");
  const token = queryParams.get("Token");

  const verifyPayment = () => {
    const postData = {
      cnpVCodeInt: orderId,
      cnpUrlVcodeInt: 0,
      cnpNationalCodeStr: "",
      cnpTrackingId: "",
      cnpToken: token,
      cnpEuroAmount: 0,
      cnpRialAmount: 0,
      cnpRateInt: 0,
      cnpProductType: 0,
      cnpProductTypeStr: "",
      cnpYear: 0,
      cnpPaymentStatus: 0,
      cnpPaymentStatusStr: "",
      cnpSendToCbiStatus: 0,
      cnpSendToCbiStatusStr: "",
      cnpInsertDate: "",
      cnpUpdateDate: "",
      sadadResponse: resCode,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.reconciliationPortal.verifyPayment.url,
      method: endpoints.RestAPIs.reconciliationPortal.verifyPayment.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.ErrorCode === 0) {
          setPaymentResult(res.data?.Result);
        } else {
          setIsOpenModal(true);
          setPaymentResult(res.data);
        }
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };
  useEffect(() => {
    verifyPayment();
  }, []);

  const onClickHandler = (e) => {
    e.preventDefault();
    setIsOpenModal(false);
    history?.push(`/Users/AC/Currency/ReconciliationPortal`);
  };

  return (
    <>
      <Row>
        <Col>
          {paymentResult?.ErrorCode === undefined ? (
            <p>لطفا منتظر بمانید...</p>
          ) : (
            <Result
              status={status}
              title={paymentResult?.Description}
              subTitle={
                !!paymentResult?.SystemTraceNo
                  ? `شماره پیگیری: ${paymentResult?.SystemTraceNo}-شماره مرجع${paymentResult?.RetrivalRefNo}`
                  : ""
              }
            />
          )}
        </Col>
      </Row>
      <Row justify="center">
        <Button
          type="primary"
          key="console"
          backgroundColor={themeColors.btn.primary}
          onClick={() =>
            history?.push("/Users/AC/Currency/ReconciliationPortal")
          }
        >
          بازگشت
        </Button>
      </Row>
      {isOpenModal && (
        <Modal
          className="questionModal"
          style={{
            backgroundColor: themeColors[theme]?.menueBg,
            color: themeColors[theme]?.text,
          }}
          onCancel={onClickHandler}
          footer={[
            <Button
              backgroundColor={themeColors.btn.danger}
              onClick={onClickHandler}
            >
              بستن
            </Button>,
          ]}
          open={isOpenModal}
          title={"انتخاب بانک"}
        >
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {paymentResult?.ErrorDesc}
          </h1>
        </Modal>
      )}
    </>
  );
};

export default PaymentReturnPage;
