import { Card, Col, Row } from "antd";
import { Button, ComboBox, Table } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { useState } from "react";
import Guide from "../../../common/currency-origin/goods/Guide";
import themeColors from "../../../configs/theme";
import { ExcelExportButton } from "../../../common";
import RialExportsModal from "./RialExportsModal";
import pdfFileRout from "../../../assets/pdfFile/rahnemayesabtaragafghanistan1400.pdf";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
function RealRialsToIraqAndAfghanistan() {
  // states---------------------------------------------------
  const [dataSource, setDataSource] = useState([]);
  const [dataComboBox, setDataComboBox] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [totalCount, setTotalCount] = useState(null);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(-1);
const history=useHistory()
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [canCreateExportLicense,setCanCreateExportLicense]=useState(null)

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
  // const fetchData to get data from server-----------------------------------------------------------
  function fetchData() {
    const postData = {
      urlVCodeInt: role,
      status: status,
      searchText: "",
      startIndex: Number((tableParams.pagination.current-1)*(tableParams.pagination.pageSize)+1),
      pageSize: tableParams.pagination.pageSize,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.ObligationEliminate.GetListOfExportLicense.url,
      method:
        endpoints.RestAPIs.ObligationEliminate.GetListOfExportLicense.method,
      data: postData,
    })
      .then((res) => {
        // this is set data
console.log(res?.data,"afghanestan")
       

        setLoading(false);
        if (res.data?.error === 0) {
          setTotalCount(res.data.count);
          setCanCreateExportLicense(res?.data?.canCreateExportLicense)
          setDataSource(res?.data?.ListOfExportLicense);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.errorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // useeffect for get data tabel-------------------------------------------
  useEffect(() => {
    fetchData();
  }, [tableParams]);
  // useeffect to get data for combobox---------------------------------------------

  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.ObligationEliminate.GetRialExportStatus.url,
      method: endpoints.RestAPIs.ObligationEliminate.GetRialExportStatus.method,
      data: postData,
    })
      .then((res) => {
        // this is set data

        const convertedData = res.data.Result.map((item) => ({
          name: item.descriptionPersian,
          value: item.value,
        }));

    
        if (res.data?.ErrorCode === 0) {
          setDataComboBox(convertedData);
          setLoading(false);
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
  // this is onchange of combobox-----------------------------
  function changeCombox(name, value) {
    setStatus(value);
  }
  // this function can delete list for delete button----------------------------
  const handleDelete = (exlVCodeLng) => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdssh: GUid,
      exlVcodeLng: exlVCodeLng,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.ObligationEliminate.DeleteExportLicense.url,
      method: endpoints.RestAPIs.ObligationEliminate.DeleteExportLicense.method,
      data: postData,
    })
      .then((res) => {
        // this is set data

       
        if (res.data?.error === 0) {
       
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
  };
  // this functon can get exel data excel data just baseon status change ------------------------------
  const getTable = (handleDownloadExcel) => {
    setLoading(true);

    // Define the request data matching the Excel data POST request
    const postData = {
      urlVCodeInt: role,
      status: status,
      searchText: "string",
      startIndex: Number((tableParams.pagination.current-1)*(tableParams.pagination.pageSize)+1),
      pageSize: tableParams.pagination.pageSize,
      ssdsshGUID: GUid,
    };

    axios({
      url: endpoints.RestAPIs.ObligationEliminate.GetListOfExportLicense_Excel
        .url,
      method:
        endpoints.RestAPIs.ObligationEliminate.GetListOfExportLicense_Excel
          .method,
      data: postData,
    })
      .then((res) => {
        const excelData = res.data.ListOfExportLicense;
        // setDataSource(excelData);
        if (!!handleDownloadExcel) {
          const bodyData = res?.data?.ListOfExportLicense?.map(
            (item, index) => {
              return [
                index+1,
                item.rowNumber,
                item.exlCtmNameStr,
                item.exlCtmVCodeInt,
                item.exlCurNameStr,
                item.exlTotalPriceMny,
                item.exlDescription,
                item.exlStatusStr,
                item.detail,
              ];
            }
          );

          const headerRow = [
            "ردیف",
            " گمرگ",
            "سریال اظهارنامه ",
            "  نوع ارز",
            " مبلغ کل ",
            "  توضیحات",
            "  وضعیت",
            "  جزئیات بررسی",
          ];
          handleDownloadExcel(headerRow, bodyData, "NTSW_ExportCurrencyReques");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  function handleButtonexlDescription(title) {
    setTitle(title);
    setOpenModal(true);
  }
  // columns for field data grid----------------------------------
  const columns1 = [
    {
      title: "ردیف",
      dataIndex: "rowNumber",
      align: "center",
      key: "rowNumber",
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
      title: " گمرگ",
      dataIndex: "exlCtmNameStr",
      align: "center",
      key: "exlCtmNameStr",
    },
    {
      title: "سریال اظهارنامه ",
      dataIndex: "serialNumber", // Use a new dataIndex
      align: "center",
      key: "serialNumber",
      render: (text, record) => (
        <div>
          <span> {record.exlCotageCodeStr} </span>

          <span>-</span>
          <span> {record.exlCtmVCodeInt} </span>
        </div>
      ),
    },
    {
      title: "  نوع ارز",
      dataIndex: "exlCurNameStr",
      align: "center",
      key: "exlCurNameStr",
    },
    {
      title: " مبلغ کل ",
      dataIndex: "exlTotalPriceMny",
      align: "center",
      key: "exlTotalPriceMny",
      render: (text) => {
        if (text !== null && text !== undefined) {
          return text === 0 ? "0.00" : Number(text).toLocaleString();
        }
        return null;
      },
    },
    {
      title: "  توضیحات",
      dataIndex: "exlDescription",
      align: "center",
      key: "exlDescription",
      render: (exlDescription, record) => (
        <div>
          {exlDescription && (
            <button
              onClick={() => handleButtonexlDescription(exlDescription)} // You can pass the entire record object if needed
             className="real-rial--description "
            >
              نمایش{" "}
            </button>
          )}
        </div>
      ),
    },
    {
      title: "  وضعیت",
      dataIndex: "exlStatusStr",
      align: "center",
      key: "exlStatusStr",
    },
    {
      title: "  جزئیات بررسی",
      // dataIndex: "detail",
      align: "center",
      render: (text, {detail}) => (
        <>
      
         <div>
          <span> {!!detail && detail} </span>
        </div>
        </>
      ),
      // key: "detail",
    },
    {
      title: "حذف",
      dataIndex: "exlVCodeLng",
      align: "center",
      key: "exlVCodeLng",
      render: (exlVCodeLng, record) => (
        <button
          onClick={() => handleDelete(exlVCodeLng)}
          style={{
            backgroundColor: themeColors.btn.danger,
            border: "none",
            borderRadius: "2px",
            color: "white",
            opacity: dataSource.exlStatusTny !== 1 ? "0.5" : "1",
            cursor: dataSource.exlStatusTny !== 1 ? "not-allowed" : "pointer",
          }}
          disabled={dataSource.exlStatusTny !== 1}
        >
          حذف
        </button>
      ),
    },
  ];
  // handle pdf-----------------------------

  const handleDownloadPDF = () => {
    // Create a link to the PDF file
    const pdfFile = pdfFileRout; // Assuming 'pdfFile' contains the path to your PDF

    // Create a hidden link element
    const link = document.createElement("a");
    link.href = pdfFile;
    link.target = "_blank";
    link.download = "rahnemayesabtaragafghanistan1400.pdf"; // Set the desired file name

    // Trigger a click event on the link to download the PDF
    link.click();
  };
  return (
    <div >
      <RialExportsModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        title={title}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Button onClick={()=>{
            history.push("/Users/AC/Currency/ExternalTradeRialExportExpressNew")
          }} disabled={!canCreateExportLicense}>
            <i className="fa fa-plus"></i> اظهار پروانه های صادراتی
          </Button>
        </Col>
        <Col xs={24} md={12}>
          <Button onClick={handleDownloadPDF}>
            <i className="fa fa-folder"></i> راهنمای نحوه اظهار صادرات ریالی به
            عراق و افغانستان
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <ComboBox
            title="وضعیت"
            options={dataComboBox}
            onChange={changeCombox}
            optionTitle="name"
            optionValue="value"
          />
        </Col>
        <Col xs={24} md={6}>
          <Button
            onClick={() => {
              fetchData(status);
            }}
          >
            <i className="fa fa-search"></i>
            جستجو
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={24}>
          <div className="real-rials-to-Iran--excel">
            <h1> </h1>
            <div>
              {" "}
              <ExcelExportButton getData={getTable} loading={loading} />
            </div>
          </div>
        </Col>
      </Row>
      ّ
      <Table
        dataSource={dataSource}
        columns={columns1}
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
    </div>
  );
}
export default RealRialsToIraqAndAfghanistan;
