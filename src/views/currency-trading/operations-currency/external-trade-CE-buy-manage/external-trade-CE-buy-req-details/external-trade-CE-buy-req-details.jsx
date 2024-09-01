import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { endpoints } from "../../../../../services/endpoints";
import { handleLoading } from "../../../../../state/action-creators";
import { useLocation } from "react-router";
import Validation from "../../../../../utils/Validation";
import { Col, Row, Table } from "antd";
import { Button, Input, TitleBox } from "../../../../../components";
import AllInfo from "../all-info/all-info";
import themeColors from "../../../../../configs/theme";
import { useHistory } from "react-router-dom";
import DetailsSteps from "../../../detailsS-steps/detailsS-steps";
import Suggestions from "../suggestions/suggestions";
import PaymentRials from "../payment-rials/payment-rials";

const ExternalTradeCEBuyReqDetails = () => {
  const { colorMode, GUid, role } = useSelector((state) => state);
  const [inputsData, setInputsData] = useState({});
  const [editingId, setEditingId] = useState(undefined);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  let history = useHistory();

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const getSarrafiRequestAllInfo = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
      sfrVCodeInt: editingId,
    };
    dispatch(handleLoading(true));
    setLoading(true);
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSarrafiRequestAllInfo.url,
      method: endpoints.RestAPIs.buyCurrency.getSarrafiRequestAllInfo.method,
      data: postData,
    })
      .then((res) => {
        setInputsData({
          ...inputsData,
          allInfo: res?.data,
        });
        dispatch(handleLoading(false));
        setLoading(false);
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        setLoading(false);
      });
  };

  useEffect(() => {
    if (search?.toLowerCase()?.includes("detaile")) {
      setEditingId(search?.split("=")[1]);
    }
    getSarrafiRequestAllInfo();
  }, []);

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

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const columns = [
    {
      title: "ردیف گواهی",
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
      title: "نوع ارز گواهی",
      dataIndex: "sfdcurDescSabtsefareshStr",
      align: "center",
    },
    {
      title: "مبلغ معادل با نوع ارز گواهی",
      dataIndex: "sfdEqualentAmountSabtsefareshMny",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "sfdAmountMny",
      align: "center",
    },
  ];

  const goBack = (e) => {
    e.preventDefault();
    history.push("/Users/AC/Currency/ExternalTradeCEBuyManage");
  };

  return (
    <>
      <DetailsSteps prfStatusTny={inputsData?.allInfo?.sfrStatusTny} />
      <Row>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="کد درخواست"
            value={inputsData?.allInfo?.sfrStatusTny}
            name="sfrStatusTny"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.sfrStatusTny}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="نوع ارز درخواست"
            value={inputsData?.allInfo?.sfrcurNameStr}
            name="sfrcurNameStr"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.sfrcurNameStr}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="مبلغ"
            value={inputsData?.allInfo?.sfrTotalAmountMny}
            name="sfrTotalAmountMny"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.sfrTotalAmountMny}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
      </Row>
      <Table
        dataSource={inputsData?.allInfo?.sarrafiRequestDetailList}
        columns={columns}
        style={{ margin: "10px 0 20px" }}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
      />
      <AllInfo
        inputsData={inputsData}
        handleChangeInputs={handleChangeInputs}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "30px",
        }}
      >
        {inputsData?.allInfo?.sfrStatusTny === 1 &&
        inputsData?.allInfo?.sfrActiveStatusTny !== 0 ? (
          <Button backgroundColor={themeColors.btn.secondary}>
            <i class="fa fa-paper-plane-o" />
            ثبت نهایی درخواست
          </Button>
        ) : (
          <Button
            disabled={!inputsData?.allInfo?.isShowEditRequestButton}
            backgroundColor={themeColors.btn.secondary}
          >
            <i class="fa fa-edit" />
            ویرایش
          </Button>
        )}
        <Button backgroundColor={themeColors.btn.warning}>
          <i className="fa fa-warning" />
          حذف درخواست
        </Button>
      </div>
      {/* {inputsData?.allInfo?.isShowOfferPart && ( */}
      <Suggestions
        inputsData={inputsData}
        setInputsData={setInputsData}
        editingId={editingId}
      />
      {/* // )} */}
      {inputsData?.allInfo?.isShowPaymentPart && (
        <PaymentRials inputsData={inputsData} />
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 0 4px rgba(0,0,0,.3)",
          padding: "8px",
          marginTop: "20px",
        }}
      >
        <Button onClick={goBack}>
          <i className="btn-label fa fa-share" />
          بازگشت
        </Button>
      </div>
    </>
  );
};

export default ExternalTradeCEBuyReqDetails;
