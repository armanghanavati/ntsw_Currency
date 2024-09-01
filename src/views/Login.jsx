import { useHistory } from "react-router-dom";
import { Button, MessageModal } from "../components";
import { useDispatch } from "react-redux";
import {
  getGUID,
  getAlternativeToken,
} from "../state/action-creators/index.js";

const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const login = (event) => {
    event?.preventDefault();
    dispatch(getGUID(-1));
    dispatch(getAlternativeToken("CF7A2630-4533-4E63-AFFC-87305CA7CF92"));
    // "bcd1fd9b-9c24-48d7-ba64-7003a244b796"
    // کوله بر
    // cd7c5951-40dc-457d-a07e-53c2f25a62cf
    // پیله ور
    // 4147820a-2689-4d33-9fd8-cacdb98ad3dd
    // کوله بر عملیاتی
    // 80eeae4d-de5c-4031-82c1-0decfa6cc681
    // مرزنشین عملیاتی
    // d490ed7d-58bf-418d-bcfb-ff7580047c28
    //  بازرگان حقیقی عملیاتی
    // 9f00f03e-cdbd-4a51-b0c8-6243fb58311f
    // پیله ور عملیاتی
    // 9e37f3f6-e8b4-4dea-b67a-3cd22996ae3f
    // ملوان عملیاتی
    // 8ba20554-e3a3-4dc2-87e5-fb30be4a2587
    setTimeout(() => {
      history.push("/Users/AC/Currency/OriginOfBankCurrency");
    }, 500);
  };

  return (
    <>
      <MessageModal />
      <div className="login-page">
        <form>
          <div className="login-btn">
            <Button variant="contained" onClick={login} width="200px">
              ورود
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
