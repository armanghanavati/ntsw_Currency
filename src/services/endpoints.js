let BaseUrlAddress =
  process.env.REACT_APP_WEATHER_API_KEY === "production-prod"
    ? "https://www.ntsw.ir"
    : "https://lab.ntsw.ir";

let RestAPIsBaseURL = process.env.REACT_APP_API_ENDPOINT;
let RestAPIsBaseURLForCurrencyOrigin =
  process.env.REACT_APP_API_ENDPOINT_CURRENCY_ORIGIN;
let RestAPIsBaseURLForStatisticsRegistration =
  process.env.REACT_APP_API_ENDPOINT_STATISTICS_REGISTRATION;

export const endpoints = {
  BaseUrlAddress: BaseUrlAddress,
  ExternalLink: {
    profileSetting: `${BaseUrlAddress}/Users/AC/Base/ProfileSetting`,
    default: `${BaseUrlAddress}/Users/Default.aspx`,
    FollowUpProblems: "https://help.ntsw.ir/TejaratNtsw",
    TrackingInterceptionCode: `${BaseUrlAddress}/Users/TrackingInterceptionCode.aspx`,
  },
  RestAPIs: {
    cookie: {
      clearCookie: {
        url: BaseUrlAddress + "/users/ac/cookie/ClearCookie",
        method: "get",
      },
    },
    user: {
      getTokenInfo: {
        url: RestAPIsBaseURL + "Person/GetTokenInfo",
        method: "post",
      },
      validateJWTToken: {
        url: RestAPIsBaseURL + "User/ValidateJWTToken",
        method: "get",
      },
      getUserRoles: {
        url: RestAPIsBaseURL + "Person/GetUserRoles",
        method: "post",
      },
      getUserProfiles: {
        url: RestAPIsBaseURL + "Person/GetUserProfile",
        method: "post",
      },
      verifyUserToken: {
        url: RestAPIsBaseURL + "User/VerifyUserToken",
        method: "post",
      },
      getUserAccessList: {
        url: RestAPIsBaseURL + "Person/GetUserAccessedList",
        method: "post",
      },
      logout: {
        url: RestAPIsBaseURL + "Person/LogOut",
        method: "post",
      },
      extendSessionWithPassword: {
        url: RestAPIsBaseURL + "Person/NTSW_ExtendSessionWithPassword",
        method: "post",
      },
      NTSW_GetRankingLoginURL: {
        url: RestAPIsBaseURL + "CreditRate/NTSW_GetRankingLoginURL",
        method: "post",
      },
      NTSW_JAMVerifyUser: {
        url: RestAPIsBaseURL + "/CreditRate/NTSW_JAMVerifyUser",
        method: "post",
      },
      NTSW_Sysytem124Login: {
        url: RestAPIsBaseURL + "/CreditRate/NTSW_Sysytem124Login",
        method: "post",
      },
      NTSW_EnergyInquiry: {
        url: RestAPIsBaseURL + "/CreditRate/NTSW_EnergyInquiry",
        method: "post",
      },
    },

    // ------buy-currency------------
    buyCurrency: {
      getSarrafiRequestListOfUser: {
        url: RestAPIsBaseURL + "Import/getSarrafiRequestListOfUser",
        method: "post",
      },
      getBankiOrderNoList: {
        url: RestAPIsBaseURL + "Import/getBankiOrderNoList",
        method: "post",
      },
      surveyOfSarrafiRequest: {
        url: RestAPIsBaseURL + "Import/SurveyOfSarrafiRequest",
        method: "post",
      },
      canCreateSarrafiRequest: {
        url: RestAPIsBaseURL + "Import/canCreateSarrafiRequest",
        method: "post",
      },
      getFishList: {
        url: RestAPIsBaseURL + "Import/getFishList",
        method: "post",
      },
      getInrterNationalCurrencyListForNima: {
        url:
          RestAPIsBaseURL + "GeneralData/GetInrterNationalCurrencyListForNima",
        method: "post",
      },
      getSarrafiRequestAllInfo: {
        url: RestAPIsBaseURL + "Import/getSarrafiRequestAllInfo",
        method: "post",
      },
      manageDetermineSarrafiRequest: {
        url: RestAPIsBaseURL + "Import/ManageDetermineSarrafiRequest",
        method: "post",
      },
      getFishRemainPrice: {
        url: RestAPIsBaseURL + "Import/getFishRemainPrice",
        method: "post",
      },
      convertCurrency4CreateSarrafiRequest: {
        url: RestAPIsBaseURL + "Import/convertCurrency4CreateSarrafiRequest",
        method: "post",
      },
      createOrEditeSarrafiRequestVIZ1: {
        url: RestAPIsBaseURL + "Import/createOrEditeSarrafiRequestVIZ1",
        method: "post",
      },
      getDestinationBankList: {
        url: RestAPIsBaseURL + "Import/getDestinationBankList",
        method: "post",
      },
      getCountryListByListNew: {
        url:
          RestAPIsBaseURL +
          "GeneralData/GetCountryListByList_new?urlVCodelogin=",
        method: "post",
      },
      getSarrafiPaymentAccountType: {
        url: RestAPIsBaseURL + "Import/getSarrafiPaymentAccountType",
        method: "post",
      },
      createOrEditeSarrafiRequestVIZ2_2: {
        url: RestAPIsBaseURL + "Import/createOrEditeSarrafiRequestVIZ2_2",
        method: "post",
      },
      getHavaleType: {
        url: RestAPIsBaseURL + "Import/GetHavaleType",
        method: "post",
      },
      createSarrafiRequestVIZ3: {
        url: RestAPIsBaseURL + "Import/createSarrafiRequestVIZ3",
        method: "post",
      },
      getsarrafiCompanyListWithSurveyStatus: {
        url: RestAPIsBaseURL + "Import/getsarrafiCompanyListWithSurveyStatus",
        method: "post",
      },
      getSurveyCommentsInfo: {
        url: RestAPIsBaseURL + "Import/getSurveyCommentsInfo",
        method: "post",
      },
      getSurveyInfo: {
        url: RestAPIsBaseURL + "Import/getSurveyInfo",
        method: "post",
      },
      getRequestStatusDetail: {
        url: RestAPIsBaseURL + "Import/GetRequestStatusDetail",
        method: "post",
      },
      getSarrafiRequestType: {
        url: RestAPIsBaseURL + "Import/GetSarrafiRequestType",
        method: "post",
      },
      getSurveyStatus: {
        url: RestAPIsBaseURL + "Import/getSurveyStatus",
        method: "post",
      },
      getListOfRequest_Excel: {
        url: RestAPIsBaseURL + "Import/GetListOfRequest_Excel",
        method: "post",
      },
      getSarrafiRequestStatus: {
        url: RestAPIsBaseURL + "Import/GetSarrafiRequestStatus",
        method: "post",
      },
      getSarrafiOfferList: {
        url: RestAPIsBaseURL + "Import/getSarrafiOfferList",
        method: "post",
      },
      getQuestions: {
        url: RestAPIsBaseURL + "Survey/GetQuestions",
        method: "post",
      },
      insertAnswers: {
        url: RestAPIsBaseURL + "Survey/InsertAnswers",
        method: "post",
      },
    },

    // ---------Selling currency------------------
    sellingCurrency: {
      getDealListOfUserExport: {
        url: RestAPIsBaseURL + "Export/getDealListOfUser_Export",
        method: "post",
      },
      getSarrafiRequestListOfUser: {
        url: RestAPIsBaseURL + "Export/getSarrafiRequestListOfUser_Export",
        method: "post",
      },
    },

    // ---------Reconciliation Portal------------------
    reconciliationPortal: {
      getTokenOfPayment: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetTokenOfPayment",
        method: "post",
      },

      verifyPayment: {
        url: RestAPIsBaseURL + "ObligationEliminate/VerifyPayment",
        method: "post",
      },
    },

    // ------currency-trading------------
    currencyTrading: {
      getAllConciliationPayment: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetAllConciliationPayment",
        method: "post",
      },
      getConciliationAmount: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetConciliationAmount",
        method: "post",
      },
      canCreateNewConciliation: {
        url: RestAPIsBaseURL + "ObligationEliminate/CanCreateNewConciliation",
        method: "post",
      },
    },

    basicOperation: {
      companyIntroduction: {
        url: RestAPIsBaseURL + "ComPany/NTSW_CompanyIntroduction",
        method: "post",
      },
      alternativeCompanyIntroduction: {
        url: RestAPIsBaseURL + "Company/NTSW_AlternativeCompanyIntroduction",
        method: "post",
      },
      insertCompanyDocument: {
        url: RestAPIsBaseURL + "Company/NTSW_InsertCompanyDocument",
        method: "post",
      },
      GetAllDeclarationTypes: {
        url: RestAPIsBaseURL + "Common/GetAllDeclarationTypes",
        method: "get",
      },
      getAllPackagingType: {
        url: RestAPIsBaseURL + "Common/GetAllPackagingType",
        method: "get",
      },
      getAllPrepareHsCodeForSearch: {
        url: RestAPIsBaseURL + "Common/GetAllPrepareHsCodeForSearch",
        method: "post",
      },

      getActivePrepareHsCodeForSearch: {
        url: RestAPIsBaseURL + "Common/GetActivePrepareHsCodeForSearch",
        method: "post",
      },
    },
    base: {
      CardFileList: {
        url: RestAPIsBaseURL + "CardFile/GetCardFileList_NAL",
        method: "post",
      },
      deleteBase: {
        url: RestAPIsBaseURL + "CardFile/IDeleteCardFile_NAL",
        method: "post",
      },
    },
    // http://172.16.229.27/FacadeRest/api/Proxy/GetProxyListForProxyManagement
    BasicOperationFrm: {
      basicOperation: {
        url: RestAPIsBaseURL + "Proxy/GetProxyListForProxyManagement",
        method: "post",
      },
    },

    preCotage: {
      getBankiRegedOrderList: {
        url: RestAPIsBaseURL + "PreCotage/GetBankiRegedOrderList",
        method: "post",
      },
      getAllPreCotageList: {
        url: RestAPIsBaseURL + "PreCotage/GetAllPreCotageList",
        method: "post",
      },
      getPreCotageAllDetails: {
        url: RestAPIsBaseURL + "PreCotage/GetPreCotageAllDetails",
        method: "post",
      },
      canSetPreCotageForBanki: {
        url: RestAPIsBaseURL + "PreCotage/canSetPreCotage_Banki",
        method: "post",
      },
      getSanadHamlList4SetPreCotageForBanki: {
        url: RestAPIsBaseURL + "PreCotage/getSanadHamlList4SetPreCotage_Banki",
        method: "post",
      },
      getFieldsInfo4SetPreCotageForBanki: {
        url: RestAPIsBaseURL + "PreCotage/getFieldsInfo4SetPreCotage_Banki",
        method: "post",
      },
      getFieldsInfo4SetPreCotageWithoutSanadhaml: {
        url:
          RestAPIsBaseURL +
          "PreCotage/getFieldsInfo4SetPreCotageWithoutSanadhaml",
        method: "post",
      },
      getBordersCustemsSource4SetPreCotage: {
        url: RestAPIsBaseURL + "PreCotage/getBordersCustemsSource4SetPreCotage",
        method: "post",
      },
      inquiryBillOfLaddingPaging: {
        url: RestAPIsBaseURL + "PreCotage/InquiryBillOfLaddingPaging",
        method: "post",
      },
      inquiryBillOfLaddingByBolVcode: {
        url: RestAPIsBaseURL + "PreCotage/InquiryBillOfLaddingByBolVcode",
        method: "post",
      },
      checkBillOfladingEndorsement: {
        url: RestAPIsBaseURL + "PreCotage/CheckBillOfladingEndorsement",
        method: "post",
      },
      getPreCotageGoods4CreatePreCotage: {
        url: RestAPIsBaseURL + "PreCotage/getPreCotageGoods4CreatePreCotage",
        method: "post",
      },
      createPreCotageGoodsExcel: {
        url: RestAPIsBaseURL + "PreCotage/createPreCotageGoodsExcel",
        method: "post",
      },
      getPreCotageGoodsExcel: {
        url: RestAPIsBaseURL + "PreCotage/getPreCotageGoodsExcel",
        method: "post",
      },
      showWarningTempPreCotageGoods: {
        url: RestAPIsBaseURL + "PreCotage/ShowWarningTempPreCotageGoods",
        method: "post",
      },
      setTempPreCotageGoods: {
        url: RestAPIsBaseURL + "PreCotage/setTempPreCotageGoods",
        method: "post",
      },
      showWarningCreatePrecotage: {
        url: RestAPIsBaseURL + "PreCotage/ShowWarningCreatePrecotage",
        method: "post",
      },
      setPrecotageForBanki: {
        url: RestAPIsBaseURL + "PreCotage/setPrecotage_Banki",
        method: "post",
      },
      // منشا ارز بدون انتقال ارز
      getBankiRegedOrderListWithoutCurrencyTransfer: {
        url:
          RestAPIsBaseURL +
          "PreCotage/GetBankiRegedOrderList_WithoutCurrencyTransfer",
        method: "post",
      },
      // ایجاد منشا ارز بدون انتقال ارز
      canSetPreCotageWithoutCurrencyTransfer: {
        url:
          RestAPIsBaseURL + "PreCotage/canSetPreCotage_WithoutCurrencyTransfer",
        method: "post",
      },
      setPrecotageWithoutCurrencyTransfer: {
        url: RestAPIsBaseURL + "PreCotage/setPrecotage_WithoutCurrencyTransfer",
        method: "post",
      },

      // منشا ارز غیر بانکی
      getSabtSefareshDisBank: {
        url: RestAPIsBaseURL + "PreCotage/GetSabtSefareshDisBank",
        method: "post",
      },
      canSetPreCotageDisBank: {
        url: RestAPIsBaseURL + "PreCotage/canSetPreCotage_DisBank",
        method: "post",
      },

      // دکمه های عملیات
      ebtalPreCotageDISBNK: {
        url: RestAPIsBaseURL + "PreCotage/Ebtal_PreCotage_DIS_BNK",
        method: "post",
      },
      ebtalPreCotageBNK: {
        url: RestAPIsBaseURL + "PreCotage/Ebtal_PreCotage_BNK",
        method: "post",
      },
      elamTarkhis: {
        url: RestAPIsBaseURL + "PreCotage/elamTarkhis",
        method: "post",
      },
      sendToInternalTrade: {
        url: RestAPIsBaseURL + "PreCotage/SendToInternalTrade",
        method: "post",
      },
    },
    preCotageSG: {
      getRegedOrderList: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/GetRegedOrderList",
        method: "post",
      },
      getPreCotageList: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/GetPreCotageList ",
        method: "post",
      },
      canCreatePreCotage: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/CanCreatePreCotage",
        method: "post",
      },
      getProformaInfoForCreatePreCotage: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/GetProformaInfoForCreatePreCotage",
        method: "post",
      },
      convertPreCotageSourceCurrencyToProformaCurrency: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/ConvertPreCotageSourceCurrencyToProformaCurrency",
        method: "post",
      },
      getListOfPreCotageSourceType: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/GetListOfPreCotageSourceType",
        method: "post",
      },
      precotageSourceInqueryFrontierBackpackSailor: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/PrecotageSourceInqueryFrontierBackpackSailor",
        method: "post",
      },
      precotageSourceInquery: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/precotageSourceInquery",
        method: "post",
      },
      getPreCotageAllInfo: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/GetPreCotageAllInfo",
        method: "post",
      },
      createPreCotage: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/CreatePreCotage",
        method: "post",
      },
      sendToInternalTrade: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/SendToInternalTrade",
        method: "post",
      },
      manageDischargeAnnouncement: {
        url:
          RestAPIsBaseURLForStatisticsRegistration +
          "PreCotageSG/ManageDischargeAnnouncement",
        method: "post",
      },
    },

    generalData: {
      getInrterNationalCurrencyListSG: {
        url: RestAPIsBaseURL + "GeneralData/GetInrterNationalCurrencyList_SG",
        method: "post",
      },
      // لیست ارز درخواست
      ntsw_GetCurrencyListByList: {
        url: RestAPIsBaseURL + "/GeneralData/NTSW_GetCurrencyListByList",
        method: "post",
      },
      getInrterNationalCurrencyListByList: {
        url:
          RestAPIsBaseURL + "GeneralData/GetInrterNationalCurrencyListByList",
        method: "post",
      },
      getCustomList: {
        url: RestAPIsBaseURL + "GeneralData/NTSW_GetCustomList",
        method: "post",
      },
      getCountryList: {
        url: RestAPIsBaseURL + "GeneralData/GetCountryListByList",
        method: "post",
      },
      getShamsiYearList: {
        url: RestAPIsBaseURL + "GeneralData/GetShamsiYearList",
        method: "post",
      },
    },
    import: {
      convertCurrency4CreateSarrafiRequest: {
        url: RestAPIsBaseURL + "Import/convertCurrency4CreateSarrafiRequest",
        method: "post",
      },
    },
    // ObligationEliminate----------------
    ObligationEliminate: {
      GetImportObligationsSummery: {
        url:
          RestAPIsBaseURL + "ObligationEliminate/GetImportObligationsSummery",
        method: "post",
      },
      GetImportObligationsSummeryDetails: {
        url:
          RestAPIsBaseURL +
          "ObligationEliminate/GetImportObligationsSummeryDetails",
        method: "post",
      },
      GetListOfExportLicense: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetListOfExportLicense",
        method: "post",
      },
      DeleteExportLicense: {
        url: RestAPIsBaseURL + "ObligationEliminate/DeleteExportLicense",
        method: "post",
      },
      GetListOfExportLicense_Excel: {
        url:
          RestAPIsBaseURL + "ObligationEliminate/GetListOfExportLicense_Excel",
        method: "post",
      },
      GetRialExportStatus: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetRialExportStatus",
        method: "post",
      },
      GetExportLicenseList: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetExportLicenseList",
        method: "post",
      },
      DeleteExportLicenseOtherContries: {
        url:
          RestAPIsBaseURL +
          "ObligationEliminate/DeleteExportLicenseOtherContries",
        method: "post",
      },
      GetListOfExportLicenseOtheCountries_Excel: {
        url:
          RestAPIsBaseURL +
          "/ObligationEliminate/GetListOfExportLicenseOtheCountries_Excel",
        method: "post",
      },
      GetRialExportStatusOtherCountries: {
        url:
          RestAPIsBaseURL +
          "ObligationEliminate/GetRialExportStatusOtherCountries",
        method: "post",
      },
      InquiryExportCotage: {
        url: RestAPIsBaseURL + "/ObligationEliminate/InquiryExportCotage",
        method: "post",
      },
      CotageInquiry: {
        url: RestAPIsBaseURL + "ObligationEliminate/CotageInquiry",
        method: "post",
      },
      GetRefMasrafType: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetRefMasrafType",
        method: "post",
      },
      GetMasrafType: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetMasrafType",
        method: "post",
      },

      GetListOfUses: {
        url: RestAPIsBaseURL + "ObligationEliminate/GetListOfUses",
        method: "post",
      },
      SanaNimaInfoInquiry: {
        url: RestAPIsBaseURL + "/ObligationEliminate/SanaNimaInfoInquiry",
        method: "post",
      },
      CalculateUses: {
        url: RestAPIsBaseURL + "ObligationEliminate/CalculateUses",
        method: "post",
      },
      SendUseToBank: {
        url: RestAPIsBaseURL + "/ObligationEliminate/SendUseToBank",
        method: "post",
      },
      ReturnReportOfCurrencyAllocation: {
        url:
          RestAPIsBaseURL +
          "ObligationEliminate/ReturnReportOfCurrencyAllocation",
        method: "post",
      },
      InquiryExportLicense: {
        url: RestAPIsBaseURL + "ObligationEliminate/InquiryExportLicense",
        method: "post",
      },
      NTSW_ManageInquiryExportLicenseOtherCountries: {
        url:
          RestAPIsBaseURL +
          "ObligationEliminate/NTSW_ManageInquiryExportLicenseOtherCountries",
        method: "post",
      },
      NTSW_CreateExportLicense: {
        url: RestAPIsBaseURL + "ObligationEliminate/NTSW_CreateExportLicense",
        method: "post",
      },
      FinalCreateExportLicense: {
        url: RestAPIsBaseURL + "ObligationEliminate/FinalCreateExportLicense",
        method: "post",
      },
    },

    CurrencyAllocation: {
      //درخواست تخصیص ارز
      convertCurrencyForEditCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/ConvertCurrencyForEditCurrencyAllocationRequest",
        method: "post",
      },
      // اطلاعات ویرایش
      getCurrencyAllocationRequestDetailForEditing: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestDetailForEditing",
        method: "post",
      },
      // ویرایش
      editCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL + "CurrencyAllocation/EditCurrencyAllocationRequest",
        method: "post",
      },
      GetRegedOrderList: {
        url: RestAPIsBaseURL + "CurrencyAllocation/GetRegedOrderList",
        method: "post",
      },
      // درخواست تخصیص ارز1
      createFeasibilityCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/CreateFeasibilityCurrencyAllocationRequest",
        method: "post",
      },
      // اطلاعات بروز برسانی
      upgradeFeasibilityRegedOrder: {
        url:
          RestAPIsBaseURL + "CurrencyAllocation/UpgradeFeasibilityRegedOrder",
        method: "post",
      },
      // به روز رسانی ثبت سفارش
      upgradeRegedOrder: {
        url: RestAPIsBaseURL + "CurrencyAllocation/UpgradeRegedOrder",
        method: "post",
      },
      // 2درخواست تخصیص ارز
      getRegedOrderInfo: {
        url: RestAPIsBaseURL + "CurrencyAllocation/GetRegedOrderInfo",
        method: "post",
      },
      // لیست کمبو ( نوع معامله)
      getCurrencyAllocationRequestDealingTypeList: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestDealingTypeList",
        method: "post",
      },
      // لیست کمبو ( متعهد)
      getCurrencyAllocationRequestCommittedPersonList: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestCommittedPersonList",
        method: "post",
      },
      // لیست کمبو ( محل تسهیلات)
      getCurrencyAllocationRequestFacilityLocationList: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestFacilityLocationList",
        method: "post",
      },
      // لیست کمبو ( بازپرداخت )
      getCurrencyAllocationRequestRepaymentDeadlineTypeList: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestRepaymentDeadlineTypeList",
        method: "post",
      },
      // لیست کمبو ( تامین محل ارز )
      getCurrencyAllocationRequestCurrencySupplyLocationList: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestCurrencySupplyLocationList",
        method: "post",
      },
      // لیست کمبو ( نرخ ارز )
      getCurrencyAllocationRequestCurrencyRateTypeList: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestCurrencyRateTypeList",
        method: "post",
      },
      // لیست کمبو ( نوع درخواست )
      getCurrencyAllocationRequestRequestTypeList: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestRequestTypeList",
        method: "post",
      },
      // ثبت درخواست تخصیص ارز
      createCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/CreateCurrencyAllocationRequest",
        method: "post",
      },

      // buttons condition----------
      ConditionalApproveCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "/CurrencyAllocation/ConditionalApproveCurrencyAllocationRequest",
        method: "post",
      },
      // buttons renewal----------
      RenewalCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/RenewalCurrencyAllocationRequest",
        method: "post",
      },
      GetCurrencyAllocationRequestDetailsOfChangesHistory: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestDetailsOfChangesHistory",
        method: "post",
      },
      // buttons Resend----------
      ResendCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/ResendCurrencyAllocationRequest",
        method: "post",
      },
      // buttons Divide----------
      DivideCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/DivideCurrencyAllocationRequest",
        method: "post",
      },
      // buttons Discont----------
      DiscontinueCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/DiscontinueCurrencyAllocationRequest",
        method: "post",
      },
      // buttons Revoke----------
      RevokeCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/RevokeCurrencyAllocationRequest",
        method: "post",
      },
      // detail observe----------
      GetAllocatedAmountOfCurrencyAllocationRequest: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetAllocatedAmountOfCurrencyAllocationRequest",
        method: "post",
      },
      GetOrganizationViewPoint: {
        url: RestAPIsBaseURL + "CurrencyAllocation/GetOrganizationViewPoint",
        method: "post",
      },
      // for deteil dividing button
      GetCurrencyAllocationRequestDetailForDividing: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestDetailForDividing",
        method: "post",
      },
      // for deteil status
      GetCurrencyAllocationRequestStatus: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestStatus",
        method: "post",
      },
      // for active status
      GetCurrencyAllocationRequestActiveStatus: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestActiveStatus",
        method: "post",
      },
      //-------------------------
      getCurrencyAllocationRequestFieldsRelations: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestFieldsRelations",
        method: "post",
      },
      CurrencyAllocationRequestAllowedRegedOrderWarning: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/CurrencyAllocationRequestAllowedRegedOrderWarning",
        method: "post",
      },
      GetCurrencyAllocationRequests: {
        url:
          RestAPIsBaseURL + "CurrencyAllocation/GetCurrencyAllocationRequests",
        method: "post",
      },
      GetCurrencyAllocationRequestMainActionHistory: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestMainActionHistory",
        method: "post",
      },
      GetCurrencyAllocationRequestDetailPage: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestDetailPage",
        method: "post",
      },
      GetCurrencyAllocationRequestChangeStatusActionHistory: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestChangeStatusActionHistory",
        method: "post",
      },
      GetCurrencyAllocationRequestDocument: {
        url:
          RestAPIsBaseURL +
          "CurrencyAllocation/GetCurrencyAllocationRequestDocument",
        method: "post",
      },
    },

    //Get Orders List in ExternalTradeAssignmentBoard
    declaration: {
      GetRegedOrderList: {
        url: RestAPIsBaseURL + "Declaration/GetOrdersList",
        method: "post",
      },
      ConfirmForGetAdviseListForOrder: {
        url: RestAPIsBaseURL + "Declaration/ConfirmForGetAdviseListForOrder",
        method: "post",
      },
      GetListOfAdviseForOrderNo: {
        url: RestAPIsBaseURL + "Declaration/GetListOfAdviseForOrderNo",
        method: "post",
      },
      GetAmountSortList: {
        url: RestAPIsBaseURL + "Declaration/GetAmountSortList",
        method: "post",
      },
      getCustomDeclarationListForTahator: {
        url: RestAPIsBaseURL + "Declaration/GetCustomDeclarationList_Tahator",
        method: "post",
      },
      saderatiCotageInquiry: {
        url: RestAPIsBaseURL + "Declaration/SaderatiCotageInquiry",
        method: "post",
      },
      saderatiCotageInquiryWithEqualPrice: {
        url:
          RestAPIsBaseURL + "Declaration/SaderatiCotageInquiryWithEqualPrice",
        method: "post",
      },
      getADVShowName: {
        url: RestAPIsBaseURL + "Declaration/GetADVShowName",
        method: "post",
      },
      createAdvitise: {
        url: RestAPIsBaseURL + "Declaration/CreateAdvitise",
        method: "post",
      },
      advitiseDetail: {
        url: RestAPIsBaseURL + "Declaration/AdvitiseDetail",
        method: "post",
      },
      getAnswerOfCustomDeclarationTransfer: {
        url:
          RestAPIsBaseURL + "Declaration/getAnswerOfCustomDeclarationTransfer",
        method: "post",
      },
      adviseList: {
        url: RestAPIsBaseURL + "Declaration/AdviseList",
        method: "post",
      },
      deleteAdvise: {
        url: RestAPIsBaseURL + "Declaration/DeleteAdvise",
        method: "post",
      },
      getCustomDeclarationTransferListOfUser: {
        url:
          RestAPIsBaseURL +
          "Declaration/getCustomDeclarationTransferListOfUser",
        method: "post",
      },
      surveyOfCustomDeclaration: {
        url: RestAPIsBaseURL + "Declaration/SurveyOfCustomDeclaration",
        method: "post",
      },
    },
    currencyOrigin: {
      getAllDeclarationPreCtoage: {
        url:
          RestAPIsBaseURLForCurrencyOrigin +
          "CurrencyOrigin/GetAllDeclarationPreCtoage",
        method: "post",
      },
    },
  },
};
