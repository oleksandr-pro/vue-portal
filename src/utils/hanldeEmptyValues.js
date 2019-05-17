export const handleEmptyValues = (body) => {
  return Object.keys(body).reduce((acc, key) => ({
    ...acc,
    [key]: body[key] === '' || body[key] === null || (typeof body[key] === 'string' ? body[key].toLowerCase() === 'all' : false) ? null : body[key]
  }), {})
}
