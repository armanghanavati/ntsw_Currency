import React, { useState } from "react";
import { Col, Table } from "antd";
import { Button } from "../../../../components";
import { useDispatch, useSelector } from "react-redux";
import { handleMessageModal } from "../../../../state/action-creators";
import themeColors from "../../../../configs/theme";

const CurrencyTable = ({ inputsData, errors, setErrors, setInputsData }) => {
  const { colorMode } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const removeRecordList = (e, record, index) => {
    let filter = inputsData?.dataSource.filter(
      (item) => item?.amountDollars !== inputsData?.amountDollars
    );

    e.preventDefault();
    if (record?.amountDollars === inputsData?.amountDollars) {
      setInputsData((prvs) => ({
        ...prvs,
        dataSource: filter,
      }));
    }
  };

  const columns = [
    {
      title: "ردیف گواهی",
      dataIndex: "orderNos",
      align: "center",
    },
    {
      title: "نوع ارز گواهی",
      dataIndex: "curNameStr",
      align: "center",
    },
    {
      title: "مبلغ معادل با نوع ارز گواهی",
      dataIndex: "amountDollars",
      align: "center",
    },
    {
      title: "نوع ارز درخواست",
      dataIndex: "curVCodeIntSarrafiRequest",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "Money",
      align: "center",
    },
    {
      title: "عملیات",
      dataIndex: "sffBankShobeNameStr",
      align: "center",
      render: (_, record, index) => (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={(e) => removeRecordList(e, record, index)}
            backgroundColor={themeColors.btn.danger}
          >
            <i class="fa fa-remove" />
            حذف از لیست
          </Button>
        </div>
      ),
    },
  ];

  const checkedValidation = (event) => {
    event?.preventDefault();
    if (permitForNextStep(["sfrHavaleTypeInt"]) === true) {
      addList();
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            "لطفا تمامی اطلاعات مربوط به درخواست تمدید را تکمیل بفرمایید.",
        })
      );
      return;
    }
  };

  const permitForNextStep = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (let key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputsData[item] === undefined ||
        inputsData[item] === null ||
        JSON.stringify(inputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const addList = () => {
    let filter = inputsData?.optionOrder?.filter(
      (item) => item?.fishID === inputsData?.orderNos
    )[0]?.fishName;
    setInputsData((prvs) => ({
      ...prvs,
      dataSource: [
        {
          remainPriceMny: inputsData?.remainPriceMny,
          curVCodeIntSarrafiRequest: inputsData?.curVCodeIntSarrafiRequest,
          Money: inputsData?.Money,
          curNameStr: inputsData?.curNameStr,
          amountDollars: inputsData?.amountDollars,
          orderNos: filter,
        },
      ],
    }));
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Col sm={24} md={16} xl={16}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              margin: "10px 0",
            }}
          >
            <Button>مشاهده جزئیات ثبت سفارش </Button>
            <Button
              onClick={checkedValidation}
              disabled={
                !!!inputsData?.amountDollars || !!inputsData?.dataSource
              }
            >
              <i class="fa fa-plus" />
              افزودن به لیست
            </Button>
          </div>
          <Table
            dataSource={inputsData?.dataSource}
            columns={columns}
            pagination={false}
            loading={loading}
            onHeaderRow={() => {
              return {
                style: { backgroundColor: colorMode },
              };
            }}
          />
        </Col>
      </div>
    </>
  );
};

export default CurrencyTable;
