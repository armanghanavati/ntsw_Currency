import axios from "axios";
import { store } from "../../state/store";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import { endpoints } from "../../services/endpoints";

const canCreatePreCotageForStatisticsRegistration = (
  prfVCodeInt,
  prfOrderNoStr,
  history
) => {
  const { role, GUid } = store.getState();

  store.dispatch(handleLoading(true));
  const postData = {
    prfVCodeInt,
    urlVCodeInt: role,
    ssdsshGUID: GUid,
  };
  axios({
    url: endpoints.RestAPIs.preCotageSG.canCreatePreCotage.url,
    method: endpoints.RestAPIs.preCotageSG.canCreatePreCotage.method,
    data: postData,
  })
    .then((res) => {
      store.dispatch(handleLoading(false));
      if (res?.data?.ErrorCode === 0) {
        history.push({
          pathname: `/Users/AC/Currency/CreateCurrencyOriginOfStatisticalRegistration`,
          search: `?key=${btoa(prfOrderNoStr)}=&key2=${btoa(prfVCodeInt)}`,
          state: { hasAccess: true },
        });
      } else {
        store.dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: res?.data?.ErrorDesc,
          })
        );
      }
    })
    .catch((err) => {
      console.log(err);
      store.dispatch(handleLoading(false));
    });
};

export default canCreatePreCotageForStatisticsRegistration;
