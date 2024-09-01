import axios from "axios";
import { store } from "../../state/store";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import { endpoints } from "../../services/endpoints";
import currencyOperationTypes from "../../enums/currency-operation-types";

const canSetPreCotageDisBank = (
  prfVCodeInt,
  prfOrderNoStr,
  history,
  pgtGUID
) => {
  const { role, GUid } = store.getState();

  store.dispatch(handleLoading(true));
  const postData = {
    pgtGUID,
    prfVCodeInt,
    prfIsBankOPTny: currencyOperationTypes.NonBank,
    urlVCodeInt: role,
    ssdsshGUID: GUid,
  };
  axios({
    url: endpoints.RestAPIs.preCotage.canSetPreCotageDisBank.url,
    method: endpoints.RestAPIs.preCotage.canSetPreCotageDisBank.method,
    data: postData,
  })
    .then((res) => {
      store.dispatch(handleLoading(false));
      if (res?.data?.Result?.Error === 0) {
        if (history !== undefined) {
          history.push({
            pathname: `/Users/AC/Currency/CreateOriginOfNonBankCurrency`,
            search: `?key=${btoa(prfOrderNoStr)}=&key2=${btoa(prfVCodeInt)}`,
            state: { pgtGUID },
          });
        }
      } else {
        store.dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: res?.data?.Result?.ErrorDesc,
          })
        );
      }
    })
    .catch((err) => {
      console.log(err);
      store.dispatch(handleLoading(false));
    });
};

export default canSetPreCotageDisBank;
