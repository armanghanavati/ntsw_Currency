import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../../../../configs/theme";
import { Button, TitleBox } from "../../../../../components";
import { Rate, Table } from "antd";
import { useEffect } from "react";
import axios from "axios";
import { endpoints } from "../../../../../services/endpoints";
import { handleLoading } from "../../../../../state/action-creators";

const Suggestions = ({ inputsData, setInputsData, editingId }) => {
  const { theme, colorMode, GUid, role } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
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

  const getSarrafiOfferList = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      sfrVCodeInt: editingId,
      startIndex: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
    };

    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSarrafiOfferList.url,
      method: endpoints.RestAPIs.buyCurrency.getSarrafiOfferList.method,
      data: postData,
    })
      .then((res) => {
      
        setInputsData({
          ...inputsData,
          sarrafiOfferList: res?.data?.sarrafiOfferList,
        });
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    getSarrafiOfferList();
  }, []);

  const columns = [
    {
      title: "انتخاب",
      dataIndex: "sfrVCodeInt",
      align: "center",
    },
    {
      title: "کد پیشنهاد",
      dataIndex: "sofCBIID",
      align: "center",
    },
    {
      title: "کد صرافی",
      dataIndex: "sfcVCodeInt",
      align: "center",
    },
    {
      title: "صرافی",
      dataIndex: "sfcNameStr",
      align: "center",
    },
    {
      title: "نام تجاری صرافی",
      dataIndex: "sfcBizNameStr",
      align: "center",
    },
    {
      title: "کارمزد ریالی",
      dataIndex: "sofWageMny",
      align: "center",
    },
    {
      title: "کارمزد ارزی",
      dataIndex: "sofWageArziMny",
      align: "center",
    },
    {
      title: "قیمت واحد (ریال)",
      dataIndex: "sofcurUnitPriceMny",
      align: "center",
    },
    {
      title: "قیمت کل (ریال)",
      dataIndex: "sofTotalPriceMny",
      align: "center",
    },
    {
      title: "حداکثر زمان صدور حواله",
      dataIndex: "sofTransferDelayTimeStr",
      align: "center",
    },
    {
      title: "مهلت اعتبار پیشنهاد",
      dataIndex: "sofOffreValidationDateStr",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "sofStatusStr",
      align: "center",
    },
    {
      title: "توضیحات پیشنهاد",
      dataIndex: "sofDescriptionStr",
      align: "center",
      render: (_, { sfrVCodeInt }, index) => (
        <div className="flex-order-row">
          <Button>
            مشاهده
            <i className="fa fa-search" />
          </Button>
        </div>
      ),
    },
    {
      title: "اطلاعات صرافی",
      dataIndex: "sfrcurNameStr",
      align: "center",
      render: (_, { sfrVCodeInt }, index) => (
        <a
          href="javascript:;"
          class="fa fa-2x fa-file-text"
          style="color:black;"
          name="btnShowSfcSarrafiRule"
          title="مشاهده ضوابط صرافی"
        ></a>
      ),
    },
    {
      title: "نتایج نظرسنجی",
      dataIndex: "sfrcurNameStr",
      align: "center",
      render: (_, { sfrVCodeInt }, index) => (
        <div style={{ padding: "5px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "25px",
                height: "23px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "2px",
                backgroundColor: "#024158",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {/* {Math.round(record?.RateAverage)} */}3
            </span>
            <Rate disabled={true} value={3} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              از مجموع <b>({2})</b> نظر
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "3px",
                cursor: "pointer",
              }}
              //   onClick={(e) => details(e, record)}
            >
              <i class="fa fa-plus" />
              <span>جزئیات</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <hr style={{ width: "80%", border: "1px dashed", margin: "30px auto" }} />
      <TitleBox title="پیشنهادها" />
      <span className="page-size-combo">
        <label className="page-size-combo--label" htmlFor="page-size">
          نمایش محتویات
        </label>
        <select
          className="page-size-combo--selector"
          id="page-size"
          value={tableParams.pagination.pageSize}
          onChange={handleChangePageSize}
        >
          <option
            value="10"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            10
          </option>
          <option
            value="25"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            25
          </option>
          <option
            value="50"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            50
          </option>
          <option
            value="100"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            100
          </option>
        </select>
      </span>
      <Table
        dataSource={inputsData?.sarrafiOfferList}
        columns={columns}
        // style={{ margin: "10px 0 20px" }}
        pagination={tableParams.pagination}
        // loading={loading}
        onChange={handleTableChange}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
      />
      <div
        style={{ display: "flex", justifyContent: "end", marginTop: "20px" }}
      >
        <Button backgroundColor={themeColors.btn.warning}>
          <i class="fa fa-warning"></i>لغو انتخاب
        </Button>
        <Button backgroundColor={themeColors.btn.secondary}>انتخاب</Button>
      </div>
    </>
  );
};
export default Suggestions;
