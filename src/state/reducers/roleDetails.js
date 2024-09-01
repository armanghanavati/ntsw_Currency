const reducer = (state = { roleType: 0 }, action) => {
  switch (action.type) {
    case "roleDetails":
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
