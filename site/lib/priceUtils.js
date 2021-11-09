const priceFormat = price => {
  return 'R$ ' + price.toFixed(2).replace('.', ',')
}
export { priceFormat }
