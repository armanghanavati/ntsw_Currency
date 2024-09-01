import { endpoints } from "../../../../services/endpoints";
import { Button } from "../../../../components";
import themeColors from "../../../../configs/theme";

const ShowTrackingCode = ({
  callBackUrl,
  title,
  requestCode,
  pcoVcodeInt,
  type,
  width,
}) => {
  const handleRedirect = () => {
    let url = `${
      endpoints.ExternalLink.TrackingInterceptionCode
    }?pcoVcodeInt=${btoa(pcoVcodeInt)}&requestCode=${btoa(
      requestCode
    )}&callBackUrl=${btoa(callBackUrl)}`;
    window.location.href = url;
  };

  return (
    <Button
      type={type}
      onClick={handleRedirect}
      backgroundColor={themeColors.btn.secondary}
      width={width}
    >
      <i class="fa fa-barcode" aria-hidden="true"></i>
      {title}
    </Button>
  );
};

export default ShowTrackingCode;
