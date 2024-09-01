

const reducer = (state=null, action) => {
    switch (action.type) {
        case "nationalCode":
            return action.payload;
        default:
            return state
    }
}

export default reducer;