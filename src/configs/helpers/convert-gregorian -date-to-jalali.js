import moment from "jalali-moment";

const convertGregorianDateToJalali = (date) => {
  if (date) {
    return moment.from(date).format("jYYYY/jMM/jDD");
  } else {
    return undefined;
  }
};

export default convertGregorianDateToJalali;
