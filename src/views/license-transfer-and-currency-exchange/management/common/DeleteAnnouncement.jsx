import { useState } from "react";
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
  handleMessageModal,
  handleQuestionModal,
} from "../../../../state/action-creators";
import themeColors from "../../../../configs/theme";

// ------------> دکمه حذف در جدول در تب آگهی های من <------------

const DeleteAnnouncement = ({
  role,
  GUid,
  disabled,
  AdvVcodeLng,
  getTable,
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleOnClick = (event) => {
    event?.preventDefault();
    dispatch(
      handleQuestionModal({
        isModalOpen: true,
        title: "تاییدیه حذف آگهی",
        titleOfSubmitButton: "بله، حذف میکنم",
        titleOfCancelButton: "خیر",
        describe: "آیا نسبت به حذف آگهی اطمینان دارید؟",
        name: `DELETE_ANNOUNCEMENT_${AdvVcodeLng}`,
        onYes: deleteAdvise,
      })
    );
  };

  const deleteAdvise = () => {
    setLoading(true);
    const postData = {
      AdvVcodeLng,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.declaration.deleteAdvise.url,
      method: endpoints.RestAPIs.declaration.deleteAdvise.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: "با موفقیت حذف شد.",
              type: "success",
            })
          );
          getTable();
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // const handleCloseQuestionModal = () => {
  //   if (questionModal.name === `DELETE_ANNOUNCEMENT_${AdvVcodeLng}`) {
  //     if (questionModal.answer === "yes") {
  //       deleteAdvise();
  //       dispatch(
  //         handleQuestionModal({ isModalOpen: false, title: "", describe: "" })
  //       );
  //     } else if (questionModal.answer === "no") {
  //       dispatch(
  //         handleQuestionModal({ isModalOpen: false, title: "", describe: "" })
  //       );
  //     }
  //   }
  // };

  // useEffect(() => {
  //   handleCloseQuestionModal();
  // }, [questionModal.answer, questionModal.isModalOpen]);

  return (
    <Button
      onClick={handleOnClick}
      type="secondary"
      backgroundColor={themeColors.btn.danger}
      disabled={disabled}
      loading={loading}
    >
      <i class="fa fa-times" aria-hidden="true"></i>
      حذف
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
export default connect(mapStateToProps)(DeleteAnnouncement);
