import { combineReducers } from "redux";
import roleReducer from "./roleReducer";
import roleDetails from "./roleDetails";
import GUIDReducer from "./getGUID";
import sidebar from "./sidebar";
import theme from "./changeTheme";
import loading from "./loading";
import messageModal from "./messageModal";
import questionModal from "./questionModal";
import stepsOfCreatePage from "./stepsOfCreatePage";
import alternativeToken from "./alternativeToken";
import colorMode from "./colorMode";
import JWT from "./JWT";
import isCertificateRequiredList from "./isCertificateRequiredList";
import breadCrumbData from "./breadCrumbData";
import nationalCode from "./nationalCode";
import oneTimeShowMod from "./oneTimeShowModal";
import metadata from "./metadata";

const reducers = combineReducers({
  role: roleReducer,
  roleDetails: roleDetails,
  JWT: JWT,
  GUid: GUIDReducer,
  alternativeToken: alternativeToken,
  sidebar: sidebar,
  theme: theme,
  colorMode: colorMode,
  loading: loading,
  messageModal: messageModal,
  questionModal: questionModal,
  stepsOfCreatePage: stepsOfCreatePage,
  isCertificateRequiredList: isCertificateRequiredList,
  nationalCode: nationalCode,
  breadCrumbData: breadCrumbData,
  oneTimeShowMod: oneTimeShowMod,
  metadata: metadata,
});

export default reducers;
