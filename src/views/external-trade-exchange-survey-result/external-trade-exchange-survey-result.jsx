import React, { useEffect, useState } from "react";
import { Col, Rate, Row } from "antd";
import { Button, ComboBox, Input, Table } from "../../components";
import Validation from "../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../services/endpoints";
import axios from "axios";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import DetailseSurvey from "./details-survey";
import themeColors from "../../configs/theme";

const ExternalTradeExchangeSurveyResult = () => {
  const { role, GUid, colorMode } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [dataDetails, setDataDetails] = useState({});

  const [showModale, setShowModale] = useState({
    showModaleDetails: false,
    showModaleStatus: false,
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

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

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
  };

  const details = (e, record) => {
    e.preventDefault();
    setShowModale((prvs) => ({
      ...prvs,
      showModaleDetails: true,
    }));
    setInputsData({ ...inputsData, detailsList: [record] });
    setHasMounted(true);
  };

  const select = (e, record) => {
    setInputsData((prvs) => ({
      ...prvs,
      exchangeName: record?.sfcNameStr,
      sfcVCodeInt: record?.sfcVCodeInt,
    }));
    setShowModale((prvs) => ({
      ...prvs,
      showModale: false,
    }));
  };

  const view = (e, record) => {
    e.preventDefault();
    dispatch(
      handleMessageModal({
        isModalOpen: true,
        title: "آدرس و تلفن",
        type: "address",
        describe: (
          <>
            <div
              style={{
                color: "#737373",
                fontSize: "12px",
                margin: "10px 0",
              }}
            >
              <b
                style={{
                  color: "red",
                  padding: "0 5px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                آدرس :
              </b>
              <span>{record?.sfcAddressStr}</span>
            </div>
            <div>
              <b
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                تلفن :
              </b>
              <span>
                {record?.sfcPhoneNumberStr === null
                  ? "null"
                  : record?.sfcPhoneNumberStr}
              </span>
            </div>
          </>
        ),
      })
    );
  };

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
      title: "کد صرافی",
      dataIndex: "sfcVCodeInt",
      align: "center",
    },
    {
      title: "نام صرافی",
      dataIndex: "sfcNameStr",
      align: "center",
    },
    {
      title: "شهرت صرافی",
      dataIndex: "sfcBizNameStr",
      align: "center",
    },
    {
      title: "شهر",
      dataIndex: "sfcCityNameStr",
      align: "center",
    },
    {
      title: "آدرس و تلفن",
      dataIndex: "bnkNameEnStr",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={(e) => view(e, record)}>مشاهده</Button>
        </div>
      ),
    },
    {
      title: "نتایج نظرسنجی ",
      dataIndex: "cnyNameStr",
      align: "center",
      render: (_, record) => (
        <div style={{ padding: "5px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="rate-average">
              {parseFloat(record?.RateAverage)?.toFixed(1)}
            </span>
            <Rate
              disabled={true}
              value={parseFloat(record?.RateAverage)?.toFixed(1)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              از مجموع <b>({record?.survayCount})</b> نظر
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "3px",
                cursor: "pointer",
              }}
              onClick={(e) => details(e, record)}
            >
              <i className="fa fa-plus" />
              <span>جزئیات</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const getsarrafiCompanyListWithSurveyStatus = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      startIndex: Number(
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
          1
      ),
      pageSize: tableParams?.pagination?.pageSize,
      sfcVCodeInt: inputsData?.sfcVCodeInt || "",
      sfcNameStr: inputsData?.sfcNameStr || "",
      surveyStatus: inputsData?.surveyStatus || 1,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getsarrafiCompanyListWithSurveyStatus
        .url,
      method:
        endpoints.RestAPIs.buyCurrency.getsarrafiCompanyListWithSurveyStatus
          .method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          setInputsData({
            ...inputsData,
            sarrafiCompanyList: res?.data?.sarrafiCompanyList,
          });
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res?.data?.count || 0,
            },
          });
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
  };

  const search = (e) => {
    e.preventDefault();
    if (tableParams.pagination.current === 1) {
      getsarrafiCompanyListWithSurveyStatus();
    } else {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: 1,
        },
      });
    }
  };

  useEffect(() => {
    getsarrafiCompanyListWithSurveyStatus();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  const getSurveyStatus = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSurveyStatus.url,
      method: endpoints.RestAPIs.buyCurrency.getSurveyStatus.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setDataDetails({ ...dataDetails, viewOrder: res?.data?.Result });
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
  };

  useEffect(() => {
    getSurveyStatus();
  }, []);

  return (
    <div>
      <Row>
        <Col sm={24} md={12} xl={6}>
          <Input
            title="کد صرافی"
            value={inputsData?.sfcVCodeInt}
            name="sfcVCodeInt"
            onChange={handleChangeInputs}
            labelWidth="50px"
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <Input
            title="نام صرافی"
            value={inputsData?.sfcNameStr}
            name="sfcNameStr"
            onChange={handleChangeInputs}
            labelWidth="50px"
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <ComboBox
            title="ترتیب نمایش"
            defaultValue={inputsData?.surveyStatus || 1}
            name="surveyStatus"
            onChange={handleChangeInputs}
            options={dataDetails?.viewOrder}
            width="150px"
            optionTitle="descriptionPersian"
            optionValue="value"
            // validations={[["required"]]}
            // error={errors?.surveyStatus}
          />
        </Col>
        <div>
          <Button onClick={search}>جستجو</Button>
        </div>
      </Row>
      <DetailseSurvey
        inputsData={inputsData}
        setInputsData={setInputsData}
        dataDetails={dataDetails}
        setDataDetails={setDataDetails}
        hasMounted={hasMounted}
        setHasMounted={setHasMounted}
        showModale={showModale}
        setShowModale={setShowModale}
      />
      <Table
        dataSource={inputsData?.sarrafiCompanyList}
        columns={columns}
        pagination={tableParams.pagination}
        handleChangePageSize={handleChangePageSize}
        // loading={loading}
        onChange={handleTableChange}
        rowKey="sfcVCodeInt"
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
      />
    </div>
  );
};

export default ExternalTradeExchangeSurveyResult;
