const InfoBox = ({
  currencyConvertError,
  convertCurrencyAmount = "",
  currencyTypeTitle = "",
}) => {
  return (
    <div className="info-box text-small">
      <i class="fa fa-info" aria-hidden="true"></i>
      {!!currencyConvertError ? (
        currencyConvertError
      ) : (
        <>
          <span className="text-small--bold"> توجه! </span>
          معادل
          <span className="text-small--bold">{convertCurrencyAmount}</span>
          {currencyTypeTitle}
        </>
      )}
    </div>
  );
};
export default InfoBox;
