export const handleDastineError = (resultId) => {
  switch (resultId) {
    case "0":
      return "SUCCESSFUL";
    case "10":
      return "E_UNKNOWN";
    case "11":
      return "E_CERTIFICATE_NOT_SELECTED";
    case "12":
      return "E_HASH_ALG_NOT_SUPPORTED";
    case "13":
      return "E_PIN_WINDOW_TIMEOUT";
    case "14":
      return "E_WRONG_PIN";
    case "15":
      return "E_ALLOCATE_MEMORY_ERROR";
    case "17":
      return "E_EVENT_ALREADY_SET";
    case "18":
      return "E_CANCLED_BY_USER";
    case "19":
      return "E_NOT_SUPPORTED";
    case "20":
      return "E_PERMISSION_DENIED";
    case "21":
      return "E_WRONG_PUK";
    case "22":
      return "E_WRONG_SUBJECTDN";
    case "23":
      return "E_SELECTCERTIFICATE_NOT_FOUND";
    case "24":
      return "E_SELECTCERTIFICATE_HARDWAREINFO_CHECK_ERROR";
    case "25":
      return "E_SELECTCERTIFICATE_NO_CERTIFICATE_ON_TOKEN";
    case "26":
      return "E_SELECTCERTIFICATE_WRONG_PASSWORD";
    case "27":
      return "E_SELECTCERTIFICATE_FILE_CURRUPT";
    case "29":
      return "E_PIN_BLOCKED";
    case "30":
      return "E_NO_PRIVATEKEY";
    case "31":
      return "E_SIGN_GENERATE_HASH_ERROR";
    case "32":
      return "E_SIGN_GENERATE_SIGNATURE_ERROR";
    case "33":
      return "E_SIGN_RELEASE_CONTEXT_ERROR";
    case "34":
      return "E_INPUT_DATA_NOT_B64";
    case "35":
      return "E_INVALID_INPUT_DATA";
    case "36":
      return "E_LISTTOKENS_ENUM_CSPS_ERROR";
    case "41":
      return "E_GENERATECSR_AQUIRECONTEXT_ERROR";
    case "42":
      return "E_GENERATECSR_GENERATE_KEYPAIR_ERROR";
    case "43":
      return "E_GENERATECSR_WRONG_PUBLICKEY";
    case "44":
      return "E_GENERATECSR_SIGN_CSR_ERROR";
    case "45":
      return "E_GENERATECSR_ADMINKEY_ERROR";
    case "48":
      return "E_IMPORTCERTIFICATE_CERTIFICATE_NOT_B64";
    case "49":
      return "E_IMPORTCERTIFICATE_HANDLE_NOT_VALID";
    case "50":
      return "E_IMPORTCERTIFICATE_WRITE_CERTIFICATE_ERROR";
    case "56":
      return "E_CMSSIGN_SIGN_ERROR";
    case "57":
      return "E_CMSSIGN_INVALID_ATTRIBUTE";
    case "60":
      return "E_CMSDECRYPT_DECRYPT_ERROR";
    case "63":
      return "E_REMOVECERTIFICATE_NO_PROVIDER";
    case "64":
      return "E_REMOVECERTIFICATE_ERROR";
    case "65":
      return "E_REMOVECERTIFICATE_ADMINKEY_ERROR";
    case "66":
      return "E_REMOVEGENERATEDKEYPAIR_NO_PROVIDER";
    case "67":
      return "E_REMOVEGENERATEDKEYPAIR_ERROR";
    case "69":
      return "E_SETPINPOLICY_WRONG_POLICY";
    case "72":
      return "E_CHANGEPIN_NEW_PINS_MISMATCH";
    case "73":
      return "E_CHANGEPIN_NEW_PIN_WRONG_LENGTH";
    case "74":
      return "E_CHANGEPIN_NEW_PIN_NOT_SAFE";
    case "75":
      return "E_CHANGEPIN_ERROR";
    case "77":
      return "E_SETADMINKEY_NO_TOKEN_CONNECTED";
    case "78":
      return "E_FUNCTION_NOT_FOUND";
    case "79":
      return "E_SETPIN_CONFIG_NOT_ALLOWED";
    case "80":
      return "E_INVALID_CONFIG";
    case "81":
      return "E_READSIGNATUREIMAGE_FILE_NOT_FOUND";
    case "82":
      return "E_READFINGERPRINTIMAGE_FILE_NOT_FOUND";
    case "83":
      return "E_READCUSTOMFIELD_FILE_NOT_FOUND";
    case "84":
      return "E_SETCONFIG_BAD_PARAM";
    case "85":
      return "E_SETCONFIG_PARSE_ERROR";
    case "86":
      return "E_SETCONFIG_INVALID_SIGNATURE";
    case "87":
      return "E_READFACEIMAGE_FILE_NOT_FOUND";
    case "88":
      return "E_KEYCONTAINER_NOT_AVAILABLE";
    case "89":
      return "E_TOKEN_NOT_AVAILABLE";
    case "90":
      return "E_PUK_BLOCKED";
    case "91":
      return "E_NOT_AUTHENTICATED_RETRY_1";
    case "92":
      return "E_NOT_AUTHENTICATED_RETRY_2";
    case "93":
      return "E_NOT_AUTHENTICATED_RETRY_3";
    case "94":
      return "E_NOT_AUTHENTICATED_RETRY_4";
    case "95":
      return "E_NOT_AUTHENTICATED_RETRY_5";
    case "96":
      return "E_NOT_AUTHENTICATED_RETRY_6";
    case "97":
      return "E_NOT_AUTHENTICATED_RETRY_7";
    case "98":
      return "E_NOT_AUTHENTICATED_RETRY_8";
    case "99":
      return "E_NOT_AUTHENTICATED_RETRY_9";
    case "101":
      return "E_FINGERPRINT_DEVICE_NOT_SUPPORT";
    case "102":
      return "E_FINGERPRINT_LOAD_DLL_ERROR";
    case "103":
      return "E_FINGERPRINT_DEVICE_OPEN_ERROR";
    case "104":
      return "E_FINGERPRINT_DEVICE_CAPTURE_ERROR";
    case "105":
      return "E_FINGERPRINT_DEVICE_CLOSE_ERROR";
    case "106":
      return "E_FINGERPRINT_DEVICE_DLL_ERROR";
    case "107":
      return "E_FINGERPRINT_GET_SUPPORTED_DEVICES_ERROR";
    case "108":
      return "E_FINGERPRINT_DEVICE_NOT_FOUND";
    case "109":
      return "E_FINGERPRINT_FAKE_FINGER_DETECT";
    case "110":
      return "E_DASTINE_IS_UP_TO_DATE";
    case "111":
      return "E_DASTINE_IS_OUT_OF_DATE";
    case "112":
      return "E_UPDATE_OUT_OF_MEMORY";
    case "113":
      return "E_UPDATE_DOWNLOAD_FAILURE";
    case "114":
      return "E_UPDATE_UNKNOWN_ERROR";
    case "115":
      return "E_UPDATE_IS_DOWNLOADING";
    case "116":
      return "E_UPDATE_DOWNLOAD_COMPLETE";
    case "117":
      return "E_UPDATE_INSTALL_RUNED";
    case "118":
      return "E_UPDATE_FILE_NOT_EXIST";
    case "119":
      return "E_UPDATE_IS_CHECKING_VERSION";
    case "120":
      return "E_RESPONSE_TIMEOUT";
    case "200":
      return "E_NID_NOT_SUPPORT";
    case "201":
      return "E_NID_VERSION_NOT_SUPPORT";
    case "202":
      return "E_NID_LOAD_DLL_ERROR";
    case "203":
      return "E_NID_LOAD_FUNCTION_ERROR";
    case "204":
      return "E_NID_INITIALIZE_ERROR";
    case "205":
      return "E_NID_GET_FINGER_INDEX_ERROR";
    case "206":
      return "E_NID_DS_SERVER_ACCESS_ERROR";
    case "207":
      return "E_NID_GET_SIGNER_CER_ERROR";
    case "208":
      return "E_NID_AUTHENTICATE_ERROR";
    case "209":
      return "E_NID_SIGN_ERROR";
    case "210":
      return "E_NID_UNBLOCK_PIN_ERROR";
    case "211":
      return "E_NID_SIGN_SERVER_NOT_AVAILABLE";
    case "220":
      return "E_PROVIDER_NAME_NOT_FOUND";
    case "221":
      return "E_WRONG_EXTENSION";
    case "222":
      return "E_SET_PIN_GUIDE_ERROR";
    default:
      return "SUCCESSFUL";
  }
};

