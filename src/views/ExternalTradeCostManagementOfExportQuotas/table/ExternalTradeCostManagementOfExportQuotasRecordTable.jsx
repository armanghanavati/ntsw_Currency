import { useSelector } from "react-redux";
import themeColors from "../../../configs/theme";
import { Table } from "../../../components";

export default function ExternalTradeCostManagementOfExportQuotasRecordTable({
  data,
  loading,
  flag,
  tableParams,
  totalCount,
  handleChangePageSize,
  handleTableChange,
}) {
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  // columns for field data grid----------------------------------
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
      title: " نوع مصرف",
      dataIndex: "MasrafTypeCode",
      align: "center",
      key: "MasrafTypeCode",
    },
    {
      title: " کد",
      dataIndex: "RefID",
      align: "center",
      key: "RefID",
    },
    {
      title: " نوع ارز مصرف",
      dataIndex: "UseCurNameStr",
      align: "center",
      key: "UseCurNameStr",
    },
    {
      title: " مبلغ مصرف ",
      dataIndex: "UseAmountToUseCurrency",
      align: "center",
      key: "UseAmountToUseCurrency",
      render: (text) => {
        if (text !== null && text !== undefined) {
          return text === 0 ? "0.00" : Number(text).toFixed(2);
        }
        return null;
      },
    },
    {
      title: " سریال پروانه  ",
      dataIndex: "CustomCode",
      align: "center",
      key: "CustomCode",
      render: (text, record) => {
        // Assuming you have a "Serial" field in your data
        return (
          <span style={{color:themeColors.comments.red}}>
            {record.CustomCode}-{record.CotageNoStr}
          </span>
        );
      },
    },
    {
      title: "نوع ارز پروانه",
      dataIndex: "cotageCurNameStr",
      align: "center",
      key: "cotageCurNameStr",
      render:(text,record)=>{
        return <span style={{color:themeColors.comments.red}}>{text}</span>
      }
    },
    {
      title: " مبلغ به ارز پروانه ",
      dataIndex: "UseAmountToCotageCurrency",
      align: "center",
      key: "UseAmountToCotageCurrency",
      render: (text) => {
        if (text !== null && text !== undefined) {
          return <span style={{color:themeColors.comments.red}}>{text === 0 ? "0.00" : Number(text).toFixed(2)}</span>;
        }
        return null;
      },
    },
    {
      title: " تاریخ ثبت  ",
      dataIndex: "UseDate",
      align: "center",
      key: "UseDate",
    },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          ...tableParams.pagination,
          total: totalCount, // Set the total count from the state
        }}
        // loading={loading}
        onChange={handleTableChange}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
        handleChangePageSize={handleChangePageSize}
      />
    </div>
  );
}
