import { Card, Typography } from "antd";
import { useState } from "react";
import { changeColorMode } from "../../../state/action-creators";
import { useSelector } from "react-redux";
import themeColors from "../../../configs/theme";
import { useEffect } from "react";
import { Table } from "../../../components";


export default function ExternalTradeNewCostManagementOfPortQuotasTable2({
  data,
  loading,
  flag,
  setData,
}) {
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [sumOfUseRemainToCotageCurrency, setSumOfUseRemainToCotageCurrency] =
    useState(0);

  useEffect(() => {
    // Calculate the sum of "UseRemainToCotageCurrency"

    const sum = data.reduce(
      (acc, item) => acc + (item.UseRemainToCotageCurrency || 0),
      0
    );

    setSumOfUseRemainToCotageCurrency(sum);
  }, [data]);

  // columns for field data grid----------------------------------
  const columns = [
    {
      title: "نحوه مصرف",
      dataIndex: "MasrafTypeStr",
      align: "center",
      key: "MasrafTypeStr",
    },
    {
      title: " کد",
      dataIndex: "RefID",
      align: "center",
      key: "RefID",
    },
    {
      title: "نوع ارز",
      dataIndex: "UseCurNameStr",
      align: "center",
      key: "UseCurNameStr",
    },
    {
      title: " تاریخ",
      dataIndex: "UseDate",
      align: "center",
      key: "UseDate",
    },
    {
      title: "  مبلغ",
      dataIndex: "UseTotalAmount",
      align: "center",
      key: "UseTotalAmount",
      render:(text, record) => {
        return <span>{Number(text).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>

    }    },
    {
      title: " مانده مصرف نشده",
      dataIndex: "UseRemainAmount",
      align: "center",
      key: "UseRemainAmount",
      render:(text, record) => {
        return <span>{Number(text).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>

    }    },
    {
      title: "معادل مقدار مانده مصرف نشده نسبت به ارز پروانه(دلار آمریکا)",
      dataIndex: "UseRemainToCotageCurrency",
      align: "center",
      key: "UseRemainToCotageCurrency",
    
      render(text, record) {
        return {
          props: {
            style: { background:themeColors.btn.darkGreen, color:"white" }
          },
          children: <div>{!isNaN(Number(text)) ? Number(text).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : ''}</div>
        };
      }
    },
    {
      title: "عملیات",
      dataIndex: "RefID",
      align: "center",
      key: "RefID",
      width: "132px",
      render: (RefID, record) => (
        <div>
          <button
            onClick={() => {
              setData((prevData) =>
                prevData.filter((item) => item.RefID !== RefID)
              );
            }}
            style={{
              backgroundColor: themeColors.btn.danger, // Customize button styles
              border: "none",
              borderRadius: "2px",
              color: "white",
            }}
          >
            حذف{" "}
          </button>
        </div>
      ),
    },
  ];
  const staticRowColumns = [
    {
      title: "مقدار کد و جمع",
      dataIndex: "StaticColumn",
      key: "StaticColumn",
      align: "center",

      render: () => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <span>مجموع معادل مقدار مانده مصرف به ارز پروانه :</span>
          <span>{Number(sumOfUseRemainToCotageCurrency).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
      ),
   
    },
  ];



  // this code style for footer tabe----------------------------------------------
  const elements = document.querySelectorAll(".custom-footer-table");
  // Loop through each element and apply styles to their parent nodes
  elements.forEach((element) => {
    const parent = element.parentElement;
    parent.style.backgroundColor = themeColors.btn.darkGreen;
    parent.style.color = "white";
    parent.style.padding = "15px";
    parent.style.margin = "0";


  });
  const staticRow = {
    StaticColumn1: "hi",
    StaticColumn2: sumOfUseRemainToCotageCurrency,
  };

  return (
    <div style={{ marginTop: "50px" }}>
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
        rowKey={(record, index) => index}
        hasPageSizeCombo={false}
        // Use an appropriate unique key for each row
        footer={() => (
          // <Table
          //   columns={staticRowColumns}
          //   dataSource={[staticRow]}
          //   pagination={false}
          //   showHeader={false}
          //   hasPageSizeCombo={false}
            
          //   className="custom-footer-table"
          // />
       <div style={{display:"flex", justifyContent:"space-around",backgroundColor: themeColors.btn.darkGreen}} className="custom-footer-table ">
        <p>     <span>مجموع معادل مقدار مانده مصرف به ارز پروانه </span></p>
        <p>
        <span>{Number(sumOfUseRemainToCotageCurrency).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </p>
       </div>
        )}
      />
     



    </div>
  );
}
