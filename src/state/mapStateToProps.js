const mapThemeStateToProps = (state) => {
  return {
    theme: state?.theme,
  };
};

const mapRoleStateToProps = (state) => {
  return {
    role: state?.role,
  };
};

const mapRoleDetailsStateToProps = (state) => {
  return {
    roleDetails: state?.roleDetails,
  };
};

const mapJWTStateToProps = (state) => {
  return {
    JWT: state?.JWT,
  };
};

const mapGUidStateToProps = (state) => {
  return {
    GUid: state?.GUid,
  };
};

const mapAlternativeTokenStateToProps = (state) => {
  return {
    alternativeToken: state?.alternativeToken,
  };
};
const mapMetadataStateToProps = (state) => {
  return {
    metadata: state.metadata,
  };
};
const mapColorModeStateToProps = (state) => {
  return {
    colorMode: state?.colorMode,
  };
};

const mapLoadingStateToProps = (state) => {
  return {
    loading: state?.loading,
  };
};

const mapMessageModalStateToProps = (state) => {
  return {
    messageModal: state?.messageModal,
  };
};

const mapQuestionModalStateToProps = (state) => {
  return {
    questionModal: state?.questionModal,
  };
};

const mapStepsOfCreatePageStateToProps = (state) => {
  return {
    stepsOfCreatePage: state?.stepsOfCreatePage,
  };
};

const mapIsCertificateRequiredListStateToProps = (state) => {
  return {
    isCertificateRequiredList: state?.isCertificateRequiredList,
  };
};

const mapNationalCodeStateToProps = (state) => {
  return {
    metadata: state?.nationalCode,
  };
};

const mapSidebarStateToProps = (state) => {
  return {
    sidebar: state?.sidebar,
  };
};

export {
  mapNationalCodeStateToProps,
  mapIsCertificateRequiredListStateToProps,
  mapStepsOfCreatePageStateToProps,
  mapQuestionModalStateToProps,
  mapMessageModalStateToProps,
  mapLoadingStateToProps,
  mapColorModeStateToProps,
  mapThemeStateToProps,
  mapSidebarStateToProps,
  mapAlternativeTokenStateToProps,
  mapGUidStateToProps,
  mapJWTStateToProps,
  mapRoleStateToProps,
  mapRoleDetailsStateToProps,
  mapMetadataStateToProps,
};
