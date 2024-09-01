import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "antd";
import { Input, ComboBox, Button } from "../../../../components";
import Validation from "../../../../utils/Validation";
import themeColors from "../../../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import EmergingProblem from "../../emerging-problem/emerging-problem";
import { Link } from "react-router-dom";
import TradingList from "../trading-list";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";

const Supplies = () => {
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { theme, colorMode, GUid, role } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState(undefined);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
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

  const getSarrafiRequestListOfUserExport = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
      status: inputsData?.status,
      searchText: inputsData?.searchText,
      startIndex: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
      insertDate: "",
      cesExportTypeTny: 0,
      cesVCodeLng: 0,
    };
    dispatch(handleLoading(true));
    setLoading(true);
    axios({
      url: endpoints.RestAPIs.sellingCurrency.getSarrafiRequestListOfUserExport.url,
      method: endpoints.RestAPIs.sellingCurrency.getSarrafiRequestListOfUserExport.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.Error === 0) {
          setDataSource(res.data?.DealList || []);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res.data?.countOfDeal         || 0,
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
        setLoading(false);
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        setLoading(false);
      });
  };

  useEffect(() => {
    getSarrafiRequestListOfUserExport();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

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
      title: "کد عرضه",
      dataIndex: "cesVCodeLng ",
      align: "center",
    },
    {
      title: "تاریخ ثبت",
      dataIndex: "cesInsertDate",
      align: "center",
    },
    {
      title: "نوع فروش",
      dataIndex: "sellingType",
      align: "center",
    },
    {
      title: "سریال اظهارنامه",
      dataIndex: "declarationSeries",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "cesAmountMny",
      align: "center",
    },
    {
      title: "ارز",
      dataIndex: "currency",
      align: "center",
    },
    {
      title: "نرخ پیشنهادی عرضه (ریال)",
      dataIndex: "suggestedSupplyRate",
      align: "center",
    },
    {
      title: "مهلت ارسال تقاضا",
      dataIndex: "applicatioDeadline",
      align: "center",
    },
    {
      title: "زمان پایان عرضه",
      dataIndex: "ensSupplyTime",
      align: "center",
    },
    {
      title: "تعداد تقاضا",
      dataIndex: "numberRequest",
      align: "center",
    },
    {
      title: "وضعیت عرضه",
      dataIndex: "supplyStatus",
      align: "center",
    },
    {
      title: "جزئیات",
      dataIndex: "detaile",
      align: "center",
      render: (_, { id }, index) => (
        <div className="flex-order-row">
          <Link to={`/Users/AC/Base/CardFileDetaile?${id}`}>
            <Button name={`linkToDetails-${index}`} type="secondary">
              جزئیات
              <i class="fa fa-search" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <Row
        style={{
          padding: "0 40px",
        }}
      >
        <Col sm={24} md={24} xl={8}>
          <div>
            <Button>ایجاد عرضه جدید</Button>
          </div>
        </Col>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              height: "30px",
              border: "none",
              backgroundColor: "#53a93f",
              color: "white",
              padding: "1px 10px",
            }}
            className="fontBtn"
          >
            <div class="gap-icon">
              <i class="fa fa-comment" />
              مشارکت در بازطراحی و بهبود عملکرد سامانه نیما
            </div>
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
        </div>
      </Row>
      <Row style={{ marginTop: "25px" }}>
        <Col sm={24} md={12} xl={4} style={{ paddingLeft: "10px" }}>
          <Input
            value={inputsData?.date}
            name="date"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.date}
            type="text"
            space="0"
            title="تاریخ"
          />
        </Col>
        <Col sm={24} md={12} xl={4} style={{ paddingLeft: "10px" }}>
          <ComboBox
            title="وضعیت"
            defaultValue={inputsData?.status}
            name="status"
            onChange={handleChangeInputs}
            // options={dataSource}
            optionTitle="وضعیت"
            optionValue="id"
            validations={[["required"]]}
            error={errors?.status}
          />
        </Col>
        <Col sm={24} md={12} xl={4} style={{ paddingLeft: "10px" }}>
          <ComboBox
            title="نوع فروش"
            defaultValue={inputsData?.sellingType}
            name="sellingType"
            onChange={handleChangeInputs}
            // options={option}
            optionTitle="نوع فروش"
            optionValue="id"
            validations={[["required"]]}
            error={errors?.sellingType}
          />
        </Col>
        <Col sm={24} md={12} xl={4} style={{ paddingLeft: "10px" }}>
          <Input
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.searchText}
            type="text"
            space="0"
            title="متن جستجو"
          />
        </Col>
        <Col sm={24} md={12} xl={2}>
          <div className="marginBtn">
            <Button>
              <i class="fa fa-search" />
              جستجو
            </Button>
          </div>
        </Col>
      </Row>
      <span className="page-size-combo">
        <label className="page-size-combo--label" htmlFor="page-size">
          نمایش محتویات
        </label>
        <select
          className="page-size-combo--selector"
          id="page-size"
          value={tableParams.pagination.pageSize}
          onChange={handleChangePageSize}
        >
          <option
            value="10"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            10
          </option>
          <option
            value="25"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            25
          </option>
          <option
            value="50"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            50
          </option>
          <option
            value="100"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            100
          </option>
        </select>
      </span>
      <TradingList title={"لیست عرضه ها"} />
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
      />
      <EmergingProblem />
    </>
  );
};

export default Supplies;
