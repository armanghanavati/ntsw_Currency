import React from "react";
import { Button, Table } from "../../components";
import { Row } from "antd";
import themeColors from "../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import EmergingProblem from "../currency-trading/emerging-problem/emerging-problem";

const ExTrCurrDepManage = () => {
  const dispatch = useDispatch();
  const { role, GUid } = useSelector((state) => state);
  const [dataSource, setDataSource] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: "نام متقاضی",
      dataIndex: "BillOfLaddingTrackingcode",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "BillOfLadingNumber",
      align: "center",
    },
    {
      title: "نوع ارز",
      align: "center",
    },
    {
      title: "تاریخ درخواست",
      dataIndex: "PortOfDischargeName",
      align: "center",
    },
    {
      title: "تاریخ پاسخ",
      dataIndex: "IsBillOfLadingContainerStr",
      align: "center",
    },
    {
      title: "نرخ ارز (ریال)",
      align: "center",
    },
    {
      title: "جمع مبلغ ریالی",
      align: "center",
    },
    {
      title: "نوع معامله ریالی	",
      dataIndex: "PortOfDischargeName",
      align: "center",
    },
    {
      title: "شماره شبا	",
      dataIndex: "IsBillOfLadingContainerStr",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "IsBillOfLadingContainerStr",
      align: "center",
    },
    {
      title: "تایید",
      dataIndex: "IsBillOfLadingContainerStr",
      align: "center",
    },
    {
      title: "رد",
      dataIndex: "IsBillOfLadingContainerStr",
      align: "center",
    },
  ];

  //   const getTable = () => {
  //     setLoading(true);
  //     const postData = {
  //       bolTrackingCode: filters?.bolTrackingCode,
  //       urlVCodeInt: role,
  //       ssdsshGUID: GUid,
  //     };
  //     axios({
  //       url: endpoints.RestAPIs.preCotage.inquiryBillOfLaddingByBolVcode.url,
  //       method:
  //         endpoints.RestAPIs.preCotage.inquiryBillOfLaddingByBolVcode.method,
  //       data: postData,
  //     })
  //       .then((res) => {
  //         setDataSource(res?.data?.BillOfLaddingList || []);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //       });
  //   };

  return (
    <div>
      <Row justify="center">
        <Button
          backgroundColor={themeColors.btn.primary}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <i class="fa fa-file" />
          راهنمای فرایند
        </Button>
        <Button
          backgroundColor={themeColors.btn.primary}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <i class="fa fa-file" />
          راهنمای کاربری
        </Button>
      </Row>
      <Table
        hasPageSizeCombo={false}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        // loading={loading}
        rowKey="id"
      />
      <EmergingProblem />
    </div>
  );
};

export default ExTrCurrDepManage;
