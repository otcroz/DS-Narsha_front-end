import React, { useCallback, useEffect, useRef, useState } from 'react';
import {PermissionsAndroid, StyleSheet, View, ImageBackground, Text, ScrollView, Platform, FlatList, Button} from 'react-native';
import {useCameraRoll, CameraRoll} from "@react-native-camera-roll/camera-roll";
import { TouchableOpacity } from 'react-native-gesture-handler';
import ArrowRight from '../../assets/arrow-right.svg';

const styles = StyleSheet.create({
container:{
    flex: 1,
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
  marginHorizontal: 70
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
  pickImg: {
    height: 300,
    width: 300,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#c0c0c0'
  },
  img: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'cover',
    marginHorizontal: 5
  },
  selPhoto:{
    opacity: 0.7,
    fontSize: 16,
    justifyContent: 'center',
    alignItems:'center'
  },
  selPhotoText:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#98DC63'
  }
});

// @ts-ignore
export default function SelectImage({navigation}) {
  const [photos, getPhotos] = useCameraRoll();
  const [pageSize, setPageSize] = useState(40);
  let selectInputs = useRef<string[]>([]); // select photos, send next page
  let currentSelect =  useRef(""); // currnet select

  useEffect(()=>{
    permissionFunc(); // permission code
    getPhotos(); // getPhotos
  }, [])

  const _RenderItem = useCallback(({ item }: any) => {
    return (
      <TouchableOpacity onPress={() => {
          selectHandler(item.node.image.uri)
        }}>
          
        <ImageBackground
          source={{ uri: item.node.image.uri }}
          style={[styles.img, selectInputs.current.includes(item.node.image.uri) && styles.selPhoto]}
          imageStyle={{borderRadius: 10}}
        >
          {
          selectInputs.current.includes(item.node.image.uri) && 
          <Text style={styles.selPhotoText}>
            {selectInputs.current.indexOf(item.node.image.uri) + 1}
          </Text>
          }
        </ImageBackground>
      </TouchableOpacity>
    );
  }, []);

  // select image
  const selectHandler = (uri: string) => {
    if (selectInputs.current.includes(uri))  selectInputs.current = selectInputs.current.filter((el) => el !== uri);
    else selectInputs.current.push(uri)
  }

// permission code
const permissionFunc = async() =>{
  if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    return;
  }
}

async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (Number(Platform.Version) >= 33) {
      return Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (Number(Platform.Version) >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

return (
  <View style={styles.container}>
    <View style={styles.top}>
      <View style={styles.progressbox}>
        <View style={styles.progress}>
          <View style={[styles.dot, {backgroundColor: '#98DC63'}]}/>
          <View style={[styles.dot, {backgroundColor: '#D9D9D9'}]}/>
          <View style={[styles.dot, {backgroundColor: '#D9D9D9'}]}/>
        </View>
        <ArrowRight onPress={() => navigation.navigate("PostPage")} />
      </View>
      <Text>이미지를 선택해주세요.</Text>
    </View>
    {/* height */}
    <View style={{height: 20}} />
    <View style={styles.container}>
    <View style={{alignItems: 'center'}}>
          <View style={styles.pickImg} />
    </View>
      {photos ? (
        <FlatList
          data={photos.edges}
          renderItem={_RenderItem}
          key={'#'}
          keyExtractor={(item, index) => '#' + index.toString()}
          // 페이징 처리
          onEndReached={() => {
            setPageSize(pageSize + 40);
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 210,
            flexGrow: 1,
            justifyContent: 'space-around',
            alignSelf:'center'
          }}
          numColumns={3}
        />
      ) : (<Text>이미지가 없습니다.</Text>)}
    </View>
  </View>
)

};