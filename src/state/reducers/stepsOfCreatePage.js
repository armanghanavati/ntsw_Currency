const reducer = (
  state = {
    disabledStepsList: [],
    // منشا ارز غیربانکی
    ONBC: 0,
    //  خرید ارز
    CNR: 0,
  },
  action
) => {
  switch (action.type) {
    case "stepsOfCreatePage":
      return {
        disabledStepsList:
          action.payload?.disabledStepsList === undefined
            ? state.disabledStepsList
            : action.payload?.disabledStepsList,
        ONBC:
          action.payload?.ONBC === undefined
            ? state.ONBC
            : action.payload?.ONBC,
        CNR:
          action.payload?.CNR === undefined ? state.CNR : action.payload?.CNR,
      };
    default:
      return state;
  }
};

export default reducer;
