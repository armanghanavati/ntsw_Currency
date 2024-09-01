import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import themeColors from "../../../../configs/theme";
import { Button } from "../../../../components";
import currencyOperationTypes from "../../../../enums/currency-operation-types";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SendToDomesticTrade = ({
  prfIsBankOPTny,
  pcoVCodeInt,
  pcoIDNoStr,
  getData,
}) => {
  const { role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const sendToInternalTrade = (event) => {
    event?.preventDefault();
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      PrecotageCode: pcoVCodeInt,
    };
    axios({
      url:
        prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.sendToInternalTrade.url
          : endpoints.RestAPIs.preCotage.sendToInternalTrade.url,
      method:
        prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.sendToInternalTrade.method
          : endpoints.RestAPIs.preCotage.sendToInternalTrade.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
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
    // <GetPrecotageCode
    //   handleSubmitModal={sendToInternalTrade}
    //   modalTitle=" ارسال به تجارت داخلی"
    //   buttonBackgroundColor={themeColors.btn.purple}
    //   isShowModal={isShowModal}
    //   setIsShowModal={setIsShowModal}
    // >
    //   <i class="fa fa-upload" aria-hidden="true"></i>
    //   ارسال به تجارت داخلی
    // </GetPrecotageCode>

    <Button
      onClick={sendToInternalTrade}
      backgroundColor={themeColors.btn.purple}
    >
      <i class="fa fa-upload" aria-hidden="true"></i>
      ارسال به تجارت داخلی
    </Button>
  );
};

export default SendToDomesticTrade;
