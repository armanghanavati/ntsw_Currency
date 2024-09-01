//must be delete
import { Button } from "../../../../components";
import { useDispatch, useSelector } from "react-redux";
import {
  handleMessageModal,
  handleQuestionModal,
} from "../../../../state/action-creators";
import themeColors from "../../../../configs/theme";

const Delete = ({
  selectedRowKeys,
  setSelectedRowKeys,
  setTabledataSource,
  tabledataSource,
}) => {
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.preventDefault();
    if (selectedRowKeys.length > 0) {
      dispatch(
        handleQuestionModal({
          isModalOpen: true,
          title: "حذف",
          describe: " آیا از حذف بارنامه‌های انتخاب شده اطمینان دارید؟",
          name: `DELETE_BILL_OF_LADING`,
          onYes: deleteBillOfLading,
        })
      );
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "حداقل یک ردیف از جدول را در حالت انتخاب قرار دهید.",
        })
      );
    }
  };

  const deleteBillOfLading = () => {
    const temp = tabledataSource.filter(
      (x) => !selectedRowKeys.includes(x.BillOfLaddingTrackingcode)
    );
    setTabledataSource(temp);
    setSelectedRowKeys([]);
    dispatch(
      handleMessageModal({
        isModalOpen: true,
        describe: "با موفقیت انجام شد.",
        type: "success",
      })
    );
  };

  // useEffect(() => {
  //   if (questionModal.name === "DELETE_BILL_OF_LADING") {
  //     if (questionModal.answer === "yes") {
  //       deleteBillOfLading();
  //       dispatch(
  //         handleQuestionModal({ isModalOpen: false, title: "", describe: "",name:''  })
  //       );
  //     } else if (questionModal.answer === "no") {
  //       dispatch(
  //         handleQuestionModal({ isModalOpen: false, title: "", describe: "" ,name:'' })
  //       );
  //     }
  //   }
  // }, [questionModal.answer, questionModal.isModalOpen]);

  return (
    <Button
      backgroundColor={themeColors.btn.danger}
      onClick={handleDelete}
      disabled={!tabledataSource?.length > 0}
    >
      <i class="fa fa-times" aria-hidden="true"></i>
      حذف از لیست
    </Button>
  );
};

export default Delete;
