import React from 'react';
import {StyleSheet, Text, View, Image, PanResponder, Dimensions, Animated, Button, ColorPropType, TouchableNativeFeedback} from 'react-native';
import Svg, {Rect,Circle,Path, ClipPath, G, Defs, Mask} from 'react-native-svg';
import { connect } from 'react-redux'

//Calcule le centre de 2 points
function computeCentrer(vector0,vector1){
  return [(vector0[0]+vector1[0])/2,(vector0[1]+vector1[1])/2]
}

/*Calcule les coordonnées d'un vecteur v ayant subis une rotation de theta (sens trigonométrique) Utilise matrice de rotation*/
function computeVectorRotation(v,theta){
  let cos = Math.cos(theta*Math.PI/180)
  let sin = Math.sin(theta*Math.PI/180)
  return [cos*v[0] - sin*v[1] , sin*v[0] + cos*v[1]]
}

//Calcule la distance entre 2 points
function computeDistance(vector0,vector1){
  return Math.sqrt(Math.pow((vector0[0]-vector1[0]),2) + Math.pow((vector0[1]-vector1[1]),2))
}

/*@require : Les deux vecteurs (de longeur 2) 
@ensure : Calcule le produit scalaire de deux vecteurs */
function computeAngleBtwVectors(v0,v1){
  let cos = (computePS(v0,v1))/(computeNorme(v0)*computeNorme(v1))
  if(cos-1<0.0001 && cos-1>0){
    cos=1
  }
  sign = computeAngleBtwVectors_aux(v0,v1)
  return sign * 180/Math.PI * Math.acos(cos)
}

/*Fct auxillière de computeAngleBtwVectors, determine si l'angle doit etre >0 ou <0 (basé sur n le vecteur normal a v0 tq (v0,n,vecteur sortant de l'écran) forme un trièdre direct
v1.n >0 => angle >0 et v1.n<0 => angle<0 */
function computeAngleBtwVectors_aux(v0,v1){
  n = [v0[1],-v0[0]] //Faire un schéma
  res = computePS(n,v1)
  return res>0 ? -1:1
}

/*Calcule le produit scalaire de deux vecteurs */
function computePS(v0,v1){
  return v0[0]*v1[0] + v0[1]*v1[1]
}

/*Regarde la norme de la différence des deux vecteur, renvoi true si elle est < epsilon*/
function areArrayClose(v0,v1,epsilon){
  if(computeNorme([v0[0]-v1[0],v0[1]-v1[1]]) < epsilon){
    return true
  }
  console.log("in areArrayClose: diff trop grande:",computeNorme([v0[0]-v1[0],v0[1]-v1[1]]))
  return false
}

function computeNorme(v){
  if(v.length !=2){
    console.log("v pas de longeur 2")
    return
  }
  return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2))
}

function clamp(x,min,max){
  return x <= min 
    ? min 
    : x >= max 
      ? max 
      : x
}

