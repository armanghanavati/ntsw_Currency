import { Card, Col, Row, Typography } from "antd";
import { useState } from "react";
import { changeColorMode, handleLoading, handleMessageModal } from "../../../state/action-creators";
import { useSelector } from "react-redux";
import themeColors from "../../../configs/theme";
import { useEffect } from "react";
import { Button, Table } from "../../../components";
import { useDispatch } from "react-redux";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function ExternalTradeNewCostManagementOfPortQuotasTable3({
  data,
  loading,
  flag,
  setData,
  cottageCode,
  CustomCode
}) {
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [sumOfUseRemainToCotageCurrency, setSumOfUseRemainToCotageCurrency] =useState(0);

  useEffect(() => {
    // Calculate the sum of "UseRemainToCotageCurrency"
   
    const sum = data?.UseList?.reduce(
      (acc, item) => acc + (item.UseAmountToCotageCurrency || 0),
      0
    );

    setSumOfUseRemainToCotageCurrency(sum);
  }, [data?.UseList]);
  const dispatch = useDispatch()
  const history = useHistory()

  // columns for field data grid----------------------------------
  const newData = data?.UseList?.map((item) => ({
    ...item,
    CottageCode: `${CustomCode}-${cottageCode}`,

  }));
  const columns = [
    {
      title: " سریال پروانه",
      dataIndex: "CottageCode",
      align: "center",
      key: "CottageCode",
    },
    {
      title: "نوع مصرف",
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
      title: " مبلغ مصرف",
      dataIndex: "UseAmountToUseCurrency",
      align: "center",
      key: "UseAmountToUseCurrency",
      render: (text, record) => {
        return <span>{Number(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>

      }
    },
    {
      title: "  مبلغ به ارز پروانه (دلار آمربکا)",
      dataIndex: "UseAmountToCotageCurrency",
      align: "center",
      key: "UseAmountToCotageCurrency",
      render: (text, record) => {
        return <span>{Number(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>

      }
    },

  ];

  const staticRowColumns = [
    {
      title: "مقدار کد و جمع",
      dataIndex: "StaticColumn",
      key: "StaticColumn",
      align: "center",

      render: () => (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <span> جمع مبالغ مصرف به ارز کوتاژ:</span>

          <span>{Number(sumOfUseRemainToCotageCurrency).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      ),
    },
  ];

  // دکمه ی اخر-------------------------------------------------
  function finalRecord() {
    
    const transformedUseList = data?.UseList?.map((item) => ({
      MasrafTypeCode: item.MasrafTypeCode,
      RefID: item.RefID,
      UseRemainToCotageCurrency: item.UseRemainToCotageCurrency,
      UseRemainToUseCurrency: item.UseRemainToCotageCurrency,
      UseCurCode: item.UseCurCode,
      UseCurNameStr: item.UseCurNameStr,
      UseAmountToUseCurrency: item.UseAmountToUseCurrency,
      UseAmountToCotageCurrency: item.UseAmountToCotageCurrency,
      UseDate: item.UseDate,
      
    }));
  
    const postData = {
      UseList: transformedUseList,

      UrlVcodeIntUser: role,
      SessionID: GUid,
      CotageRemainAmount: data?.CotageRemainAmount,
      cotageCurCode: 1,
      CotageCode: cottageCode,
      CustomCode: CustomCode,
      Result: "",
      ErrorCode: 0,
      ErrorDesc: "",
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.ObligationEliminate.SendUseToBank.url,
      method: endpoints.RestAPIs.ObligationEliminate.SendUseToBank.method,
      data: postData,
    })
      .then((res) => {


        if (res.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              title: "موفقیت امیز",
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
              type:"success"
            })
          );
          history.push("/Users/AC/Currency/ExternalTradeCostManagementOfExportQuotas");
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
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
        dataSource={newData}
        columns={columns}
        loading={loading}
        hasPageSizeCombo={false}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
        pagination={false}
        footer={() => (
      
          <div style={{display:"flex", justifyContent:"space-around",backgroundColor: themeColors.btn.darkGreen}} className="custom-footer-table">
          <p>   <span> جمع مبالغ مصرف به ارز کوتاژ</span></p>
          <p>
          <span>{Number(sumOfUseRemainToCotageCurrency).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </p>
         </div>
        )}
      />
      <div style={{ marginTop: '50px', border: "1px black dashed",padding:"20px", textAlign:"start", }}>
      <p style={{fontSize:"24px" , marginBottom:"8px"}}>توضیحات:</p>
        {data?.UseList?.map((item) => {
          return (

            <div >
            
              <p style={{marginBottom:"10px"}}>
                {`مبلغ `}
                <span style={{ color: "red" }}>{`${item.UseAmountToUseCurrency} ${item.UseCurNameStr}`}</span>
                {` از معامله نیما با کد معامله `}
                <span style={{ color: "red" }}>{item.RefID}</span>
                {` بابت ایفای تعهد بازگشت ارز حاصل از صادرات بر روی پروانه`}
                <span style={{ color: "red" }}> {cottageCode}-{CustomCode} </span>
                {`مصرف می شود که منجر به مستهلک شدن این پروانه به میزان `}

                <span style={{ color: "red" }}>{item.UseAmountToCotageCurrency} دلار آمریکا </span>
                {`می گردد`}
              </p>
            </div>


          );
        })}
      </div>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>

        <Button backgroundColor={themeColors.btn.warning} onClick={() => {
          history.push(
            "/Users/AC/Currency/ExternalTradeCostManagementOfExportQuotas"
          );
        }}>انصراف</Button>


        <Button onClick={finalRecord} >ثبت نهایی</Button>

      </div>
    </div>
  );
}
