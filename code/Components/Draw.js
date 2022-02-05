import React from 'react';
import { View,StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Touchable} from 'react-native';
import Canvas from "./Canvas"
import Svg, {Circle} from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { ColorPicker, TriangleColorPicker, toHsv, fromHsv } from 'react-native-color-picker'
import { connect } from 'react-redux'

class Draw extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      //Outils séléctionné
      selectedTool:"pen",

      //Bar d'option affiché (peut pas selection tool "color" ou "layer")
      selectedOptionBarTool:"pen",

      //Couleur actuellement sélectionnée
      selectedColor:"black",

      //Epaisseur du trait sélectionnée
      selectedStrokeWidth:1,

      //Opacité du trait sélectionnée
      selectedOpacity:1,

      //Epaisseur du trait de la gomme sélectionné
      selectedEraserWidth:10,
      
      //Layer actuellement sélectionné
      selectedLayer:0,
    }
  }

  //Pour créer nouvel elem dans layer
  isPenAfterEraser = [true]

  //Douille pour utiliser la flatlist [1,2,3,...]
  numberOfLayer=[0,0,0,0,0,0,0,0,0,0]

  //Ajt derrière (si devient premier plan : -1)
  _addLayer(number) {
    const action = { type: "ADD_LAYER", value: number }
    this.props.dispatch(action)
  }

  changeIsPenAfterEraser(indexLayer){
    // console.log("this.isPenAfterEraser:",this.isPenAfterEraser)
    if(this.isPenAfterEraser[indexLayer]){
      this.isPenAfterEraser[indexLayer]=false
      return true
    }
    return false
  }

  selectPen=()=>{
    if(this.state.selectedTool != "pen"){
      this.isPenAfterEraser[this.state.selectedLayer]=true
    }

    this.setState({
      selectedTool:"pen",
      selectedOptionBarTool:"pen"
    })
  }

  selectRubber=()=>{
    this.setState({
      selectedTool:"eraser",
      selectedOptionBarTool:"eraser"
    })
  }

  selectMove=()=>{
    this.setState({
      selectedTool:"move",
      selectedOptionBarTool:"move"
    })
  }

  selectColor=()=>{
    this.setState({
      selectedOptionBarTool:"color"
    })
  }

  selectOptionLayer=()=>{
    this.setState({
      selectedOptionBarTool:"layer"
    })
  }

  selectLayer=(layerNumber)=>{
    this.setState({
      selectedLayer:layerNumber,
    })
  }

  _displayOptionBar(){
    if(this.state.selectedOptionBarTool == "pen"){
      return(
        <View style={styles.optionBar}>
          <View style={styles.slider}>
            <Text>Width</Text>
            <Slider 
            style={{width:"80%"}}
              value={1}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value)=>{this.setState({selectedStrokeWidth:value})}}
            />
          </View>
          <View style={styles.slider}>
            <Text>Opacity</Text>
            <Slider 
            style={{width:"80%"}}
              value={1}
              minimumValue={0}
              maximumValue={1}
              onValueChange={(value)=>{this.setState({selectedOpacity:value})}}
            />
          </View>
        </View>

      )
    }

    if(this.state.selectedOptionBarTool == "eraser"){
      return(
        <View style={styles.optionBar}>
          <View style={styles.slider}>
            <Text>Width</Text>
            <Slider 
            style={{width:"80%"}}
              value={1}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value)=>{this.setState({selectedEraserWidth:value})}}
            />
          </View>
        </View>
      )
    }

    if(this.state.selectedOptionBarTool == "move"){
      return(
        <View style={styles.optionBar}>
                <FlatList 
          horizontal={true}
          data={this.numberOfLayer}
          keyExtractor={(item, index) => {return(index.toString())}} 
          renderItem={(item) => {
            if(item.index < this.props.layersData.length) {
              return(
                <TouchableOpacity onPress={()=> this.selectLayer(item.index)}>
                  <Text style={styles.miniLayer}>{item.index}</Text>
                </TouchableOpacity>)
            }
            }} />    
        </View>
      )
    }

    if(this.state.selectedOptionBarTool == "color"){
      return(
        <View style={styles.optionBar}>
          <TriangleColorPicker
            color={this.state.selectedColor}
            onColorChange={color => {this.setState({selectedColor:fromHsv(color)}) }}
            style={{
              width:"100%",
              height:150,
            }}
            hideSliders={true}
            hideControls={true}
          />
        </View>

      )
    }

    if(this.state.selectedOptionBarTool == "layer"){  
      return(
        <View style={styles.optionBar}>
          <FlatList 
          horizontal={true}
          data={this.numberOfLayer}
          keyExtractor={(item, index) => {return(index.toString())}} 
          ListHeaderComponent={                  
            <TouchableOpacity style={{alignSelf:"center", justifyContent:"center",height:50}} onPress={()=>{this._addLayer(-1)}}>
              <Image style={{height:20, width:20}}source={require("../Images/icon_plus.png")}/>
            </TouchableOpacity>
          }
          renderItem={(item) => {
            if(item.index < this.props.layersData.length) {
              return(
                <View style={styles.miniLayerContainer}>
                  <TouchableOpacity onPress={()=> this.selectLayer(item.index)}>
                    <Text style={styles.miniLayer}>{item.index}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{alignSelf:"center"}} onPress={()=>{this._addLayer(item.index)}}>
                    <Image style={{height:20, width:20}}source={require("../Images/icon_plus.png")}/>
                  </TouchableOpacity>
                </View>
              )
            }
          }} />    
        </View>
      )
    }
  }

  render(){
    return (
      <View style={styles.mainContainer}>
        

        {/* <Test/> */}
        
        <Canvas canvasHeight={200} canvasWidth={200} selectedTool={this.state.selectedTool}
        selectedColor={this.state.selectedColor}
        selectedStrokeWidth={this.state.selectedStrokeWidth}
        selectedOpacity={this.state.selectedOpacity}
        selectedEraserWidth ={this.state.selectedEraserWidth}
        selectedLayer ={this.state.selectedLayer}
        isPenAfterEraser= {this.isPenAfterEraser}
        changeIsPenAfterEraser = {this.changeIsPenAfterEraser}/>

        {this._displayOptionBar()}

        <View style={styles.bot}>
          <TouchableOpacity style={styles.bot_button} onPress={this.selectPen}><Image style={styles.icon} source={require("../Images/icon_pen.png")}/></TouchableOpacity>
          <TouchableOpacity style={styles.bot_button} onPress={this.selectRubber}><Image style={styles.icon} source={require("../Images/icon_rubber.png")}/></TouchableOpacity>
          <TouchableOpacity style={styles.bot_button} onPress={this.selectMove}><Image style={styles.icon} source={require("../Images/icon_move.png")}/></TouchableOpacity>
          <TouchableOpacity style={styles.bot_button} onPress={this.selectColor}>
            <Svg style={styles.icon}>
              <Circle stroke="white" fill= "white" r="18" cx="20" cy="20"/>
              <Circle fill= {this.state.selectedColor} r="15" cx="20" cy="20"/>
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bot_button} onPress={this.selectOptionLayer}><Image style={styles.icon} source={require("../Images/icon_layer.png")}/></TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },


  bot:{
    position:"absolute",
    bottom:0,
    backgroundColor:"lightblue",
    width:"100%",
    height:50,
    alignItems:"center",
    zIndex:1,
    flexDirection:"row"
  },

  optionBar:{
    position:"absolute",
    bottom:50,
    width:"100%",
    alignItems:"center",
    zIndex:2,
    backgroundColor:"lightblue",
  },

  slider:{
    flexDirection:"row"
  },

  bot_button:{
    flex:1,
  },

  icon:{
    height:40,
    width:40,
  },

  miniLayer:{
    height:50,
    width:50,
    backgroundColor:"white",
    textAlign:"center",
    textAlignVertical:"center",
    marginHorizontal:5,
  },

  miniLayerContainer: {
    flexDirection:"row",
  }


});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

const mapStateToProps = (state) => {
  return {layersData: state}
}

export default connect(mapStateToProps,mapDispatchToProps)(Draw)