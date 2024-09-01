import React, { useState } from "react";
import { Row } from "antd";
import { useHistory } from "react-router-dom";
import { Button } from "../../components";
import TabelReconciliationPortal from "./tabel-reconciliation-portal/tabel-reconciliation-portal";
import { useDispatch, useSelector } from "react-redux";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../services/endpoints";
import helpFile from "../../assets/file/helpFile.pdf";

const ReconciliationPortal = () => {
  const { role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();
  let history = useHistory();

  const [dataSource, setDataSource] = useState(undefined);

  let getCnpYear = dataSource?.find((item) => item?.cnpYear)?.cnpYear;

  const canCreateNewConciliation = (event) => {
    event?.preventDefault();
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.currencyTrading.canCreateNewConciliation.url,
      method:
        endpoints.RestAPIs.currencyTrading.canCreateNewConciliation.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          history.push({
            pathname: `/Users/AC/Currency/CreateTabelReconciliationPortal`,
            search: "?cnpVCodeInt",
            state: { hasAccess: true },
          });
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

  return (
    <>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={canCreateNewConciliation} width="200px">
          <i className="fa fa-plus" />
          مصالحه ریالی
        </Button>
        <a href={helpFile} target="_blank" download="HelpFile" rel="noreferrer">
          <Button>
            <i class="fa fa-file btn-label" style={{ fontSize: "14px" }} />
            راهنمای نحوه مصالحه ریالی تعهدات ارزی
          </Button>
        </a>
      </Row>
      <TabelReconciliationPortal
        dataSource={dataSource}
        setDataSource={setDataSource}
      />
    </>
  );
};

export default ReconciliationPortal;
