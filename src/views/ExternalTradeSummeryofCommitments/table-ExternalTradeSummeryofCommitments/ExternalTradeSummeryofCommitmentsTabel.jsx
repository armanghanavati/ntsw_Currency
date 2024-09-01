import React, { useEffect, useState } from "react";
import { Table } from "antd";
import themeColors from "../../../configs/theme";

import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../services/endpoints";
import { MessageModal, Modal } from "../../../components";
// function ExternalTradeSummeryofCommitmentsTabel is table for ExternalTradeSummeryofCommitments pages-----------------------------
const ExternalTradeSummeryofCommitmentsTabel = ({ isLegal, nationalCode,buttonFlag }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });



  // columns for column data grid --------------------------------------------------
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
      title: "کد ثبت سفارش",
      dataIndex: "orderNoStr",
      align: "center",
      key: "nationalID"
    },
    {
      title: "  شماره ردیف تعهد",
      dataIndex: "radifNo",
      align: "center",
      key: "radifNo"
    },
    {
      title: "شعبه ",
      dataIndex: "bankBranch",
      align: "center",
      key: 'bankBranch'
    },
    {
      title: "  ارز",
      dataIndex: "currencyCode",
      align: "center",
      key: "currencyCode"
    },
    {
      title: " تعهد اولیه",
      dataIndex: "initialCommitmentAmount",
      align: "center",
      key: "initialCommitmentAmount",
      render: (text) => {
        if (text !== null && text !== undefined) {
          return text === 0 ? '0.00' : Number(text).toLocaleString();
        }
        return null;
      },
    },
    {
      title: " مانده تعهد",
      dataIndex: "commitmentBalance",
      align: "center",
      key: "commitmentBalance",
      render: (text) => {
        if (text !== null && text !== undefined) {
          return text === 0 ? '0.00' : Number(text).toLocaleString();
        }
        return null;
      },
    },
    {
      title: "  تاریخ ایجاد تعهد",
      dataIndex: "commitmentCreateDate",
      align: "center",
      key: "commitmentCreateDate",
      render: (text, record) => {
        // Assuming that text is in the format "13970725"
        const year = text.slice(0, 4);
        const month = text.slice(4, 6);
        const day = text.slice(6, 8);
        return `${year}/${month}/${day}`;
      },
    },
    {
      title: " مهلت رفع تعهد",
      dataIndex: "deadLine",
      align: "center",
      key: "commitmentCreateDate",
      render: (text, record) => {
        // Assuming that text is in the format "13970725"
        const year = text.slice(0, 4);
        const month = text.slice(4, 6);
        const day = text.slice(6, 8);
        return `${year}/${month}/${day}`;
      },
    },
    {
      title: " وضعیت رفع تعهد",
      dataIndex: "commitmentStatus",
      align: "center",
      key: "commitmentStatus"
    },
  ];

  // this two function for change pagination to datagrid------------------------------------------
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

  // this function to get data fromserver and pass data of that to data grid-------------------------------------
  const getExternalTradeSummeryofCommitments = () => {
    if (nationalCode) {
      const postData = {
        nationalCodeStr: nationalCode,
        year: null,
        urlVCodeInt: role,
        ssdsshGUID: GUid,
      };
      setLoading(true)
      dispatch(handleLoading(true));
      axios({
        url: endpoints.RestAPIs.ObligationEliminate.GetImportObligationsSummeryDetails.url,
        method: endpoints.RestAPIs.ObligationEliminate.GetImportObligationsSummeryDetails.method,
        data: postData,
      })
        .then((res) => {

          
          if (res?.data?.ErrorCode === 0) {
            // this is set data
          setDataSource(res?.data?.currencyObligationDetails.currencyObligationList)
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res.data?.totalCount || 0,
            },
          });
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: res?.data?.ErrorDesc,
              })
            );
          }
          setLoading(false)
          dispatch(handleLoading(false));
        })
        .catch((err) => {
          setLoading(false)
          dispatch(handleLoading(false));
        });
    }
  };
  // this useefect for render function get data when component render get data-------------------------------------
  useEffect(() => {
    getExternalTradeSummeryofCommitments()

  }, [buttonFlag])
  // return function-------------------------------------------------
  return (
    <>

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

    </>
  )
};

export default ExternalTradeSummeryofCommitmentsTabel;
