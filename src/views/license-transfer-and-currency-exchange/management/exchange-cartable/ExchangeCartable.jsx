import { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Table, VerticalSpace } from "../../../../components";
import { endpoints } from "../../../../services/endpoints";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
} from "./../../../../state/mapStateToProps";
import ShowShebaNumber from "../common/ShowShebaNumber";
import StringHelpers from "../../../../configs/helpers/string-helpers";
import ExchangeGuideFile from "../../../../assets/pdfFile/ExchangeGuide.pdf";
import ConfirmationOrRejection from "../common/ConfirmationOrRejection";
import themeColors from "../../../../configs/theme";
import answerResultEnum from "../common/answer-result-enum";

// ------------> تب کارتابل تهاتر صفحه واگذاری پروانه و تهاتر ارزی <------------

const ExchangeCartable = ({ role, GUid }) => {
  const [loading, setLoading] = useState(false);
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
      title: "نام متقاضی",
      align: "center",
      render: (
        _,
        { cdtApplicantPersonNameStr, cdtApplicantPersonFamilyStr }
      ) => (
        <div className="flex-order-row">
          {cdtApplicantPersonNameStr + " " + cdtApplicantPersonFamilyStr}
        </div>
      ),
    },
    {
      title: "سریال اظهارنامه",
      align: "center",
      render: (_, { cdtctmVCodeInt, cdtCotageNoStr }) => (
        <div className="flex-order-row">
          {`${cdtctmVCodeInt}-${cdtCotageNoStr}`}
        </div>
      ),
    },
    {
      title: "مبلغ",
      align: "center",
      render: (_, { cdtAmount }) => (
        <div className="flex-order-row">
          {StringHelpers.formatNumber(cdtAmount)}
        </div>
      ),
    },
    {
      title: "نوع ارز",
      dataIndex: "cdtCurrencyNameStr",
      align: "center",
    },
    {
      title: "تاریخ درخواست",
      dataIndex: "InsertDate",
      align: "center",
    },
    {
      title: "تاریخ پاسخ",
      dataIndex: "AnswerDate",
      align: "center",
    },
    {
      title: "نرخ ارز (ریال)",
      align: "center",
      render: (_, { cdtCurrencyRate }) => (
        <div className="flex-order-row">
          {StringHelpers.formatNumber(cdtCurrencyRate)}
        </div>
      ),
    },
    {
      title: "جمع مبلغ ریالی",
      align: "center",
      render: (_, { cdtTotalAmountOfRials }) => (
        <div className="flex-order-row">
          {StringHelpers.formatNumber(cdtTotalAmountOfRials)}
        </div>
      ),
    },
    {
      title: "نوع معامله ریالی",
      dataIndex: "cdtTypeOfRialTransaction",
      align: "center",
    },
    {
      title: "شماره شبا یا شناسه مرجع",
      align: "center",
      render: (_, { cdtRialAccountNumber }) => (
        <div className="flex-order-row">
          <ShowShebaNumber cdtRialAccountNumber={cdtRialAccountNumber} />
        </div>
      ),
    },
    {
      title: "وضعیت",
      dataIndex: "cdtStatusStr",
      align: "center",
    },
    {
      title: "تایید",
      align: "center",
      render: (_, { cdtStatusTny, cdtVCodeInt }) => (
        <div className="flex-order-row">
          {cdtStatusTny === 1 && (
            <ConfirmationOrRejection
              getTable={getTable}
              backgroundColor={themeColors.btn.secondary}
              cdtVCodeInt={cdtVCodeInt}
              // بر اساس اینام answerResultEnum
              answerResult={answerResultEnum.Confirmation}
            >
              <i class="fa fa-check" aria-hidden="true"></i>
              تایید
            </ConfirmationOrRejection>
          )}
        </div>
      ),
    },
    {
      title: "رد",
      align: "center",
      render: (_, { cdtStatusTny, cdtVCodeInt }) => (
        <div className="flex-order-row">
          {cdtStatusTny === 1 && (
            <ConfirmationOrRejection
              getTable={getTable}
              backgroundColor={themeColors.btn.danger}
              cdtVCodeInt={cdtVCodeInt}
              // بر اساس اینام answerResultEnum
              answerResult={answerResultEnum.Rejection}
            >
              <i class="fa fa-times" aria-hidden="true"></i>
              رد
            </ConfirmationOrRejection>
          )}
        </div>
      ),
    },
  ];

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

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const getTable = () => {
    setLoading(true);
    const postData = {
      PageSize: tableParams.pagination.pageSize,
      StartIndex:
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
        1,
      requestType: [3],
      urlVCodeInt: role,
      SessionID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.declaration.getCustomDeclarationListForTahator
        .url,
      method:
        endpoints.RestAPIs.declaration.getCustomDeclarationListForTahator
          .method,
      data: postData,
    })
      .then((res) => {
        setDataSource(res?.data?.CustomDeclarationTransferList);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res?.data?.Count || 0,
          },
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getTable();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  return (
    <>
      <div className="transfer-of-license-and-currency-exchange--border">
        <a
          className="btn-download"
          href={ExchangeGuideFile}
          // download="ExchangeGuide.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-file btn-label" aria-hidden="true"></i>
          راهنــمای فرایند
        </a>
      </div>
      <VerticalSpace space="0.5rem" />
      <Table
        handleChangePageSize={handleChangePageSize}
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams?.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
  };
  return states;
};
export default connect(mapStateToProps)(ExchangeCartable);
