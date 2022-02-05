//But:  recuperer le .ap de ./Raw et le transformer pour avoir le .js de ./JS
// Data/ApExtractor.js
import RNFS from 'react-native-fs'

export function writePAOnDevice(PaFileName){
  project = {
    creation_date: '2021-06-02',
    last_edition_date: '2021-06-04',
    creator: 'Delta',
    dimensions: [10,10],
    nb_layers: 3, 
    layers: [
      [[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255]],
      [[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255]],
      [[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255]]
    ]
  }

  RNFS.writeFile(RNFS.DocumentDirectoryPath+"/"+PaFileName,JSON.stringify(project))
}

export function paExtractor(ApFileName){
  promise = RNFS.readFile(RNFS.DocumentDirectoryPath+"/"+ApFileName)
  .then((result) => {
    return JSON.parse(result)
  })
  .catch((err) => {
    console.log(err.message, err.code)
  })
  return promise 
}