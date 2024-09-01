import React, { useEffect } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { BrowserDetector, DastineInstaller } from "./assets/dastine/Dastine";
import DastineConfig from "./assets/dastine/Dastine-Config";
import "./services/axios";
import { Provider } from "react-redux";
import { store } from "./state/store";
import "./assets/fontawesome/css/font-awesome.min.css";
import "antd/dist/antd.variable.css";
import "./app.scss";
import Layout from "./layouts/Layout";
import NotFoundPage from "./views/NotFoundPage.jsx";
import SecurityAccess from "./utils/SecurityAccess";
import ManageDetails from "./utils/ManageDetails";
import BuyCurrency from "./views/currency-trading/operations-currency/buy-currency";
import SellingCurrency from "./views/currency-trading/operations-currency/selling-currency/selling-currency";
import TransferIcenseClearance from "./views/currency-trading/operations-currency/transfer-icense-clearance/transfer-icense-clearance";
import ExternalTradeCEBuyManage from "./views/currency-trading/operations-currency/external-trade-CE-buy-manage/external-trade-CE-buy-manage";
import ExternalTradeCESellManage from "./views/currency-trading/operations-currency/selling-currency/external-trade-CE-sell-manage";
import ExternalTradeExportLicenseAssignment from "./views/currency-trading/operations-currency/transfer-icense-clearance/external-trade-export-license-assignment";
import ReconciliationPortal from "./views/reconciliation-portal/reconciliation-portal";
import CreateTAbelReconciliationPortal from "./views/reconciliation-portal/create-tabel-reconciliation-portal/create-tabel-reconciliation-portal";
import ExternalTradeAssignmentBoard from "./views/external-trade-assignment-board/external-trade-assignment-board";

import OriginOfBankCurrencyManagement from "./views/origin-of-bank-currency/management/Management";
import OriginOfBankCurrencyDetails from "./views/origin-of-bank-currency/Details";
import CreateOriginOfBankCurrency from "./views/origin-of-bank-currency/Create";

import OriginOfNonBankCurrencyManagement from "./views/origin-of-non-bank-currency/management/Management";
import OriginOfNonBankCurrencyDetails from "./views/origin-of-non-bank-currency/Details";
import CreateOriginOfNonBankCurrency from "./views/origin-of-non-bank-currency/create/Create";

import CurrencyOriginWithoutCurrencyTransferManagement from "./views/currency-origin-without-currency-transfer/management/Management";
import CurrencyOriginWithoutCurrencyTransferDetails from "./views/currency-origin-without-currency-transfer/Details";
import CreateCurrencyOriginWithoutCurrencyTransfer from "./views/currency-origin-without-currency-transfer/Create.jsx";

import CurrencyOriginOfStatisticalRegistrationManagement from "./views/currency-origin-of-statistical-registration/management/Management";
import CurrencyOriginOfStatisticalRegistrationDetails from "./views/currency-origin-of-statistical-registration/Details";
import CreateCurrencyOriginOfStatisticalRegistration from "./views/currency-origin-of-statistical-registration/create/Create";

import LicenseTransferAndCurrencyExchange from "./views/license-transfer-and-currency-exchange/management/Management.jsx";

