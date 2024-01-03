export const formatNumber = (value: any, digits = 3, format = {}) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat([], {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      ...format,
    }).format(value);
  }
  return value;
};
