export const formatNumber = (value, digits = 0, format = {}) => {
  // if(typeof value !== 'number') value = parseInt(value);
  if (typeof value === 'number') {
    return new Intl.NumberFormat([], {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      ...format,
    }).format(value)
  }
  return value
}
