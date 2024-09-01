import { connect, useDispatch } from "react-redux";
import { Button } from "../../../../components";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
  mapQuestionModalStateToProps,
} from "../../../../state/mapStateToProps";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";
import {
  handleLoading,
  handleMessageModal,
  handleQuestionModal,
} from "../../../../state/action-creators";
import answerResultEnum from "./answer-result-enum";

// ------------> دکمه تایید یا رد جدول در تب کارتابل واگذاری <------------

const ConfirmationOrRejection = ({
  role,
  GUid,
  backgroundColor,
  children,
  cdtVCodeInt,
  // بر اساس اینام answerResultEnum
  answerResult,
  getTable,
}) => {
  const dispatch = useDispatch();

  const handleOnClick = (event) => {
    event?.preventDefault();
    dispatch(
      handleQuestionModal({
        isModalOpen: true,
        title:
          answerResult === answerResultEnum.Confirmation
            ? "تائیدیه درخواست متقاضی"
            : "عدم تائید درخواست متقاضی",
        titleOfSubmitButton:
          answerResult === answerResultEnum.Confirmation
            ? "بله، تایید میکنم"
            : "بله، رد میکنم",
        titleOfCancelButton: "خیر",
        describe:
          answerResult === answerResultEnum.Confirmation
            ? "آیا نسبت به تائید درخواست متقاضی اطمینان دارید؟"
            : "آیا نسبت به عدم تائید درخواست متقاضی اطمینان دارید؟",
        name:
          answerResult === answerResultEnum.Confirmation
            ? `CONFIRM_DECLARATION_TRANSFER_${cdtVCodeInt}`
            : `REJECT_DECLARATION_TRANSFER_${cdtVCodeInt}`,
        onYes: getAnswerOfCustomDeclarationTransfer,
      })
    );
  };

  const getAnswerOfCustomDeclarationTransfer = () => {
    dispatch(handleLoading(true));
    const postData = {
      answerResult,
      cdtVCodeInt,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.declaration.getAnswerOfCustomDeclarationTransfer
        .url,
      method:
        endpoints.RestAPIs.declaration.getAnswerOfCustomDeclarationTransfer
          .method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
          if (res?.data?.Result?.Error === 0) {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: res?.data?.Result?.ErrorDesc,
                type: "success",
              })
            );
            getTable();
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: res?.data?.Result?.ErrorDesc,
              })
            );
          }
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  // const handleCloseQuestionModal = () => {
  //   if (
  //     questionModal.name ===
  //     (answerResult === answerResultEnum.Confirmation
  //       ? `CONFIRM_DECLARATION_TRANSFER_${cdtVCodeInt}`
  //       : `REJECT_DECLARATION_TRANSFER_${cdtVCodeInt}`)
  //   ) {
  //     getAnswerOfCustomDeclarationTransfer();
  //   }
  // };

  // useEffect(() => {
  //   handleCloseQuestionModal();
  // }, [questionModal.answer, questionModal.isModalOpen]);

  return (
    <Button
      onClick={handleOnClick}
      type="secondary"
      backgroundColor={backgroundColor}
    >
      {children}
    </Button>
  );
};
const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
    ...mapQuestionModalStateToProps(state),
  };
  return states;
};
export default connect(mapStateToProps)(ConfirmationOrRejection);
