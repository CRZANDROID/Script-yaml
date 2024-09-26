const fs = require('fs');
const yaml = require('js-yaml');
const { dialog } = require('@electron/remote');
const Decimal = require('decimal.js'); 

document.getElementById('selectFileButton').addEventListener('click', selectAndReadYAML);

function selectAndReadYAML() {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'YAML', extensions: ['yaml', 'yml'] }
    ]
  }).then(result => {
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContents);

      if (data.Comprobante && data.Comprobante.Conceptos) {
        const totalDescuento = calcularTotalDescuento(data.Comprobante.Conceptos);
        document.getElementById('output').innerText = `El total de descuentos es: ${totalDescuento.toFixed(2)}`;
      } else {
        document.getElementById('output').innerText = 'No se encontró el nodo "Conceptos" en el archivo YAML.';
      }
    }
  }).catch(err => {
    console.error('Error al seleccionar o leer el archivo:', err);
    document.getElementById('output').innerText = 'Error al seleccionar o leer el archivo.';
  });
}

function calcularTotalDescuento(conceptos) {
  let totalDescuento = new Decimal(0); 
  
  conceptos.forEach(concepto => {
    if (concepto.Descuento) {
      totalDescuento = totalDescuento.plus(new Decimal(concepto.Descuento)); 
    }
  });
  
  return totalDescuento; 
}
