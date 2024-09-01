const reducer = (state = "", action) => {
  switch (action.type) {
    case "BREAD_CRUMBDAT":
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