class Canvas extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      //Position absolue du rectangle (offSet et nb_touches ne sont pas dans le state car leur changement ne devrais pas entraîner un rerender)
      position:[0,0],
      rotation:0,
      scale:1,
    }

    this.last_scale = this.state.scale
    this.last_rotation = this.state.rotation

    
    this.panResponder = PanResponder.create({
      //Detection de doigt toujours active (car return true)
      onStartShouldSetPanResponder: (evt) => true,

      //Appelé a chaque frame où le panResponder est actif (cad quand touche zone affectée et onStartShouldSetPanResponder renvoie true)
      onPanResponderMove: (evt) => {
        let touches = evt.nativeEvent.touches

        //Détermine si la touche est nouvelle (pour rajouter un trait au layersData)
        let newTouche = false 

        //En cas de changement de nombres de doigt (cas 1->2 ou 2->1)
        if(touches.length !== this.nb_touches){
          this._onNbToucheChange(touches)
          newTouche = true
          // console.log("newT true")
        }

        //Cas 1 doigt
        if(touches.length==1){
          let localisation_touche = this.absoluteToLocalisation([[touches[0].pageX, touches[0].pageY]])[0]

          let MorL = newTouche ? " M" : " L" //M si nouvelle touche, L sinon (pour path de svg)
          if(this.props.selectedLayer > this.props.layersData.length) {console.warn("Selected layer does not exist")}

          /*Modification du state se fait ici: on modifie uniquement la layer sélectionnée en utilisant map et indexLayer==this.selectedLayer
          Si le pen est utilisé on modifie que le dernier element de data
          On modifie ou ajoute une stoke à data.strokes en fonction de si les options utilisée sont déjà présente (via _doesStrokeAlreadyExist)
          Utilise bcp syntaxe des "?" : "var = bool ? x : y" => var=x si bool=true et var=y sinon*/
          newLayerData = this.props.layersData.map((layer,indexLayer)=>{
            if(this.props.selectedTool =="pen"){
              localisation_touche=[localisation_touche[0]-this.lastPositionOfSelectedLayer.x, localisation_touche[1]-this.lastPositionOfSelectedLayer.y]
              colorIndex = this._doesStrokeAlreadyExist(indexLayer,this.props.selectedColor, this.props.selectedStrokeWidth, this.props.selectedOpacity)

              return(indexLayer === this.props.selectedLayer ? 
                ({...layer,
                  data: this.props.changeIsPenAfterEraser(indexLayer) ?  //Regarde si doit creer nouvel element ou continuer sur l'ancien 
                    /*Creer nouvel elem*/
                    [...data, {
                      strokes:[{color:this.props.selectedColor, width:this.props.selectedStrokeWidth, opacity: this.props.selectedOpacity, path:"M" + localisation_touche.toString() }],
                      eraserData:[{width:this.props.selectedEraserWidth, path:""}]
                    }]

                    /*Continue sur l'ancien*/
                    : (data.map((elem,indexElem) => {
                      return(
                          (indexElem==layer.data.length -1 ? //On ne modifie que le dernier elem de data
                            {...elem, 
                            strokes: colorIndex == -1 || strokes.length == 0 ? //Ajoute stroke que si pas déjà présente ou strokes vide, colorIndex === -1<=> Stroke existe pas donc crée, int i >=0 <=> modifie la stroke i qui corresond
                              [...strokes,{color:this.props.selectedColor, width: this.props.selectedStrokeWidth, opacity: this.props.selectedOpacity, path:"M"+localisation_touche.toString()}]
                              : strokes.map((stroke, strokeIndex) => {
                                return(
                                  strokeIndex === colorIndex ? {...stroke, path: stroke.path + MorL + localisation_touche.toString()}
                                    : stroke     
                                )
                                })
                            }

                            : elem)

                      )
                    }))
                })

                :layer 
              )
            }

            else if(this.props.selectedTool == "eraser"){
              // console.log("eraserIndex:",eraserIndex)
              localisation_touche=[localisation_touche[0]-this.lastPositionOfSelectedLayer.x, localisation_touche[1]-this.lastPositionOfSelectedLayer.y]

              return(indexLayer == this.props.selectedLayer ?
                ({...layer,
                  data: data.map((elem,indexElem) => {
                    eraserIndex = this._doesEraserStrokeAlreadyExist(indexLayer,indexElem,this.props.selectedEraserWidth)
                    return(
                      {...elem,
                        eraserData: eraserIndex == -1 ? 
                          [...eraserData, {width:this.props.selectedEraserWidth, path:"M"+ localisation_touche.toString()}]
                          : eraserData.map((eraser,indexEraser) => {
                            return(
                              indexEraser == eraserIndex ? 
                                {...eraser, path: eraser.path + MorL + localisation_touche.toString()}
                                : eraser
                            )
                          })
                      }
                    )
                  })
                })
                : layer
              )
            }

            else if(this.props.selectedTool == "move"){
              //Calcul du x et du y nécéssaire dans layer.position selon les inputs
              let positionLayer ={x: localisation_touche[0] + this.lastPositionOfSelectedLayer.x - this.firstTouch[0][0]*this.canvasHeight*this.state.scale, 
                            y: localisation_touche[1] + this.lastPositionOfSelectedLayer.y  - this.firstTouch[0][1]*this.canvasWidth*this.state.scale} 

              return(indexLayer==this.props.selectedLayer ?
                ({...layer,
                  position: positionLayer})
                : layer
              )
            }
          })

          this._updateState(newLayerData)    
        }   

        //Cas 2 doigts
        if(touches.length>1){
          let centre_doigts= [(touches[0].pageX + touches[1].pageX)/2, (touches[0].pageY + touches[1].pageY)/2] //Centre des doigts actuels
          let first_centre_doigts = computeCentrer(this.firstTouch[0],this.firstTouch[1]) //Centre des premiers touch
          let rotated_vector = computeVectorRotation(
            [(first_centre_doigts[0] - 0.5)*this.canvasWidth*this.state.scale,
            (first_centre_doigts[1] - 0.5)*this.canvasHeight*this.state.scale], this.state.rotation)
          let distance_between_fingers = Math.sqrt( Math.pow((touches[0].pageX-touches[1].pageX),2) + Math.pow((touches[0].pageY-touches[1].pageY),2) ) //computeDistance marche pas avec les touches (pas de [0] mais .pageX) 
          let vector_between_fingers = [(touches[1].pageX - touches[0].pageX)/distance_between_fingers,
                                        (touches[1].pageY - touches[0].pageY)/distance_between_fingers]  
          let angle = computeAngleBtwVectors(this.first_vector_between_fingers,vector_between_fingers)
          // console.log("Actuel/First: ",distance_between_fingers, this.distance_between_first_fingers)
          // console.log("Expected scale: ", distance_between_fingers/this.distance_between_first_fingers)

          this.setState({
            position: [centre_doigts[0] - this.screenWidth/2 - rotated_vector[0], 
                      centre_doigts[1] - this.screenHeight/2 - rotated_vector[1]],  
            //Analogue à 1 doigt (les centres remplacent les touches)
            // scale: clamp(this.last_scale * (distance_between_fingers/this.distance_between_first_fingers),0.3,2),

            rotation: this.last_rotation + angle
          })
        }

        this.lastTouchAbsolute = this._getLastTouch(touches)
      },

      //Quand l'utilisateur relache tous les doigts
      onPanResponderRelease:(evt, gestureState) =>{
        this.nb_touches = 0 
        this.lastPositionOfSelectedLayer = this.props.layersData[this.props.selectedLayer].position
      }
    })
  }

  //Nombre de doigts sur l'écran
  nb_touches=0

  /*Tableau contenant les coord des premiers doigts sur l'écran relativement au canvas(n doigts -> n elem)
  Enregistré en proportion de canvas (millieu: 0.5,0.5, bas droite: 1,1) (Car scale change donc 20,20 pas correct)
  Remultiplie par la taille du canvas(donc par this.state.scale*canvasHeight/Width) pour reutiliser ces valeurs*/
  firstTouch=[]

  /*Vecteur unitaire basé sur firstTouch, vas du 1er doigt vers le 2eme*/
  first_vector_between_fingers=[]

  //Tableau contenant les coord absolues des dernières touches (pour détecter quel doigt a été enlevé car l'ordre n'as pas de sens)(n doigts -> n elem)
  lastTouchAbsolute=[]

  //Capture la position du layer quand relache doigt (utile pour move, sinon tp du calque au centre)
  lastPositionOfSelectedLayer={x:0,y:0}

  //Distance entre les doigts lors de la première touche à 2 doigts (valeur est constance, pas a recalculer a chaque fois)
  distance_between_first_fingers = 0 

  //Dernier scale enregistré (Utile car si scale = 2, on pose 2 doigts alors distance_between_fingers = this.distance_between_first_fingers et donc scale devient 1)
  last_scale = 1

  //Derniere rotation enregistré (même raison que pour scale)
  last_rotation = 0

  //Taille du canvas
  canvasHeight = this.props.canvasHeight
  canvasWidth = this.props.canvasWidth

  //Taille de l'écran 
  screenHeight = Dimensions.get("window").height
  screenWidth = Dimensions.get("window").width

  _updateState(nextState) {
    const action = { type: "UPDATE_STATE", value: nextState}
    this.props.dispatch(action)
  }

  /*Appelée par onPanResponderMove dans le cas ou le nombre de doigt change
  @assign this.nb_touches, this.offSet
  @ensure met à jour le nombre de touches et le centre des doigts*/
  _onNbToucheChange(touches){

    //Cas 0->1 doigt
    if(this.nb_touches == 0 && touches.length == 1){
      relative_touches = this.absoluteToRelative([[touches[0].pageX, touches[0].pageY]])
      this.firstTouch = relative_touches
    }

    //Cas 2->1 doigt
    if(this.nb_touches == 2 && touches.length == 1){
      // console.log("2->1")
      relative_touches = this.absoluteToRelative([[touches[0].pageX, touches[0].pageY]])

      //Pour contourner bug ou 2eme doigt en dehors de canvas et relache premier
      are_fingers_on_canvas_info = this._areFingersOnCanvas()
      if(!are_fingers_on_canvas_info){ //Si l'un des 2 doigts n'est pas sur le canvas 
        relative_last_touches = this.absoluteToRelative(this.lastTouchAbsolute)
        // console.log("relative_touches",relative_touches)
        // console.log("relative_last_touches",relative_last_touches)
        if(areArrayClose(relative_touches[0],relative_last_touches[0], 0.05)){
          // console.log("Got 0 close")
          this.firstTouch = [relative_last_touches[0]]
        }

        else{
          // console.log("Got 1 close")
          this.firstTouch = [relative_last_touches[1]]
        }
      }

      else{
        // console.log("aucun finger hors canvas")
        this.firstTouch = relative_touches
      }
      this.last_scale = this.state.scale
      this.last_rotation = this.state.rotation
    }

    //Cas 1->2 doigts
    if(this.nb_touches == 1 && touches.length == 2){
      // console.log("1->2")
      relative_touches = this.absoluteToRelative([[touches[0].pageX, touches[0].pageY],[touches[1].pageX, touches[1].pageY]])

      //Pour résoudre soucis où le 1er doigt passe en 2eme (donc tp du canvas)
      if(areArrayClose(this.firstTouch[0], relative_touches[1], 0.01)){
        // console.log("near")
        this.firstTouch = [relative_touches[1],relative_touches[0]]
      }
      else{
        // console.log("not near")
        this.firstTouch = [relative_touches[0],relative_touches[1]]
      }
      this.distance_between_first_fingers = computeDistance([this.firstTouch[0][0]*this.canvasWidth*this.state.scale,this.firstTouch[0][1]*this.canvasHeight*this.state.scale],[this.firstTouch[1][0]*this.canvasWidth*this.state.scale, this.firstTouch[1][1]*this.canvasHeight*this.state.scale]) //Cf définition de firstTouch 
      this.first_vector_between_fingers = [(touches[1].pageX - touches[0].pageX)/this.distance_between_first_fingers,
                                          (touches[1].pageY - touches[0].pageY)/this.distance_between_first_fingers]  
    }

    //Cas 0->2 doigts (rare)
    if(this.nb_touches == 0 && touches.length == 2){
      relative_touches = this.absoluteToRelative([[touches[0].pageX, touches[0].pageY],[touches[1].pageX, touches[1].pageY]])
      this.firstTouch = relative_touches
      this.distance_between_first_fingers = computeDistance([this.firstTouch[0][0]*this.canvasWidth*this.state.scale,this.firstTouch[0][1]*this.canvasHeight*this.state.scale],[this.firstTouch[1][0]*this.canvasWidth*this.state.scale, this.firstTouch[1][1]*this.canvasHeight*this.state.scale]) //Cf définition de firstTouch 
      this.first_vector_between_fingers = [(this.firstTouch[1][0] - this.firstTouch[0][0])*this.canvasWidth*this.state.scale/this.distance_between_first_fingers,
                          (this.firstTouch[1][1] - this.firstTouch[0][1])*this.canvasHeight*this.state.scale/this.distance_between_first_fingers]
      console.log("0->2 (rare)")
    }

    console.log("firstTouch:",this.firstTouch)
    this.nb_touches = touches.length
  }

  _getLastTouch(touches){
    res= []
    for (let i=0; i<touches.length; i+=1){
      res.push([touches[i].pageX,touches[i].pageY])
    }
    return res
  }

  /*Retourne [true,...] si l'un des 2 doigts est hors du canvas et [true, <0 ou 1>] si c'est le 1er au 2eme doigt*/ 
  _areFingersOnCanvas(){
    let is_first_finger_on_canvas = this.firstTouch[0][0]<1 && this.firstTouch[0][1]<1 && this.firstTouch[0][0]>0 && this.firstTouch[0][1]>0
    let is_second_finger_on_canvas = this.firstTouch[1][0]<1 && this.firstTouch[1][1]<1 && this.firstTouch[1][0]>0 && this.firstTouch[1][1]>0
    return is_first_finger_on_canvas && is_second_finger_on_canvas
  }

  /*Utilisée dans _onNbToucheChange, cas 2->1 permet de savoir quel doigt a été laché (Pour garder la bonne valeur pour firstTouch)*/
  _whichFingerStayOnScreen(){
    this.lastTouchAbsolute
  } 

  /*Convertie des touches absolues en coordonées compatibales avec localisation<X ou Y>*/
  absoluteToLocalisation(touches){
    res=[]
    for (let i = 0; i<touches.length; i+=1){
      rotated_vector = computeVectorRotation(
        [touches[i][0] - this.screenWidth/2 - this.state.position[0],
         touches[i][1] - this.screenHeight/2 - this.state.position[1]], -this.state.rotation)  // - : cf schéma

      res.push([rotated_vector[0] + this.canvasWidth*this.state.scale/2, 
                rotated_vector[1] + this.canvasHeight*this.state.scale/2]) 
    }
    return res
  }

  /*Converti coordonnées absolue en relatives (faire un schéma pour voir le rotate)*/
  absoluteToRelative(touches){
    res=[]
    for (let i = 0; i<touches.length; i+=1){
      rotated_vector = computeVectorRotation(
        [touches[i][0] - this.screenWidth/2 - this.state.position[0],
         touches[i][1] - this.screenHeight/2 - this.state.position[1]], -this.state.rotation)  // - : cf schéma

      res.push([(rotated_vector[0] + this.canvasWidth*this.state.scale/2) / (this.canvasWidth*this.state.scale), 
                (rotated_vector[1] + this.canvasHeight*this.state.scale/2) / (this.canvasHeight*this.state.scale)]) 
    }
    return res
  }

  //Converti coordonnées relatives en coordonnées compatible avec les .localisation<X ou Y>
  relativeToLocalisation(firstTouch){
    res=[]
    for (let i = 0; i<firstTouch.length; i+=1){
      res.push([firstTouch[i][0]*this.canvasWidth*this.state.scale,firstTouch[i][1]*this.canvasWidth*this.state.scale])
    }
    return res
  }

