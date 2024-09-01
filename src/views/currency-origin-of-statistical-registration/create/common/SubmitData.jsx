// باتن ثبت و تمام صفحه ایجاد منشا ارز ثبت آماری
import { Button } from "../../../../components";
import { handleLoading } from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../../../configs/theme";
import { handleMessageModal } from "../../../../state/action-creators";
import moment from "jalali-moment";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SubmitData = ({
  tableDataSourceForCurrencyOrigins,
  tableDataSourceForBillOfLading,
  prfVCodeInt,
}) => {
  const dispatch = useDispatch();
  const { role, GUid } = useSelector((state) => state);
  const history = useHistory();

  const handleSendRequest = (event) => {
    event?.preventDefault();
    if (tableDataSourceForCurrencyOrigins?.length > 0) {
      if (tableDataSourceForBillOfLading.length > 0) {
        createPreCotage();
      } else {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: "وارد کردن بارنامه اجباریست.",
          })
        );
      }
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "جدول منشا ارز نمیتواند خالی باشد.",
        })
      );
    }
  };

  const changeDateFormat = (date) => {
    if (date) {
      const temp = moment.from(date, "YYYY/MM/DD").format("YYYY/MM/DD");
      return temp;
    } else {
      return undefined;
    }
  };

  const createPreCotage = () => {
    dispatch(handleLoading(true));
    const postData = {
      PreCotageBOLList: tableDataSourceForBillOfLading.map((billOfLadding) => ({
        RowNumber: 0,
        pcbVCodeInt: 0,
        pcbBOLNoStr: billOfLadding?.BillOfLadingNumber,
        pcbBOLDate: changeDateFormat(billOfLadding?.date),
      })),
      PreCotageSourceList: tableDataSourceForCurrencyOrigins.map((source) => ({
        pcsVCodeInt: 0,
        pcsSourceTypeTny: source?.prfcurVCodeInt,
        pcsSourceTypeStr: null,
        pcsAmountLng: source?.pcsAmountLng,
        pcscurVCodeInt: source?.pcscurVCodeInt,
        curNameStr: null,
        pcsReleaseYearStr: source?.pcsReleaseYearStr,
        pcsctmVCodeInt: source?.pcsctmVCodeInt,
        ctmNameStr: null,
        pcsExportCotageID: source?.pcsExportCotageID,
        pcsStatusTny: 0,
        pcsStatusStr: null,
        pcsMerchantDescStr: source?.pcsMerchantDescStr,
      })),
      prfVCodeInt,
      PcoBillOfLaddingList: [],
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotageSG.createPreCotage.url,
      method: endpoints.RestAPIs.preCotageSG.createPreCotage.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.ErrorCode === 0) {
          history.push("CurrencyOriginOfStatisticalRegistration");
          dispatch(
            handleMessageModal({
              type: "success",
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        } else if (res?.data?.ErrorCode === 12 || res?.data?.ErrorCode === 1) {
          dispatch(
            handleMessageModal({
              type: "warning",
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
          history.push("CurrencyOriginOfStatisticalRegistration");
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  return (
    <Button
      onClick={handleSendRequest}
      backgroundColor={themeColors.btn.secondary}
    >
      <i class="fa fa-check" aria-hidden="true"></i>
      ثبت و اتمام
    </Button>
  );
};

export default SubmitData;
