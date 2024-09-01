import React from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "../../../components";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";

function RequestCurrencyAllocationTable({
  tableParams,
  setTableParams,
  loading,
  totalCount,
  dataSource,
  id,
}) {
  const { colorMode } = useSelector((state) => state);
  const history = useHistory();
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

  const clickHandler = (id) => {
    history?.push(
      `/Users/AC/Currency/CurrencyAllocationRequestDetailPage?${id}`
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
      title: "کد ثبت سفارش",
      dataIndex: "prfOrderNoStr",
      align: "center",
    },
    {
      title: "ردیف درخواست",
      dataIndex: "carRowNoInt",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "carStatusStr",
      align: "center",
    },
    {
      title: "فرآیند فعلی",
      dataIndex: "carActiveStatusStr",
      align: "center",
    },
    {
      title: "مبلغ درخواست",
      dataIndex: "carAmountMny",
      align: "center",
      render: (text) => {
        if (text !== null && text !== undefined) {
          return text === 0 ? "0.00" : Number(text).toLocaleString();
        }
        return null;
      },
    },
    {
      title: "ارز درخواست",
      dataIndex: "curNameStr",
      align: "center",
    },
    {
      title: "تاریخ ایجاد درخواست",
      dataIndex: "carCreateDateShamsi",
      align: "center",
    },

    {
      title: "محل تامین ارز",
      dataIndex: "ccsNameStr",
      align: "center",
    },
    {
      title: "نرخ ارز",
      dataIndex: "ccrNameStr",
      align: "center",
    },
    {
      title: "نوع درخواست",
      dataIndex: "crtNameStr",
      align: "center",
    },
    {
      title: "شعبه",
      dataIndex: "bchNameStr",
      align: "center",
    },
    {
      title: "تاریخ تخصیص",
      dataIndex: "carIssueDateShamsi",
      align: "center",
    },
    {
      title: "عملیات",
      dataIndex: "carVCodeLng",
      align: "center",
      render: (id, index) => (
        <div className="flex-order-row">
          <Button onClick={() => clickHandler(id)} type="secondary">
            جزییات
            <i class="fa fa-search" />
          </Button>
        </div>
      ),
    },
    {
      title: "تاریخچه",
      dataIndex: "carVCodeLng",
      align: "center",
      render: (id, index) => (
        <div className="flex-order-row">
          <Link
            to={`/Users/AC/Currency/CurrencyAllocationRequestManagementHistory?${id}`}
          >
            <Button name={`linkToDetails-${index}`} type="secondary">
              تاریخچه
              <i class="fa fa-edit" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <Table
        id={id}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          ...tableParams.pagination,
          total: totalCount, // Set the total count from the state
        }}
        loading={loading}
        onChange={handleTableChange}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
        handleChangePageSize={handleChangePageSize}
      />
    </>
  );
}
export default RequestCurrencyAllocationTable;
