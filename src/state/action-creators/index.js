import Cookies from "js-cookie";

export const changeRole = (code) => {
  localStorage.setItem("personCode", code);
  return (dispatch) => {
    dispatch({
      type: "role",
      payload: code,
    });
  };
};

export const roleDetails = (details) => {
  return (dispatch) => {
    dispatch({
      type: "roleDetails",
      payload: details,
    });
  };
};

export const getJWT = (id) => {
  if (id !== null) {
    Cookies.set("JWT", id);
  } else {
    Cookies.remove("JWT");
  }
  return (dispatch) => {
    dispatch({
      type: "JWT",
      payload: id,
    });
  };
};

export const handleGetPageSize = (pageSize) => {
  return (dispatch) => {
    dispatch({
      type: "PAGE_SIZE",
      payload: pageSize,
    });
  };
};

export const getGUID = (id) => {
  if (id !== null) {
    if (process.env.NODE_ENV !== "production") {
      Cookies.set("ssdssh", `ssdsshGuid=${id}`);
    }
  } else {
    Cookies.remove("ssdssh");
  }
  return (dispatch) => {
    dispatch({
      type: "GUid",
      payload: id,
    });
  };
};
export const handleAddMetadata = (data) => {
  return (dispatch) => {
    dispatch({
      type: "metadata",
      payload: data,
    });
  };
};
export const getAlternativeToken = (id) => {
  if (id !== null) {
    if (process.env.NODE_ENV !== "production") {
      Cookies.set("AlternativeToken", id);
    }
  } else {
    Cookies.remove("AlternativeToken");
  }
  return (dispatch) => {
    dispatch({
      type: "AlternativeToken",
      payload: id,
    });
  };
};

export const handleSidebar = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: "sidebar",
      payload: isOpen,
    });
  };
};

export const handleMessageModal = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: "messageModal",
      payload: isOpen,
    });
  };
};

export const handleQuestionModal = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: "questionModal",
      payload: isOpen,
    });
  };
};

export const changeTheme = (theme) => {
  localStorage.setItem("theme", theme);
  return (dispatch) => {
    dispatch({
      type: "theme",
      payload: theme,
    });
  };
};

export const changeColorMode = (colorMode) => {
  localStorage.setItem("colorMode", colorMode);
  return (dispatch) => {
    dispatch({
      type: "colorMode",
      payload: colorMode,
    });
  };
};

export const handleLoading = (loading) => {
  return (dispatch) => {
    dispatch({
      type: "loading",
      payload: loading,
    });
  };
};
export const handleStepsOfCreatePage = (step) => {
  return (dispatch) => {
    dispatch({
      type: "stepsOfCreatePage",
      payload: step,
    });
  };
};

export const handleIsCertificateRequiredList = (list) => {
  return (dispatch) => {
    dispatch({
      type: "isCertificateRequiredList",
      payload: list,
    });
  };
};

export const getNationalCode = (nationalCode) => {
  return (dispatch) => {
    dispatch({
      type: "nationalCode",
      payload: nationalCode,
    });
  };
};

export const handleBreadCrumbData = (breadCrumbData) => {
  return (dispatch) => {
    dispatch({
      type: "BREAD_CRUMBDAT",
      payload: breadCrumbData,
    });
  };
};

export const handleOneTimeShowMod = (oneTimeShowMod) => {
  return (dispatch) => {
    dispatch({
      type: "ONE_TIME_SHOW_MODAL",
      payload: oneTimeShowMod,
    });
  };
};