import ExternalTradeSummeryofCommitments from "./views/ExternalTradeSummeryofCommitments/ExternalTradeSummeryofCommitmentsPage/ExternalTradeSummeryofCommitmentsPage";
// import ExternalTradeexChangeSurveyResult from "./views/currency-trading/external-tradeex-change-survey-result/external-tradeex-change-survey-result";
import ExternalTradeCEBuyNewReq from "./views/currency-trading/operations-currency/external-trade-CE-buy-new-req/external-trade-CE-buy-new-req";
import ExternalTradeCEBuyReqDetails from "./views/currency-trading/operations-currency/external-trade-CE-buy-manage/external-trade-CE-buy-req-details/external-trade-CE-buy-req-details";
import ExternalTradeRialExportExpressPage from "./views/ExternalTradeRialExportExpress/ExternalTradeRialExportExpressPage/ExternalTradeRialExportExpressPage";
import ExternalTradeCostManagementOfExportQuotas from "./views/ExternalTradeCostManagementOfExportQuotas/ExternalTradeCostManagementOfExportQuotasPage/ExternalTradeCostManagementOfExportQuotas";
import ExternalTradeNewCostManagementOfPortQuotas from "./views/ExternalTradeCostManagementOfExportQuotas/Record/ExternalTradeNewCostManagementOfPortQuotas";
import ExternalTradeMoshahedeEtelaatArziPage from "./views/ExternalTradeMoshahedeEtelaatArzi/ExternalTradeMoshahedeEtelaatArziPage/ExternalTradeMoshahedeEtelaatArziPage";
import RequestCurrencyAllocation from "./views/request-currency-allocation/page/request-currency-allocation";
import CurrencyAllocationRequestManagementHistory from "./views/request-currency-allocation/page/CurrencyAllocationRequestManagementHistory";
import CurrencyAllocationRequestDetailPage from "./views/request-currency-allocation/page/CurrencyAllocationRequestDetailPage";
// import NewCurrencyRequest from "./views/request-currency-allocation/page/NewCurrencyRequest";
// import ExternalTradeAssignmentBoardConfirm from "./views/currency-trading/ExternalTradeAssignmentBoardConfirm/managment/managment.jsx";
import CreateStepsCurrAllocReq from "./views/request-currency-allocation/page/newCurrencyAllocReq/CreateStepsCurrAllocReq";
import ExTrCurrDepManage from "./views/ExTrCurrDepManage/ExTrCurrDepManage ";
import TabExTrCurrDepManage from "./views/ExTrCurrDepManage/TabExTrCurrDepManage";
import Managment from "./views/currency-trading/ExternalTradeAssignmentBoardConfirm/managment/Managment.jsx";
import CurrencyAllocationRequestDivide from "./views/request-currency-allocation/page/CurrencyAllocationRequestDivide.jsx";
import ExternalTradeExchangeSurveyResult from "./views/external-trade-exchange-survey-result/external-trade-exchange-survey-result";
import PaymentReturnPage from "./views/reconciliation-portal/payment-return-page/payment-return-page.jsx";
import CreateTabelReconciliationPortal from "./views/reconciliation-portal/create-tabel-reconciliation-portal/create-tabel-reconciliation-portal";
import CreateNewAnnouncement from "./views/license-transfer-and-currency-exchange/new-announcement/CreateNewAnnouncement.jsx";
import AnnouncementDetails from "./views/license-transfer-and-currency-exchange/details/AnnouncementDetails.jsx";
import ExternalTradeRialExportExpressNewPage from "./views/ExternalTradeRialExportExpress/ExternalTradeRialExportExpressPage/ExternalTradeRialExportExpressNewPage.jsx";
import ExternalTradeRialExportExpressNewOtherCountriesPage from "./views/ExternalTradeRialExportExpress/ExternalTradeRialExportExpressPage/ExternalTradeRialExportExpressNewOtherCountriesPage.jsx";
import OriginOfDeclarationCurrency from "./views/origin-of-declaration-currency/OriginOfDeclarationCurrency.jsx";

