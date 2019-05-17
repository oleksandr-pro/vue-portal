export const decimals = (decimalscount) => (value) => {
  console.log(value);
  if (isNaN(value) || value === null) return  '---'
  const splitedVal = (value + '').split('.');
  if (splitedVal.length > 1) {
    value = parseFloat(splitedVal[0] + '.' + splitedVal[1])
  }

  return isNaN(value) || value === '' ? value : (parseFloat(value)).toFixed(decimalscount);
}

export const formatedMoney = (decimals = 2, currency = 'EUR') => (value) => +value === 0 ? 0 : `${value.toFixed(decimals)} ${currency}`
