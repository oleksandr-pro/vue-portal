export const filterUneditableHeaders = (uneditableHeaders, headers) => headers.filter(i => {
  return !uneditableHeaders.find(el => el ===i.name)})

export const filterUnEditableFields = (unEditableFields, data,isHeadings) => {
  return  isHeadings ?
    filterUneditableHeaders(unEditableFields, data)
    : data.map(datum => {
        const newFeild = {}
        for (const key in datum) {
          if (unEditableFields.find(i => i !== key)) {
            newFeild[key] = datum[key]
          }

        }
        return newFeild
      }
    );
}
