const reducer = (state = [], action) => {
  switch (action.type) {
    case "metadata":
      return [...state, action.payload];
    default:
      return state;
  }
};

export default reducer;
