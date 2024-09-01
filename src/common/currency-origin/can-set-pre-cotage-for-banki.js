import axios from "axios";
import { store } from "../../state/store";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import { endpoints } from "../../services/endpoints";
import currencyOperationTypes from "../../enums/currency-operation-types";

const canSetPreCotageForBanki = ({
  prfVCodeInt,
  setErrorDesc = () => {},
  setIsShowModal = () => {},
  setHasShippingDocument = () => {},
  pgtGUID,
}) => {
  const { role, GUid } = store.getState();

  store.dispatch(handleLoading(true));
  const postData = {
    pgtGUID,
    prfVCodeInt,
    prfIsBankOPTny: currencyOperationTypes.Bank,
    urlVCodeInt: role,
    ssdsshGUID: GUid,
  };
  axios({
    url: endpoints.RestAPIs.preCotage.canSetPreCotageForBanki.url,
    method: endpoints.RestAPIs.preCotage.canSetPreCotageForBanki.method,
    data: postData,
  })
    .then((res) => {
      store.dispatch(handleLoading(false));
      if (
        res?.data?.ErrorCode === 0 &&
        (res?.data?.Result?.Error === 0 || res?.data?.Result?.Error === -1)
      ) {
        setErrorDesc(res?.data?.Result?.ErrorDesc);
        setIsShowModal(true);
        if (res?.data?.Result?.Result === null) {
          setHasShippingDocument(true);
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

export default canSetPreCotageForBanki;
