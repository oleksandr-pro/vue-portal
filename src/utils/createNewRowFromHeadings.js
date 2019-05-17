const createNewRowFromHeadings = (tableHeadings, id) => ({
  ...tableHeadings.reduce((acc, {name, input, $domAttri, multiVal, selectKeys}) => (
    {
      ...acc,
      [name]:
        multiVal ? ['']
          : input === 'multiple' ?
          []
          : $domAttri ? $domAttri.type === 'number' ? '' : ''
            : ''
    }
  ), {}), id
})
export default createNewRowFromHeadings;
