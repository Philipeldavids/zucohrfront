export const getCurrency = () => {
  return localStorage.getItem("orgCurrency") || "NGN";
};

export const getCurrencySymbol = () => {
  return localStorage.getItem("orgCurrencySymbol") || "₦";
};

export const formatMoney = (amount: number) => {
  const currency = getCurrency();

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};