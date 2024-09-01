import moment from "jalali-moment";

const convertJalaliDateToGregorian = (date) => {
  if (date) {
    const temp = moment
      .from(`${date?.year}/${date?.month}/${date?.day}`, "fa", "YYYY/MM/DD")
      .format("YYYY/MM/DD");
    return temp;
  } else {
    return undefined;
  }
};

export default convertJalaliDateToGregorian;
