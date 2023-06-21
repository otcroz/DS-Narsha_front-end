import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import ArrowLeft from '../../assets/arrow-left.svg';
import SendBtn from '../../assets/send-btn.svg'

const styles = StyleSheet.create({
  container:{
    flex: 1
},
top: {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems:'center',
  height: 105,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
  backgroundColor: '#E3F1A9',
},
progress:{
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 70,
  marginRight: 56
},
progressbox:{
  paddingHorizontal: 16,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},
dot:{
  width: 21,
  height: 21,
  borderRadius: 50,
  margin: 20,
},
});

//@ts-ignore
const WritePage = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* top */}
      <View style={styles.top}>
        <View style={styles.progressbox}>
          <ArrowLeft/>
          <View style={styles.progress}>
            <View style={[styles.dot, {backgroundColor: '#98DC63'}]}/>
            <View style={[styles.dot, {backgroundColor: '#D9D9D9'}]}/>
            <View style={[styles.dot, {backgroundColor: '#D9D9D9'}]}/>
          </View>
          <SendBtn />
        </View>
        <Text>글을 작성해볼까요?</Text>
      </View>
      {/* content */}
      <Text>WritePage</Text>
    </View>
  );
};



export default WritePage;