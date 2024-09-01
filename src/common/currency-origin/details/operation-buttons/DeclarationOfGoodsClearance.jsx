import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import GetPrecotageCode from "./GetPrecotageCode";
import themeColors from "../../../../configs/theme";
import { useState } from "react";
import currencyOperationTypes from "../../../../enums/currency-operation-types";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const DeclarationOfGoodsClearance = ({
  prfIsBankOPTny,
  pcoVCodeInt,
  getData,
}) => {
  const { role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const [isShowModal, setIsShowModal] = useState(false);

  const elamTarkhis = (CustomsSerialNumber) => {
    dispatch(handleLoading(true));
    const postData = {
      pcoVCodeInt: pcoVCodeInt,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      PrecotageCode: pcoVCodeInt,
      CustomsSerialNumber,
    };
    axios({
      url:
        prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.manageDischargeAnnouncement.url
          : endpoints.RestAPIs.preCotage.elamTarkhis.url,
      method:
        prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.manageDischargeAnnouncement.method
          : endpoints.RestAPIs.preCotage.elamTarkhis.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe:
                !res.data?.ErrorDesc ||
                res.data?.ErrorDesc?.trim()?.length === 0
                  ? "فرآیند اعلام ترخیص با موفقیت انجام شد."
                  : res.data?.ErrorDesc,
              type: "success",
            })
          );
          switch (prfIsBankOPTny) {
            case currencyOperationTypes.Bank:
              history.push("OriginOfBankCurrency");
              break;
            case currencyOperationTypes.NonBank:
              history.push("OriginOfNonBankCurrency");
              break;
            case currencyOperationTypes.NoCurrencyTransfer:
              history.push("CurrencyOriginWithoutCurrencyTransfer");
              break;
            case currencyOperationTypes.StatisticalRegistration:
              history.push("CurrencyOriginOfStatisticalRegistration");
              break;
            default:
              break;
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
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  return (
    <GetPrecotageCode
      handleSubmitModal={elamTarkhis}
      modalTitle="اعلام ترخیص کالا"
      buttonBackgroundColor={themeColors.btn.warning}
      isShowModal={isShowModal}
      setIsShowModal={setIsShowModal}
      hasMessageOnTop={true}
    >
      <i class="fa fa-upload" aria-hidden="true"></i>
      اعلام ترخیص کالا
    </GetPrecotageCode>
  );
};

export default DeclarationOfGoodsClearance;
