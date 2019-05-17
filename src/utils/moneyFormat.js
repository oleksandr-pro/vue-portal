export const moneyFormat = (val) => {
  if (!val || parseInt(val) === 0) {
    return '0.00'
  }
  val = val.toFixed(2)
  val = parseFloat(val)
  val = val.toLocaleString()
  val = val.lastIndexOf('.') === -1 ? `${val}.00` : val
  return val
}

export const moneyFormatAppendCurrency = (val, currency = '', alignRight = true) => {
  const amount = moneyFormat(val)
  let temp = currency === '' ? amount : `${amount} ${currency}`
  if (alignRight) {
    temp = amountFormatAlignRight(temp)
  }
  return temp
}

export const amountFormatAlignRight = (val) => {
  return `<div style='width: 100%; text-align: right;'>${val}</div>`
}