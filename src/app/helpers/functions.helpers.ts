import moment from "moment";

// Cofniecie
export const goBack = () => {
  window.history.back();
};

// Sformatowanie i ujednolicenie daty wyświetlanej w tabeli
export const formatDate = (date: string) => {
  return moment.utc(date).format('DD-MM-YYYY HH:mm:ss');
};
