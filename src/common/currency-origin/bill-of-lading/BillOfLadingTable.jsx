import { Table } from "../../../components";
import modes from "../../../enums/modes";
import { Table as TableAntd } from "antd";
const BillOfLadingTable = ({
  mode = modes.Show,
  loading,
  dataSource,
  selectedRowKeys,
  setSelectedRowKeys,
  rowKey = "BillOfLaddingTrackingcode",
  isBarFarabaran,
}) => {
  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => <>{index + 1}</>,
    },
    ...(isBarFarabaran
      ? [
          {
            title: "کدرهگیری بارنامه",
            align: "center",
            render: (_, { pcbBOLTrackingCode, BillOfLaddingTrackingcode }) => (
              <div className="flex-order-row">
                {mode === modes.Show
                  ? pcbBOLTrackingCode
                  : BillOfLaddingTrackingcode}
              </div>
            ),
          },
        ]
      : []),
    {
      title: "شماره بارنامه",
      align: "center",
      render: (_, { pcbBOLNoStr = "", BillOfLadingNumber }) => (
        <div className="flex-order-row">
          {mode === modes.Show ? pcbBOLNoStr : BillOfLadingNumber}
        </div>
      ),
    },
    {
      title: "تاریخ صدور بارنامه",
      align: "center",
      render: (_, { pcbBOLDate = "", date }) => (
        <div className="flex-order-row">
          {mode === modes?.Show
            ? pcbBOLDate
            : isBarFarabaran
            ? pcbBOLDate.split("T")[0]
            : date}
        </div>
      ),
    },
    ...(mode !== modes.Show ? [TableAntd.SELECTION_COLUMN] : []),
  ];

  const rowSelection = {
    columnTitle: <>حذف</>,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
  };

  return (
    <Table
      hasPageSizeCombo={false}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      loading={loading}
      rowKey={rowKey}
      rowSelection={mode !== modes.Show && rowSelection}
    />
  );
};

export default BillOfLadingTable;