const App = () => {
  useEffect(() => {
    DastineConfig.init();
    BrowserDetector.init();
    DastineInstaller.createConnection();
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            {process.env.REACT_APP_WEATHER_API_KEY !== "production-prod" && (
              <Route path="/" exact component={Layout} />
            )}
            {process.env.REACT_APP_WEATHER_API_KEY !== "production-prod" && (
              <Route path="/index.aspx" exact component={Layout} />
            )}
            {process.env.REACT_APP_WEATHER_API_KEY !== "production-prod" && (
              <Route path="/Login.aspx" exact component={Layout} />
            )}
            <Route exact path="/Users/AC/404" component={NotFoundPage} />
            <Route path="/Users/AC/Currency/RequestCurrencyAllocation" exact>
              <SecurityAccess>
                <RequestCurrencyAllocation />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CurrencyAllocationRequestDivide"
              exact
            >
              <SecurityAccess>
                <CurrencyAllocationRequestDivide />
              </SecurityAccess>
            </Route>
            <Route path="/Users/AC/Currency/NewCurrencyRequestDetails" exact>
              <SecurityAccess>
                <ManageDetails>
                  <CreateStepsCurrAllocReq />
                </ManageDetails>
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CurrencyAllocationRequestManagementHistory"
              exact
            >
              <SecurityAccess>
                {/* <ManageDetails> */}
                <CurrencyAllocationRequestManagementHistory />
                {/* </ManageDetails> */}
              </SecurityAccess>
            </Route>
            <Route path="/Users/AC/Currency/NewCurrencyRequestDetails" exact>
              <SecurityAccess>
                <ManageDetails>
                  <CreateStepsCurrAllocReq />
                </ManageDetails>
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CurrencyAllocationRequestDetailPage"
              exact
            >
              <SecurityAccess>
                <CurrencyAllocationRequestDetailPage />
              </SecurityAccess>
            </Route>

            <Route path="/Users/AC/Currency/BuyCurrency" exact>
              <SecurityAccess>
                <BuyCurrency />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/Externaltradecurrencydepositmanagement"
              exact
            >
              <SecurityAccess>
                <TabExTrCurrDepManage />
              </SecurityAccess>
            </Route>
            <Route path="/Users/AC/Currency/SellingCurrency" exact>
              <SecurityAccess>
                <SellingCurrency />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/ExternalTradeExportLicenseAssignment"
              exact
            >
              <SecurityAccess>
                <ExternalTradeExportLicenseAssignment />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CreateTabelReconciliationPortal"
              exact
            >
              <SecurityAccess>
                <CreateTabelReconciliationPortal />
              </SecurityAccess>
            </Route>

            {/* <Route path="/Users/AC/Currency/ExternalTradeexChangeSurveyResult" exact>
              <SecurityAccess>
                <ExternalTradeexChangeSurveyResult />
              </SecurityAccess>
            </Route> */}

            <Route path="/Users/AC/Currency/ExternalTradeCEBuyReqDetails" exact>
              <SecurityAccess>
                <ExternalTradeCEBuyReqDetails />
              </SecurityAccess>
            </Route>

            <Route path="/Users/AC/Currency/ExternalTradeCESellManage" exact>
              <SecurityAccess>
                <ExternalTradeCESellManage />
              </SecurityAccess>
            </Route>

            <Route path="/Users/AC/Currency/ExternalTradeCEBuyManage" exact>
              <SecurityAccess>
                <ExternalTradeCEBuyManage />
              </SecurityAccess>
            </Route>
            <Route path="/Users/AC/Currency/ReconciliationPortal" exact>
              <SecurityAccess>
                <ReconciliationPortal />
              </SecurityAccess>
            </Route>

            <Route path="/Users/AC/Currency/ExternalTradeAssignmentBoard" exact>
              <SecurityAccess>
                <ExternalTradeAssignmentBoard />
              </SecurityAccess>
            </Route>

            <Route path="/Users/AC/Currency/TransferIcenseClearance" exact>
              <SecurityAccess>
                <TransferIcenseClearance />
              </SecurityAccess>
            </Route>

            {/* ------------> منوی منشا ارز > زیرمنوی منشا ارز بانکی  <------------ */}
            <Route path="/Users/AC/Currency/CreateOriginOfBankCurrency" exact>
              <SecurityAccess>
                <ManageDetails>
                  <CreateOriginOfBankCurrency />
                </ManageDetails>
              </SecurityAccess>
            </Route>
            <Route path="/Users/AC/Currency/OriginOfBankCurrency" exact>
              <SecurityAccess>
                <OriginOfBankCurrencyManagement />
              </SecurityAccess>
            </Route>
            <Route path="/Users/AC/Currency/OriginOfBankCurrencyDetails" exact>
              <SecurityAccess>
                <ManageDetails>
                  <OriginOfBankCurrencyDetails />
                </ManageDetails>
              </SecurityAccess>
            </Route>

            {/* ------------> منوی منشا ارز > زیرمنوی منشا ارز غیر بانکی  <------------ */}
            <Route
              path="/Users/AC/Currency/CreateOriginOfNonBankCurrency"
              exact
            >
              <SecurityAccess>
                <ManageDetails>
                  <CreateOriginOfNonBankCurrency />
                </ManageDetails>
              </SecurityAccess>
            </Route>

            <Route path="/Users/AC/Currency/OriginOfNonBankCurrency" exact>
              <SecurityAccess>
                <OriginOfNonBankCurrencyManagement />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/OriginOfNonBankCurrencyDetails"
              exact
            >
              <SecurityAccess>
                <ManageDetails>
                  <OriginOfNonBankCurrencyDetails />
                </ManageDetails>
              </SecurityAccess>
            </Route>

            {/* ------------> منوی منشا ارز > زیرمنوی منشا ارز بدون انتقال ارز  <------------ */}
            <Route
              path="/Users/AC/Currency/CurrencyOriginWithoutCurrencyTransfer"
              exact
            >
              <SecurityAccess>
                <CurrencyOriginWithoutCurrencyTransferManagement />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CurrencyOriginWithoutCurrencyTransferDetails"
              exact
            >
              <SecurityAccess>
                <ManageDetails>
                  <CurrencyOriginWithoutCurrencyTransferDetails />
                </ManageDetails>
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CreateCurrencyOriginWithoutCurrencyTransfer"
              exact
            >
              <SecurityAccess>
                <ManageDetails>
                  <CreateCurrencyOriginWithoutCurrencyTransfer />
                </ManageDetails>
              </SecurityAccess>
            </Route>

            {/* ------------> منوی منشا ارز > زیرمنوی منشا ارز ثبت اماری  <------------ */}
            <Route
              path="/Users/AC/Currency/CurrencyOriginOfStatisticalRegistration"
              exact
            >
              <SecurityAccess>
                <CurrencyOriginOfStatisticalRegistrationManagement />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CurrencyOriginOfStatisticalRegistrationDetails"
              exact
            >
              <SecurityAccess>
                <ManageDetails>
                  <CurrencyOriginOfStatisticalRegistrationDetails />
                </ManageDetails>
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/CreateCurrencyOriginOfStatisticalRegistration"
              exact
            >
              <SecurityAccess>
                <ManageDetails>
                  <CreateCurrencyOriginOfStatisticalRegistration />
                </ManageDetails>
              </SecurityAccess>
            </Route>

            {/* ------------> منوی معامله ارز > زیرمنوی واگذاری پروانه و تهاتر ارزی <------------ */}
            <Route
              path="/Users/AC/Currency/LicenseTransferAndCurrencyExchange"
              exact
            >
              <SecurityAccess>
                <LicenseTransferAndCurrencyExchange />
              </SecurityAccess>
            </Route>
            {/* ------------> منوی معامله ارز > زیرمنوی واگذاری پروانه و تهاتر ارزی > تب آگهی های من < دکمه ایجاد آگهی جدید <------------ */}
            <Route path="/Users/AC/Currency/CreateNewAnnouncement" exact>
              <SecurityAccess>
                <CreateNewAnnouncement />
              </SecurityAccess>
            </Route>
            {/* ------------> منوی معامله ارز > زیرمنوی واگذاری پروانه و تهاتر ارزی > تب آگهی های من < دکمه جزییات آگهی  <------------ */}
            <Route path="/Users/AC/Currency/AnnouncementDetails" exact>
              <SecurityAccess>
                <ManageDetails>
                  <AnnouncementDetails />
                </ManageDetails>
              </SecurityAccess>
            </Route>
            {/* externalTradeSummeryofCommitments--------------- */}
            <Route
              path="/Users/AC/Currency/ExternalTradeSummeryofCommitments"
              exact
            >
              <SecurityAccess>
                <ExternalTradeSummeryofCommitments />
              </SecurityAccess>
            </Route>
            {/* ExternalTradeCostManagementOfExportQuotas------------- */}
            <Route
              path="/Users/AC/Currency/ExternalTradeCostManagementOfExportQuotas"
              exact
            >
              <SecurityAccess>
                <ExternalTradeCostManagementOfExportQuotas />
              </SecurityAccess>
            </Route>
            {/* ExternalTradeMoshahedeEtelaatArzi------------- */}
            <Route
              path="/Users/AC/Currency/ExternalTradeMoshahedeEtelaatArzi"
              exact
            >
              <SecurityAccess>
                <ExternalTradeMoshahedeEtelaatArziPage />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/ExternalTradeNewCostManagementOfPortQuotas"
              exact
            >
              <SecurityAccess>
                <ExternalTradeNewCostManagementOfPortQuotas />
              </SecurityAccess>
            </Route>
            {/* ExternalTradeRialExportExpres ------------------*/}
            <Route
              path="/Users/AC/Currency/ExternalTradeRialExportExpress"
              exact
            >
              <SecurityAccess>
                <ExternalTradeRialExportExpressPage />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/ExternalTradeRialExportExpressNew"
              exact
            >
              <SecurityAccess>
                <ExternalTradeRialExportExpressNewPage />
              </SecurityAccess>
            </Route>
            <Route
              path="/Users/AC/Currency/ExternalTradeRialExportExpressNewOtherCountries"
              exact
            >
              <SecurityAccess>
                <ExternalTradeRialExportExpressNewOtherCountriesPage />
              </SecurityAccess>
            </Route>
            <Route path="/Users/AC/Currency/ExternalTradeCEBuyNewReq" exact>
              <SecurityAccess>
                <ExternalTradeCEBuyNewReq />
              </SecurityAccess>
            </Route>
            {/* ExternalTradeAssignmentBoardConfirm ------------*/}
            <Route
              path="/Users/AC/Currency/ExternalTradeAssignmentBoardConfirm"
              exact
            >
              <SecurityAccess>
                <Managment />
              </SecurityAccess>
            </Route>

            <Route
              path="/Users/AC/Currency/ExternalTradeExchangeSurveyResult"
              exact
            >
              <SecurityAccess>
                <ExternalTradeExchangeSurveyResult />
              </SecurityAccess>
            </Route>
            {/* ---------------------------------مصالحه ریالی ---------------- */}

            <Route path="/Users/AC/Currency/PaymentReturnPage" exact>
              <SecurityAccess>
                {/* <ManageDetails> */}
                <PaymentReturnPage />
                {/* </ManageDetails> */}
              </SecurityAccess>
            </Route>

            {/* ------------> منشا ارز اظهارنامه <------------ */}
            <Route path="/Users/AC/Currency/OriginOfDeclarationCurrency" exact>
              <SecurityAccess>
                <ManageDetails>
                  <OriginOfDeclarationCurrency />
                </ManageDetails>
              </SecurityAccess>
            </Route>

            {/* privateLayout */}
            {/* <SecurityAccess>
              <PrivateLayaout>
                <Route
                  path="/Users/AC/Currency/RequestCurrencyAllocation"
                  exact
                  component={RequestCurrencyAllocation}
                />
                <Route
                  path="/Users/AC/Currency/BuyCurrency"
                  exact
                  component={BuyCurrency}
                />
                <Route
                  path="/Users/AC/Currency/SellingCurrency"
                  exact
                  component={SellingCurrency}
                />
                <Route
                  path="/Users/AC/Currency/TransferIcenseClearance"
                  exact
                  component={TransferIcenseClearance}
                />
                <Route
                  path="/Users/AC/Currency/ExternalTradeCEBuyManage"
                  exact
                  component={ExternalTradeCEBuyManage}
                />
                <Route
                  path="/Users/AC/Currency/ExternalTradeCESellManage"
                  exact
                  component={ExternalTradeCESellManage}
                />
                <Route
                  path="/Users/AC/Currency/ExternalTradeExportLicenseAssignment"
                  exact
                  component={ExternalTradeExportLicenseAssignment}
                />
                <Route
                  path="/Users/AC/Currency/ReconciliationPortal"
                  exact
                  component={ReconciliationPortal}
                />
                <Route
                  path="/Users/AC/Currency/CreateTAbelReconciliationPortal"
                  exact
                  component={CreateTAbelReconciliationPortal}
                />
                <Route
                  path="/Users/AC/Currency/ExternalTradeAssignmentBoard"
                  exact
                  component={ExternalTradeAssignmentBoard}
                />
                <Route
                  path="/Users/AC/Currency/ExternalTradeSummeryofCommitments"
                  exact
                  component={ExternalTradeSummeryofCommitments}
                />
              </PrivateLayaout>
            </SecurityAccess> */}
            <Route component={NotFoundPage} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

export default App;
