/*Contient toute la data sur le dessin
      Structure de layersData: 
        -Un élement de layerDate = une layer
        -Chaque layer à son id, sa position et sa rotation (pour les déplacer individuellement) et sa data
      Structure de data:
        -Compliquée pour résoudre le problème de la gomme. 
        Explication: on veut pouvoir :
          1. Tracer un trait
          2. Gommer le trait
          3. Desinner par dessus la zone gommer
        Le tout en utilisant les Mask fournis par SVG. Si on applique le mask de la gomme a tous les traits de la layer on ne peut pas dessiner par dessus la zone gommée.
        Il faut donc séparer les différents traits affecté par les différents coups de gomme.
        Cette structure répond à cela: un élement de data= un ensemble de trait affecté par un coup de gomme
      Structure de data:
        -Un ensemble de traits (strokes), un ensemble car doit séparer les traits avec des caractéristiques différentes (width, opacity, color)
        -Un trait de gomme (eraserData)
        
      Exemple de layersData non vide:*/
      // layersData:[
      // {
      //   position:{x:0,y:0},
      //   rotation:0,
      //   data:[{strokes:[{color:"pink", width:"2", opacity:"1", path:"M0 0 L200 200"}], eraserData:[{width:"30",path:""}]},], 
      // },
      // {
      //   position:{x:0,y:0},
      //   rotation:0,
      //   data:[{strokes:[{color:"green", width:"6", opacity:"1", path:"M0 0 L200 200"}], eraserData:[{width:"30",path:"M200 0 L0 200"}]}], 
      // },
      // {
      //   position:{x:0,y:0},
      //   rotation:0,
      //   data:[{strokes:[{color:"black", width:"10", opacity:"1", path:"M0 0 L200 200"}], eraserData:[{width:"50",path:"M200 0 L0 200"}]}], 
      // }]
      
      // layersData:[{
      //   position:{x:0,y:0},
      //   rotation:0,
      //   data:[{strokes:[{color:"pink", width:"5", opacity:"1", path:"M0 0 L200 200"}], eraserData:[{width:"10",path:"M200 0 L0 200"}]},
      //         {strokes:[{color:"black",width:"1", opacity:"1", path:"M0 0 L200 200"}], eraserData:[{width:"50",path:"M0 0 L0 200"}]}]
      // }]

const initialLayersData = [{
  position:{x:0,y:0},
  rotation:0,
  data:[{strokes:[{color:"black", width:"1", opacity:"1", path:""}], eraserData:[{width:"10",path:""}]}]
}]

function updateState(state = initialLayersData, action) {
  let nextState

  switch (action.type) {
    case 'UPDATE_STATE':
      nextState = action.value
      return nextState || state
    
    case 'ADD_LAYER':
      let part1 = state.map((layer,indexLayer) => {
        if (indexLayer<=action.value) {
          return(layer)
        }
      })

      let part2 = state.map((layer,indexLayer) => {
        if (indexLayer>action.value) {
          return(layer)
        }
      })

      if(part1[0]==undefined){
        nextState= [
          {position:{x:0,y:0},
          rotation:0,
          data:[{strokes:[{color:"black", width:"1", opacity:"1", path:""}], eraserData:[{width:"10",path:""}]}]
          }
          ,...part2]        
      }

      else if(part2[0]==undefined){
        nextState= [...part1,
          {position:{x:0,y:0},
          rotation:0,
          data:[{strokes:[{color:"black", width:"1", opacity:"1", path:""}], eraserData:[{width:"10",path:""}]}]
          }]        
      }
      
      else {
        nextState= [...part1,
          {position:{x:0,y:0},
          rotation:0,
          data:[{strokes:[{color:"black", width:"1", opacity:"1", path:""}], eraserData:[{width:"10",path:""}]}]
          }
          ,...part2]
      }

      return nextState || state
  
    default:
      return state
  }
}

export default updateState