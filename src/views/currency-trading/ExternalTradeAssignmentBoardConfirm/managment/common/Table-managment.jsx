import React from "react";
import { Button, Table } from "../../../../../components";
import themeColors from "../../../../../configs/theme";
import convertJalaliDateToGregorian from "../../../../../configs/helpers/convert-jalali-date-to-gregorian";
import convertGregorianDateToJalali from "../../../../../configs/helpers/convert-gregorian -date-to-jalali";
import StringHelpers from "../../../../../configs/helpers/string-helpers";

const Table_Managment = ({
  dataSource,
  loading,
  setView,
  handleChangePageSize,
  handleTableChange,
  tableParams,
  setShowDescription,
  setData,
}) => {
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
      title: "کد آگهی",
      dataIndex: "advVCodeInt",
      align: "center",
    },
    {
      title: "تاریخ ایجاد آگهی",
      dataIndex: "advInsertDate",
      align: "center",
      render: (_, { advInsertDate }) => {
        const temp = advInsertDate.split("T")[0];
        const date = temp.split("-");
        let day = date[2];
        let month = date[1];
        let year = date[0];
        let datepicker = year + "/" + month + "/" + day;
        const tempDateAndTime =
          convertGregorianDateToJalali(datepicker) +
          "  " +
          advInsertDate.split("T")[1];
        return <sapn className="flex-order-row">{tempDateAndTime}</sapn>;
      },
    },
    {
      title: "نام صادر کننده",
      dataIndex: "ownerName",
      align: "center",
    },
    {
      title: "نوع ارز",
      dataIndex: "curNameStr",
      align: "center",
    },
    {
      title: "مبلغ ارز",
      dataIndex: "advAmount",
      align: "center",
      render: (item, { advAmount }, index) => (
        <>{StringHelpers.formatNumber(advAmount)}</>
      ),
    },
    {
      title: "کشور",
      dataIndex: "advCountryName",
      align: "center",
    },
    {
      title: "بانک",
      dataIndex: "advBankName",
      align: "center",
    },
    {
      title: "نرخ (به ریال)",
      dataIndex: "advUnitPriceMny",
      align: "center",
      render: (item, { advUnitPriceMny }, index) => (
        <>{StringHelpers.formatNumber(advUnitPriceMny)}</>
      ),
    },
    {
      title: "زمان صدور حواله",
      dataIndex: "advRialiConditionsStr",
      align: "center",
    },
    {
      title: "توضیحات	",
      align: "center",
      render: (_, record) => (
        <div className="flex-order-row">
          <Button
            type="secondary"
            disabled={!!record?.advDealConditions ? false : true}
            onClick={(e) => {
              e.preventDefault();
              setShowDescription(true);
              setData(record);
            }}
          >
            نمایش
            <i class="fa fa-check" aria-hidden="true"></i>
          </Button>
        </div>
      ),
    },
    {
      title: "اطلاعات تماس",
      align: "center",
      render: (_, record) => (
        <div className="flex-order-row">
          <Button
            type="secondary"
            backgroundColor={themeColors.btn.secondary}
            onClick={(e) => {
              e.preventDefault();
              setView(true);
              setData([record]);
            }}
          >
            مشاهده
            <i class="fa fa-check" aria-hidden="true"></i>
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <Table
        handleChangePageSize={handleChangePageSize}
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams?.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Table_Managment;
