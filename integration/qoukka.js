const toDecimals = (number) => {
  const decimals = number.toString().split('.')[1]
  // has decimals ?
  if(decimals){
   // has two decimals ?
    if(decimals.length == 2 )
  }
  const [_number, _decimals] = number.toFixed(2).toString().split('.')
  return {
    number:_number,
    decimals:_decimals
  }
}
console.log(toDecimals(23.1));
