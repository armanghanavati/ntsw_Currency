
import { useState } from "react";
import { changeColorMode } from "../../../state/action-creators";
import { useSelector } from "react-redux";
import { Table } from "../../../components";

export default function ExternalTradeCostManagementOfExportQuotasTable({
  data,
  loading,flag

 
}) {
    const { theme, colorMode, role, GUid } = useSelector((state) => state);
  // columns for field data grid----------------------------------
  const columns = [
    {
      title: "کوتاژ",
      dataIndex: "saderatKotaj",
      align: "center",
      key: "saderatKotaj",
    },
    {
      title: " گمرگ",
      dataIndex: "saderatDescustCode",
      align: "center",
      key: "saderatDescustCode",
    },
    {
      title: " نحوه بازگشت	",
      dataIndex: "masrafTypeDsc",
      align: "center",
      key: "masrafTypeDsc",
    },
    {
      title: " کد",
      dataIndex: "Code",
      align: "center",
      key: "Code",
    },
    {
      title: " مبلغ  ",
      dataIndex: "mablaghArzi",
      align: "center",
      key: "mablaghArzi",
      render:(text,record)=>{
        return <span>{Number(text).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
      }
    },
    {
      title: " ارز  ",
      dataIndex: "CurNameStr",
      align: "center",
      key: "CurNameStr",
    },
    {
      title: " مبلغ به ارز کوتاژ	  ",
      dataIndex: "mablaghMoadelArzPayeh",
      align: "center",
      key: "mablaghMoadelArzPayeh",
      render:(text,record)=>{
        return <span>{Number(text).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
      }
    },
    {
      title: " تاریخ ثبت  ",
      dataIndex: "tarikhSabt",
      align: "center",
      key: "tarikhSabt",
      render: (text, record) => {
        // Assuming that text is in the format "13970725"
        if (!text) {
          return null; // Return null for empty dates
        }
  
        const year = text.slice(0, 4);
        const month = text.slice(4, 6);
        const day = text.slice(6, 8);
        return `${year}/${month}/${day}`;
      },
    },
  ];
  const columns2=[
    
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
        title: " ارز  ",
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
          if (!text) {
            return null; // Return null for empty dates
          }
    
          const year = text.slice(0, 4);
          const month = text.slice(4, 6);
          const day = text.slice(6, 8);
          return `${year}/${month}/${day}`;
        },
      },
      {
        title: " مبلغ کل",
        dataIndex: "cotageTotalAmount",
        align: "center",
        key: "cotageTotalAmount",
        render:(text,record)=>{
          return <span>{Number(text).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        }
      },
      {
        title: " مانده",
        dataIndex: "CotageRemainAmount",
        align: "center",
        key: "CotageRemainAmount",
        render:(text,record)=>{
          return <span>{Number(text).toLocaleString('en-US')}</span>
        }
      },
      
      
  ]
  return (
    <div style={{marginTop:'50px'}}>
    <Table
      dataSource={data}
      columns={flag ? columns2 : columns}
    
      loading={loading}

      onHeaderRow={() => {
        return {
          style: { backgroundColor: colorMode },
        };
      }}
      hasPageSizeCombo={false}
    />
    </div>
  );
}
