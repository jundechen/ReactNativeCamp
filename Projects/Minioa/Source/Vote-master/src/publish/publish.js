import React, { PureComponent } from 'react'
import { StyleSheet, Alert, View, ScrollView, Text, TextInput, Image, Modal, StatusBar, Dimensions, TouchableOpacity ,TouchableWithoutFeedback} from 'react-native'
import Setting from '../config/setting';
import BaseServiceApiNet from '../utils/baseServiceApiNet';
import AddList from './components/addList';
import Title from './components/title'


export default class Publish extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      paramsData: {}
    }
    this.getParams = this.getParams.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation
    return {
      headerTitle: '新建话题',
      //编辑
      headerRight: (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerTouch} onPress={() => navigation.state.params.navigatePress()}>
            <Image style={[styles.headerBtn, styles.headerImg]} source={require('../assets/images/public.png')} resizeMode='contain' />
          </TouchableOpacity></View>)
    }
  }

  componentWillReceiveProps(next) {
    const { topic_id, navigation, accesstoken } = this.props;
    if (next.topic_id && next.topic_id !== topic_id) {
      this.props.query({ topic_id: next.topic_id, accesstoken })
      navigation.goBack()
    }
  }

  componentWillUnmount() {
    // this.props.clean()
  }
  componentDidMount() {
    this.props.navigation.setParams({ navigatePress: this.publicButton, navigation: this.props.navigation, that: this })

  }

  getParams(data) {
      //alert("=============+++++++++++>" + JSON.stringify(data));
      if(data.title){
        this.state.paramsData.title = data.title;
        this.state.paramsData.type = data.key?data.key:this.state.paramsData.key?this.state.paramsData.key:0;
      }else if(data instanceof Array){
        this.state.paramsData.items = data.map(function(e,index){
          return e.value;
        })
      }else{
        this.state.paramsData.key = data;
      }  
  }
  publicButton(){
    const{navigate} = this.navigation; 
    //  if(Object.is('',this.state.paramsData.title)){
    //   return Alert.alert("","请输入标题或者内容",[{text:"重新输入"}]);
    // }
      try {
          BaseServiceApiNet.sentPublicVote(this.state.paramsData)
          .then((response) => {
            if(response.hasOwnProperty("success")){
              setTimeout(() => {
              Alert.alert('', '发布成功', [
                {
                  text: '点击返回',
                  onPress: function() {
                    navigate("Home",{staffType:"1"})
                  }
                },
              ])},1000)
            }else{
              setTimeout(() => {
                Alert.alert("",response.error,[{text:"发布失败"}]); 
            }, 1000)
            }
          })
    } catch(e) {
      console.log('error ${e}');
      }  
}

  render() {
    const { loading } = this.props
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps={true}>
        <StatusBar barStyle="light-content" />
        <Title getValue={this.getParams}/>
        <AddList getValue={this.getParams} />
      </ScrollView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTouch: {
    height: 30
  },
  headerBtn: {
    flex: 1,
    width: 30,
    height: 30,
    marginRight: 10
  }
})

