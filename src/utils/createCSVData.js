export const handleEmptyVal = (val) => val === '' || val === null ? '---' : val
const createCSVData = (headings, data) => {
  let csv = '';
  const CSVheadings = headings.reduce((acc, {name}, index, {length}) =>
      index === 0 ?
        acc + name
        : index === length - 1 ?
        acc + name + '\r\n'
        : acc + ',' + name
    , '')
  const CSVbody = data.reduce((acc, i) => {
      headings.forEach(({name}, index, {length}) => {
        acc = index === 0 ?
          acc + handleEmptyVal(i[name])
          : index === length - 1 ?
            acc + handleEmptyVal(i[name]) + '\r\n'
            : acc + ',' + handleEmptyVal(i[name])
      });
      return acc;
    }
    , '')

  return "data:text/csv;charset=utf-8," + CSVheadings + CSVbody;
}
export default createCSVData
export const fileDownlaodFromEncodedURI = (encodedUri, fileName) => {

  const termLink = window.document.createElement('a');
  termLink.setAttribute("href", encodedUri);
  termLink.setAttribute("download", fileName + ".csv");
  termLink.style.width = 1 + 'px';
  termLink.style.height = 1 + 'px';
  window.document.body.appendChild(termLink);
  termLink.click()
  termLink.remove();
}

export function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