/*Renvoi l'index de la stroke contenant la couleur si elle existe, -1 si elle n'existe pas */
_doesStrokeAlreadyExist(layerNumber, color, strokeWidth, opacity){
  data = this.props.layersData[layerNumber].data
  strokes = data[data.length -1].strokes
  for(let i=0; i<strokes.length; i++){
    if(strokes[i].color == color && strokes[i].width == strokeWidth && strokes[i].opacity == opacity){
      return i
    }
  }
  return -1
}

/*Renvoi l'index de la stroke de gomme contenant la largeur de gomme selectionée, si elle existe, et -1 si elle n'existe pas */
_doesEraserStrokeAlreadyExist(layerNumber,elemNumber, eraserWidth){
  eraserData = this.props.layersData[layerNumber].data[elemNumber].eraserData
  for(let i=0; i<eraserData.length; i++){
    if(eraserData[i].width == eraserWidth){
      return i
    }
  }
  return -1
}

/*Affiche les données stockées dans layersData
Utilise .map qui permet de boucler sur des élements d'une array pour retourner des balises customisée 
Map sur les layers pour retourner un SVG, puis sur les elements d'une layer (cf def de layersData pour comprendre elements) pour retourner un groupe contenant les paths et le mask, 
puis sur les traits de l'élement pour retourner les path*/
  _displayLayers(){
    // console.log("render")
    return(
      this.props.layersData.map((layer,indexLayer) => {
        // if(index==2){console.log(JSON.stringify(layer.data))}
        // console.log("position:",layer.position)
        // console.log(layer)
        return(
          <Svg style={styles.svg} key={indexLayer} x={layer.position.x} y={layer.position.y}>

            {layer.data.map((elem,index) => {
              // if(indexLayer==2){console.log("elem strokes:",elem.strokes)}
              return(
                <G key={index}>
                  {elem.strokes.map(stroke => {
                    // console.log("stroke:",stroke)
                    return (
                      <Path
                      key={stroke.color +"w"+ stroke.width.toString() +"o"+ stroke.opacity.toString()}
                      d={stroke.path}
                      stroke={stroke.color}
                      strokeWidth={stroke.width}
                      strokeLinecap="round"
                      opacity={stroke.opacity}
                      x={layer.position.x}
                      y={layer.position.y}
                      rotation={layer.rotation}
                      mask={"url(#mask"+index.toString()+")"}
                      />
                    )})}
                  <Defs>
                    <Mask id={"mask"+index.toString()}>
                      <Rect
                        width="100%"
                        height="100%" 
                        fill="white"/>
                      {elem.eraserData.map(eraser => {
                        return(
                          <Path 
                          key={eraser.width}
                          d={eraser.path}
                          strokeWidth={eraser.width}
                          strokeLinecap="round"
                          stroke="black"/>
                        )
                      })}
                    </Mask>
                  </Defs>
                </G>
              )
            })}

          </Svg>
        )
      })
    );
  }

  render(){
    let newStyleCanvas = {
      height:this.canvasHeight*this.state.scale, 
      width:this.canvasWidth*this.state.scale,  
      left: this.state.position[0], 
      top: this.state.position[1], 
      transform:[{rotate:this.state.rotation.toString()+"deg"}]
    }

    return(
        <View
        style={[styles.canvas,newStyleCanvas]}
        {...this.panResponder.panHandlers}>
          {this._displayLayers()}
        </View>

    )
  }
}

const styles = StyleSheet.create({
  canvas: {
    height:200,
    width:200,
    top:0,
    left:0,
    backgroundColor: 'white'
  },

  svg:{
    position:"absolute",
    top:0,
    left:0,
    flex:1,
  },
})

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

const mapStateToProps = (state) => {
  return {layersData: state}
}

export default connect(mapStateToProps,mapDispatchToProps)(Canvas)