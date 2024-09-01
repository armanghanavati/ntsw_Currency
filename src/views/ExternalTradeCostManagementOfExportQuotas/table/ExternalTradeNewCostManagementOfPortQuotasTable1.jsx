
import { useState } from "react";
import { changeColorMode } from "../../../state/action-creators";
import { useSelector } from "react-redux";
import themeColors from "../../../configs/theme";
import { Table } from "../../../components";

export default function ExternalTradeNewCostManagementOfPortQuotasTable1({
  data,
  loading,
  flag,
  setData,
  setcurrencyRateType,
  disableButton
}) {
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  // columns for field data grid----------------------------------
  const columns = [
    {
      title: "سال",
      dataIndex: "cotageYear",
      align: "center",
      key: "cotageYear",
      render: (text, record) => {
        // Assuming that text is in the format "13970725"
        const year = text.slice(0, 4);
        const month = text.slice(4, 6);
        const day = text.slice(6, 8);
        return `${year}/${month}/${day}`;
      },
    },
    {
      title: " گمرگ",
      dataIndex: "CustomNameStr",
      align: "center",
      key: "CustomNameStr",
    },
    {
      title: "کوتاژ",
      dataIndex: "CotageCode",
      align: "center",
      key: "CotageCode",
    },
    {
      title: " ارز",
      dataIndex: "cotageCurNameStr",
      align: "center",
      key: "cotageCurNameStr",
    },
    {
      title: " تاریخ ارزیابی  ",
      dataIndex: "cotageEvaluationDate",
      align: "center",
      key: "cotageEvaluationDate",
      render: (text, record) => {
        // Assuming that text is in the format "13970725"
        const year = text.slice(0, 4);
        const month = text.slice(4, 6);
        const day = text.slice(6, 8);
        return `${year}/${month}/${day}`;
      },
    },
    {
      title: " مبلغ کل  ",
      dataIndex: "cotageTotalAmount",
      align: "center",
      key: "cotageTotalAmount",
      render:(text, record) => {
        return <span>{Number(text).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>

    }
    },
    {
      title: "مانده",
      dataIndex: "CotageRemainAmount",
      align: "center",
      key: "CotageRemainAmount",
      render:(text, record)=>{
        return Number(text).toLocaleString();
       }
    },
    {
      title: "عملیات",
      dataIndex: "dischargeCountryCode",
      align: "center",
      key: "dischargeCountryCode",
      render: (dischargeCountryCode, record) => (
        <div>
       
            <button
onClick={()=>{
  setData([])
  setcurrencyRateType(null)
}}
              style={{
                backgroundColor: themeColors.btn.danger, // Customize button styles
                border: "none",
                borderRadius: "2px",
                color: "white",
                cursor: disableButton.length > 0 ? "not-allowed" : "pointer",
                opacity: disableButton.length > 0 ? "0.5" : "1",
              }}
              disabled={disableButton.length > 0}
            >
              حذف{" "}
            </button>
         
        </div>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
        pagination={false}
        hasPageSizeCombo={false}
      />
    </div>
  );
}
