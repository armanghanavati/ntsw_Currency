const reducer = (
  state = {
    isModalOpen: false,
    describe: "",
    answer: "",
    title: "ثبت اطلاعات",
    titleOfSubmitButton: "بله",
    titleOfCancelButton: "خیر",
    onCancel: () => {},
    onYes: () => {},
    onNo: () => {},
  },
  action
) => {
  switch (action.type) {
    case "questionModal":
      return {
        isModalOpen: action.payload?.isModalOpen,
        describe: action.payload?.describe,
        answer: action.payload?.answer,
        title: action.payload?.title,
        titleOfSubmitButton: action.payload?.titleOfSubmitButton,
        titleOfCancelButton: action.payload?.titleOfCancelButton,
        name: action.payload?.name,
        onCancel: action.payload?.onCancel
          ? action.payload?.onCancel
          : () => {},
        onYes: action.payload?.onYes ? action.payload?.onYes : () => {},
        onNo: action.payload?.onNo ? action.payload?.onNo : () => {},
      };
    default:
      return state;
  }
};

export default reducer;