export const dastineVisibleMessage = {
  0: "با موفقیت انجام شد.",
  10: "خطای 10: لطفا با مرکز پشتیبانی تماس بگیرید. 124 داخلی 2 ",
  11: "خطای 11: خطا در انتخاب گواهی. لطفا از اتصال صحیح توکن و نصب درایور آن اطمینان حاصل نمایید.",
  12: "خطای 12: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  13: "زمان وارد کردن رمزعبور توکن به اتمام رسیده است. - کد خطا 13",
  14: "رمزعبور توکن صحیح نمیباشد. - کد خطا 14",
  15: "خطای 15: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  16: "خطای 16: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  17: "خطای 17: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  18: "عملیات توسط کاربر لغو شد. - کد خطا 18",
  19: " عدم پشتیبانی. - کد خطا 19",
  20: "دسترسی محدود شده‌است. - کد خطا 20",
  21: "خطای 21: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2",
  22: "خطای 22: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  23: "خطای 23: خطا در انتخاب گواهی. لطفا از اتصال صحیح توکن و نصب درایور آن اطمینان حاصل نمایید.",
  24: "خطای 24: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  25: "توکن و یا گواهی‌‌های داخل آن موجود نمی‌باشد.\n خطای 25: لطفا از اتصال صحیح توکن و نصب درایور آن اطمینان حاصل نمایید",
  26: "رمز اشتباه می باشد",
  27: "خطای 27: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  29: "رمز بلاک شد",
  30: "توکن به رایانه شما متصل نیست. کد خطا 30",
  31: "خطای 31: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  32: "خطای 32: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  33: "خطای 33: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  34: "خطای سیستمی! لطفا مجددا تلاش کنید. -کد خطا 34",
  35: "E_INVALID_INPUT_DATA",
  36: "خطای 36: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  41: "خطای 41: از اتصال توکن اطمینان حاصل نمایید", //"<br/> معمولا بخاطر اینکه که مقدار نام توکن خالی ارسال میشه به GenerateCSR.<br/> مقدارش رو با دستینه باید زمان اتخاب گواهی بخونه<br/> پس کد به روز نیست<br/>CustomizedDastine - DetailRekey Should Update";
  42: "خطای 42: خطا در تولید زوج کلید. از خالی بودن فضای توکن اطمینان حاصل کنید.",
  43: "خطای 43: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  44: "خطای 44: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2",
  45: "خطای 45: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  48: "خطای 48: خطا در نصب گواهی: لطفا مجددا تلاش نمایید. در صورت عدم رفع خطا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.", // وقتی مقدار سی اس آر خالی بره به فاز 3 تو ایمپورت این خطا رو میگیریم,
  49: "مدت زمان مجاز اجرای فرآیند به اتمام رسیده است. لطفا فرآیند را از ابتدا انجام دهید.", // سشن دستینه تمام شده است و گواهی را نمی شناسد,
  50: "خطای 50: خطا در نصب گواهی: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  56: "خطای 56: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  57: "خطای 57: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  60: "خطای 60: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  63: "خطای 63: خطا در حذف گواهی: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  64: "خطای 64: خطا در حذف گواهی: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2",
  65: "خطای 65: خطا در حذف گواهی: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  66: "خطای 66: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  67: "خطای 67: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  69: "خطای 69: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  72: "خطای 72: رمز جدید مطابقت ندارد",
  73: "خطای 73: تعداد کاراکتر رمز وارد شده اشتباه است",
  74: "خطای 74: رمز جدید ضعیف است",
  75: "خطای 75: خطا در تغییر رمز",
  77: "خطای 77: توکن موجود نمی باشد. لطفا از اتصال توکن اطمینان حاصل نمایید.",
  78:
    "خطای شماره 78: دستینه نیاز به بروزرسانی دارد. لطفا آخرین نسخه نرم افزار دستینه را از بخش دانلود در سایت" +
    "\n" +
    "www.gica.ir" +
    "\n" +
    "دریافت و نصب نمایید و فرآیند تمدید را از ابتدا انجام دهید.",
  79: "خطای 79: انجام تنظیمات مجاز نیست",
  80: "لطفا صفحه را رفرش نمایید و مجددا تلاش کنید. - کد خطا 80",
  81: "E_READSIGNATUREIMAGE_FILE_NOT_FOUND",
  82: "E_READFINGERPRINTIMAGE_FILE_NOT_FOUND",
  83: "خطای 83: فایل پیدا نشد",
  84: "خطای 84: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  85: "خطای 85: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  86: "خطای 86: امضا معتبر نمی باشد",
  87: "E_READFACEIMAGE_FILE_NOT_FOUND",
  88: "E_KEYCONTAINER_NOT_AVAILABLE",
  89: "خطای 89: توکن موجود نمی باشد. لطفا از اتصال توکن اطمینان حاصل نمایید",
  90: "PUK بلاک شد",
  91: "احراز انجام نشد_دوباره تلاش کنید",
  92: "احراز انجام نشد_دوباره تلاش کنید",
  93: "احراز انجام نشد_دوباره تلاش کنید",
  94: "احراز انجام نشد_دوباره تلاش کنید",
  95: "احراز انجام نشد_دوباره تلاش کنید",
  96: "احراز انجام نشد_دوباره تلاش کنید",
  97: "احراز انجام نشد_دوباره تلاش کنید",
  98: "احراز انجام نشد_دوباره تلاش کنید",
  99: "احراز انجام نشد_دوباره تلاش کنید",
  101: "خطای 101: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  102: "خطای 102: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  103: "خطای 103: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  104: "خطای 104: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  105: "E_FINGERPRINT_DEVICE_CLOSE_ERROR",
  106: "E_FINGERPRINT_DEVICE_DLL_ERROR",
  107: "E_FINGERPRINT_GET_SUPPORTED_DEVICES_ERROR",
  108: "E_FINGERPRINT_DEVICE_NOT_FOUND",
  109: "E_FINGERPRINT_FAKE_FINGER_DETECT",
  110: "دستینه به روز است",
  111: "دستینه به روز نیست",
  112: "فضای کافی وجود ندارد",
  113: "دانلود ناموفق",
  114: "خطای 114: لطفا با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  115: "در حال دانلود",
  116: "دانلود کامل شد",
  117: "فرآیند نصب اجرا شد",
  118: "فایل وجود ندارد",
  119: "در حال چک کردن ورژن",
  120: "خطای 120: لطفا صفحه را یکبار رفرش نموده و مجددا عملیات را انجام دهید. در صورت عدم رفع خطا، با مرکز پشتیبانی تماس بگیرید.  124 داخلی 2.",
  200: "E_NID_NOT_SUPPORT",
  201: "E_NID_VERSION_NOT_SUPPORT",
  202: "E_NID_LOAD_DLL_ERROR",
  203: "E_NID_LOAD_FUNCTION_ERROR",
  204: "E_NID_INITIALIZE_ERROR",
  205: "E_NID_GET_FINGER_INDEX_ERROR",
  206: "E_NID_DS_SERVER_ACCESS_ERROR",
  207: "E_NID_GET_SIGNER_CER_ERROR",
  208: "E_NID_AUTHENTICATE_ERROR",
  209: "E_NID_SIGN_ERROR",
  210: "E_NID_UNBLOCK_PIN_ERROR",
  211: "E_NID_SIGN_SERVER_NOT_AVAILABLE",
  220: "E_PROVIDER_NAME_NOT_FOUND",
  221: "E_WRONG_EXTENSION",
  222: "E_SET_PIN_GUIDE_ERROR",
};
