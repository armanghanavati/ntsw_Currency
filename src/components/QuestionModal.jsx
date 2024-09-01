import { useDispatch, useSelector } from "react-redux";
import { handleQuestionModal } from "../state/action-creators";
import themeColors from "../configs/theme";
import Button from "./Button";
import Modal from "./Modal";
import { useEffect, useState } from "react";

const QuestionModal = () => {
  const dispatch = useDispatch();
  const { questionModal } = useSelector((state) => state);
  const [answer, setAnswer] = useState();

  useEffect(() => {
    if (!!answer) {
      switch (answer) {
        case "cancel":
          questionModal?.onCancel();
          break;
        case "yes":
          questionModal?.onYes();
          break;
        case "no":
          questionModal?.onNo();
          break;
        default:
          break;
      }
      setAnswer();
      dispatch(
        handleQuestionModal({
          isModalOpen: false,
          describe: "",
          answer: "",
          name: questionModal.name,
        })
      );
    }
  }, [answer]);

  const handleClose = (questionAnswer) => {
    setAnswer(questionAnswer);
  };

  return (
    <Modal
      width={500}
      onCancel={() => handleClose("cancel")}
      zIndex={999999999999}
      footer={[
        <Button
          backgroundColor={themeColors.btn.secondary}
          onClick={() => handleClose("yes")}
        >
          {questionModal.titleOfSubmitButton || "بله"}
        </Button>,
        <Button
          backgroundColor={themeColors.btn.danger}
          onClick={() => handleClose("no")}
        >
          {questionModal.titleOfCancelButton || "خیر"}
        </Button>,
      ]}
      open={questionModal?.isModalOpen || false}
      title={questionModal?.title || "ثبت اطلاعات"}
    >
      <div
        className="modal--text"
        style={{ margin: "0px" }}
        dangerouslySetInnerHTML={{
          __html: questionModal?.describe,
        }}
      />
    </Modal>
  );
};
export default QuestionModal;
