import moment from "moment";

const formatDateTime = (date, format = "DD MMM YYYY, hh:mm A") => {
  if (!date) return "N/A";
  return moment(date).format(format);
};

export { formatDateTime };
