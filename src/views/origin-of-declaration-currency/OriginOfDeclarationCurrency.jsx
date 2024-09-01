// منشا ارز اظهارنامه
import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Input, VerticalSpace } from "../../components";
import themeColors from "../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import RecordsOfOriginOfCurrencyTable from "./tables/RecordsOfOriginOfCurrencyTable";
import BasicInformation from "./BasicInformation";
import ItemsOfOriginOfCurrencyTable from "./tables/ItemsOfOriginOfCurrencyTable";
import GoodsOfOriginOfCurrencyTable from "./tables/GoodsOfOriginOfCurrencyTable";
import ShippingDocumentTable from "./tables/ShippingDocumentTable";
import axios from "axios";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import { endpoints } from "../../services/endpoints";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";

const OriginOfDeclarationCurrency = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const { role, GUid, theme } = useSelector((state) => state);
  const { search } = useLocation();

  const [inputsData, setInputsData] = useState({});
  const [dataSource, setDataSource] = useState([
    {
      id: 0,
      prfOrderNoStr: "as",
      carRowNoInt: "as",
      carStatusStr: "as",
      carActiveStatusStr: "as",
      carAmountMny: "as",
      curNameStr: "as",
      carCreateDateShamsi: "as",
      carVCodeLng: "as",
      isSelected: true,
    },
    {
      id: 1,
      prfOrderNoStr: "as",
      carRowNoInt: "as",
      carStatusStr: "as",
      carActiveStatusStr: "as",
      carAmountMny: "as",
      curNameStr: "as",
      carCreateDateShamsi: "as",
      carVCodeLng: "as",
    },
  ]);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const getAllDeclarationPreCtoage = (declarationCode) => {
    dispatch(handleLoading(true));
    const postData = {
      declarationCode,
      urlVCode: role,
    };
    axios({
      url: endpoints.RestAPIs.currencyOrigin.getAllDeclarationPreCtoage.url,
      method:
        endpoints.RestAPIs.currencyOrigin.getAllDeclarationPreCtoage.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.code === 0) {
          const temp = [...res?.data?.result];
          temp[0] = { ...res?.data?.result?.[0], isSelected: true };
          setInputsData(temp[0]);
          setDataSource(temp);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.message,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    const key = atob(new URLSearchParams(search).get("key").replace(/=/g, ""));
    getAllDeclarationPreCtoage(key || "201052057855746");
  }, []);

  console.log(inputsData);

  return (
    <>
      <Form form={form}>
        <RecordsOfOriginOfCurrencyTable
          dataSource={dataSource}
          tableParams={tableParams}
          inputsData={inputsData}
          setDataSource={setDataSource}
        />
        <BasicInformation inputsData={inputsData} />

        {inputsData?.isShowSourceTable || (
          <ItemsOfOriginOfCurrencyTable
            inputsData={inputsData}
            setTableParams={setTableParams}
            tableParams={tableParams}
          />
        )}
        {inputsData?.isShowGoodsTable && (
          <GoodsOfOriginOfCurrencyTable
            dataSource={inputsData?.goodsList}
            tableParams={tableParams}
          />
        )}
        <ShippingDocumentTable
          dataSource={[]}
          setTableParams={setTableParams}
          tableParams={tableParams}
        />
        <VerticalSpace space="2rem" />
        {inputsData?.isShowDescriptionField && (
          <Col sm={24} md={24} xl={24}>
            <Input
              title="توضیحات"
              labelWidth="220px"
              value={inputsData?.description}
              readOnly={true}
              type="textarea"
            />
          </Col>
        )}
        <VerticalSpace />
      </Form>
      <div className="steps-action">
        {inputsData?.isShowRevokePreCotageButton && (
          <Button
            name="return"
            // onClick={handleCancle}
            backgroundColor={themeColors.btn.danger}
          >
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            ابطال منشا ارز
          </Button>
        )}
        {inputsData?.isShowCreateNewPreCotageButton && (
          <Button
            // onClick={sendToInternalTrade}
            backgroundColor={themeColors.btn.darkGreen}
          >
            <i class="fa fa-upload" aria-hidden="true"></i>
            ثبت منشا ارز
          </Button>
        )}
        <Button
          name="return"
          onClick={() => {
            history.push(-1);
          }}
        >
          <i class="fa fa-share" aria-hidden="true"></i>
          بازگشت
        </Button>
      </div>
      <VerticalSpace />
    </>
  );
};

export default OriginOfDeclarationCurrency;
