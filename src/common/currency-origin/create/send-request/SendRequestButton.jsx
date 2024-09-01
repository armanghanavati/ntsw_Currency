import { Button } from "../../../../components";
import themeColors from "../../../../configs/theme";

const SendRequestButton = ({ sendRequest }) => {
  const handleSendRequest = (event) => {
    event?.preventDefault();
    sendRequest({});
  };
  return (
    <Button
      onClick={handleSendRequest}
      backgroundColor={themeColors.btn.secondary}
    >
      <i class="fa fa-check" aria-hidden="true"></i>
      ارسال درخواست
    </Button>
  );
};

export default SendRequestButton;
