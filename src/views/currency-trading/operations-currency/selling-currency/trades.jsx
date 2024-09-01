import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "antd";
import { Input, ComboBox, Button } from "../../../../components";
import Validation from "../../../../utils/Validation";
import themeColors from "../../../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import EmergingProblem from "../../emerging-problem/emerging-problem";
import { Link } from "react-router-dom";
import TradingList from "../trading-list";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
const Trades = () => {
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { theme, colorMode, GUid, role } = useSelector((state) => state);
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

  const getDealListOfUserExport = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
      status: inputsData?.status||-1,
      searchText: inputsData?.searchText,
      startIndex: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
      insertDate: "",
      cesExportTypeTny: 0,
      cesVCodeLng: 0,
    };
    dispatch(handleLoading(true));
    setLoading(true)
    axios({
      url: endpoints.RestAPIs.sellingCurrency.getDealListOfUserExport.url,
      method: endpoints.RestAPIs.sellingCurrency.getDealListOfUserExport.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.Error === 0) {
          setDataSource(res.data?.DealList || []);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res.data?.countOfDeal || 0,
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
        setLoading(false)
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        setLoading(false)
      });
  };

  useEffect(() => {
    getDealListOfUserExport();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

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
      title: "کد معامله",
      dataIndex: "deeDealVCodeLng",
      align: "center",
    },
    {
      title: "کد عرضه",
      dataIndex: "cesVCodeLng",
      align: "center",
    },
    {
      title: "متقاضی",
      dataIndex: "sfcNameStr",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "deeDealAmountMny",
      align: "center",
    },
    {
      title: "نام ارز",
      dataIndex: "curNameStr",
      align: "center",
    },
    {
      title: "نرخ معامله (ریال)",
      dataIndex: "CurCoe",
      align: "center",
    },
    {
      title: "وضعیت معامله",
      dataIndex: "deeStatusStr",
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
      <Row style={{ padding: "0 25px" }}>
        <Col style={{ marginLeft: "12px" }} sm={24} md={24} xl={6}>
          <ComboBox
            title="وضعیت"
            defaultValue={inputsData?.status}
            name="status"
            onChange={handleChangeInputs}
            options={dataSource}
            optionTitle="شماره ثبت سفارش"
            optionValue="id"
            validations={[["required"]]}
            error={errors?.status}
          />
        </Col>
        <Col sm={24} md={20} xl={6}>
          <Input
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.searchText}
            type="text"
            space="12px"
            title="متن جستجو"
          />
        </Col>
        <Col sm={24} md={2} xl={2}>
          <Button onClick={getDealListOfUserExport}>
            <i class="fa fa-search" />
            جستجو
          </Button>
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
      <TradingList title={"لیست معاملات"} />
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

export default Trades;
