import { Col, Row } from "antd";
import { Button, ComboBox, EmergencyProblem, Input } from "../../../components";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import ExternalTradeCostManagementOfExportQuotasRecordTable from "../table/ExternalTradeCostManagementOfExportQuotasRecordTable";
import { useState } from "react";
import { ExcelExportButton } from "../../../common";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import pdfFileRout from "../../../assets/pdfFile/RahnamaDargahSabtMasaref.pdf";
import SerialNumberInput from "../../../components/SerialNumberInput";
import Validation from "../../../utils/Validation";

export default function ExternalTradeCostManagementOfExportQuotasRecord() {
  const dispatch = useDispatch();
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
  const [combo, setCombo] = useState([]);
  const [RefMasrafCode, setRefMasrafCode] = useState(null);
  const [cottageCode, setCottageCode] = useState(null);
  const [customCode, setCustomeCode] = useState(null);
  const [searchTextInnput, setSearchTextInput] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const SaderatKotajlInputRef = useRef(null);
  const [inquiryInputsData, setInquiryInputsData] = useState({});
  const [inquiryErrors, setInquiryErrors] = useState({});
  const customCodeRef = useRef();
  // this function can change pagination------------------------------
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };
  // this function can change size of page-----------------
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
  // useefect to get data for table-------------------------------------------------------
  function fetchData(
    
  

  
    handleDownloadExcel
    

  ) {
    const postData = {
      urlVCodeInt: role,
      SessionID: GUid,
      SaderatKotaj: inquiryInputsData.cottageCode,
      CustomCode: customCode ? customCode : 0,
      MasrafTypeCode: RefMasrafCode,
      searchText: searchTextInnput,
      startIndex: Number((tableParams.pagination.current - 1) * (tableParams.pagination.pageSize) + 1),
      pageSize: handleDownloadExcel ? 10000 : tableParams.pagination.pageSize,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.ObligationEliminate.GetListOfUses.url,

      method: endpoints.RestAPIs.ObligationEliminate.GetListOfUses.method,

      data: postData,
    })
      .then((res) => {
        // this is set data

        if (res.data?.ErrorCode === 0) {

          setTotalCount(res.data.TotalCount);
          setData(res.data.UseList);
          if (!!handleDownloadExcel) {

            const bodyData = res.data.UseList?.map((item, index) => {
              return [
                index + 1,
                item.MasrafTypeCode,
                item.RefID,
                item.UseCurNameStr,
                item.UseAmountToUseCurrency,
                item.CustomCode,
                item.CotageNoStr,
                item.cotageCurNameStr,
                item.UseAmountToCotageCurrency,
                item.UseDate,
              ];
            });
      
            const headerRow = [
              "ردیف",
              " نوع مصرف",
              " کد",
              " نوع ارز مصرف",
              " مبلغ مصرف ",
              " سریال پروانه  ",
              "شماره کوتاژ",
              "نوع ارز پروانه",
              " مبلغ به ارز پروانه ",
              " تاریخ ثبت  ",
            ];
            handleDownloadExcel(headerRow, bodyData, "excellist");
          }
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
  useEffect(() => {
    fetchData();
  }, [tableParams]);
  //   useefect to get comboBox----------------------
  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      SessionID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.ObligationEliminate.GetMasrafType.url,
      method: endpoints.RestAPIs.ObligationEliminate.GetMasrafType.method,
      data: postData,
    })
      .then((res) => {
        // this is set data
        const convertedData = [
          { name: "انتخاب کنید", value: null },
          ...res.data.Result.map((item) => ({
            name: item.descriptionPersian,
            value: item.value,
          })),
        ];

        setCombo(convertedData);
        if (res.data?.ErrorCode === 0) {
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
  }, []);
  // for change comboBox----------------------------
  function changeCombox(name, value) {

    setRefMasrafCode(value);
  }
  function search() {

    fetchData();
  }



 

  const handleDownloadPDF = () => {
    // Create a link to the PDF file
    const pdfFile = pdfFileRout; // Assuming 'pdfFile' contains the path to your PDF

    // Create a hidden link element
    const link = document.createElement("a");
    link.href = pdfFile;
    link.target = "_blank";
    link.download = "RahnamaDargahSabtMasaref.pdf"; // Set the desired file name

    // Trigger a click event on the link to download the PDF
    link.click();
  };
  

  const handleInquiryChangeInputs = (
    name,
    value,
    validationNameList = undefined
  ) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setInquiryErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
    setInquiryInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };
  //   jsx return function-----------------------------
  return (
    <div>
      {" "}
      <Row>
        <Col span={12} xs={24} md={12}>
          <Button
            onClick={() => {
              history.push(
                "/Users/AC/Currency/ExternalTradeNewCostManagementOfPortQuotas"
              );
            }}
          >
            <i className="fa fa-plus"></i>
            ثبت جدید
          </Button>
        </Col>
        <Col span={12} xs={24} md={12}>
          {" "}
          <Button onClick={handleDownloadPDF}>
            <i className="fa fa-folder"></i>
            راهنمای کاربری
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16, 16, 16]} style={{ marginTop: "50px" }}>
        <Col xs={24} md={12} xl={6}>
          <ComboBox
            title="نوع مصرف"
            onChange={changeCombox}
            width="186px"
            optionTitle="name"
            optionValue="value"
            options={combo}
            defaultValue={RefMasrafCode}
            maxWidth="186px"
          />
        </Col>
        <Col xs={24} md={12} xl={8} >
          <SerialNumberInput title=" جستجوپروانه" cottageCodeValue={inquiryInputsData.cottageCode}
            customCodeValue={inquiryInputsData.customCode}
            required
            cottageCodeError={inquiryErrors.cottageCode}
            customCodeError={inquiryErrors.customCode}

            onChange={handleInquiryChangeInputs}
            validations={[["required"]]}
            customCodeRef={customCodeRef}
          />
          {/* 
        <div className="customLicenceInput">
          <div className="flex">
            <Input
              title=" جستجوپروانه"
              onChange={(name, value) => {
                setSaderatKotajlInput(value);
              }}
              minWidth="40px"
              labelWidth="100px"
              className="nasi"
              value={SaderatKotajlInput}
              placeholder="310"
            />
            <div className="flex">
              <Input
                title={
                  <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                    -
                  </span>
                }
                ref={SaderatKotajlInputRef}
                onChange={(name, value) => {
                  if (name === "customCode" && value.length === 5) {
                    SaderatKotajlInput.current.focus();
                  }
                  setCustomeCode(value);
                }}
                minWidth="40px"
                labelWidth="100px"
          placeholder="50100"
                backgroundColorLbale="#fffff"
                value={customCode}
              />
            </div>
          </div>
          </div> */}
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Input
            title="جستجو "
            onChange={(name, value) => {
              setSearchTextInput(value);
            }}
            backgroundColorLbale="#fffff"
            value={searchTextInnput}
          />
        </Col>
        <Col xs={24} md={12} xl={4}>
          {" "}
          <Button onClick={search}>
            <i className="fa fa-search"></i>
            جستجو
          </Button>
        </Col>
      </Row>
      <Row >
        <Col xs={24} md={24}>
          <div className="real-rials-to-Iran--excel">
            <h1>  </h1>
            <div>   <ExcelExportButton getData={fetchData} /></div>

          </div>
        </Col>
      </Row>
      <ExternalTradeCostManagementOfExportQuotasRecordTable
        data={data}
        tableParams={tableParams}
        handleChangePageSize={handleChangePageSize}
        totalCount={totalCount}
        handleTableChange={handleTableChange}
      />
      <EmergencyProblem title="نیما"/>
    </div>
  );
}
// PageSize: tableParams.pagination.pageSize,
//       StartIndex: Number(
//         (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
//           1
//       ),

//       urlVCodeInt: role,
//       ssdsshGUID: GUid,

// inputsData?.orderRegistrationNumber,
// inputsData?.approvalDate,
// inputsData?.confirmationDateTo,
// inputsData?.dateApplicationFrom,
// inputsData?.dateApplicationUntil,
// inputsData?.dateAllotment,
// inputsData?.dateAllotmentTo,
// inputsData?.applicationStatus,
// inputsData?.webSite