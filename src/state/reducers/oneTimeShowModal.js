const reducer = (state = false, action) => {
    switch (action.type) {
      case "ONE_TIME_SHOW_MODAL":
        return action.payload;
      default:
        return state
    }
  }
  
  export default reducer;
  