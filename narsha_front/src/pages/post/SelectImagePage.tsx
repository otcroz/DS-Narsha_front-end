import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import {useCameraRoll} from '@react-native-camera-roll/camera-roll';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ArrowRight from '../../assets/arrow-right.svg';
import Toast from 'react-native-easy-toast';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F1A9',
  },
  listContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  top: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 105,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#F9FAC8',
    shadowOffset: {
      width: 5,
      height: -10,
    },
    elevation: 10,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 70,
    marginRight: 54,
  },
  progressbox: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 21,
    height: 21,
    borderRadius: 50,
    margin: 20,
  },
  pickImg: {
    height: 300,
    width: 300,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#c0c0c0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 5,
      height: -10,
    },
    elevation: 10,
  },
  img: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
  selPhoto: {
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selPhotoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#98DC63',
  },
  currentPickImg: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notice: {
    backgroundColor: '#000000',
  },
  line: {
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 10,
    borderColor: '#F9FAC8',
  },
});

// @ts-ignore
export default function SelectImage({navigation}) {
  const [photos, getPhotos] = useCameraRoll();
  const [pageSize, setPageSize] = useState(24);
  let selectInputs = useRef<string[]>([]); // select photos, send next page
  const [currentPhoto, setCurrentPhoto] = useState('');

  // Toast ref
  const toastRef = useRef();

  // window size
  const {width, height} = Dimensions.get('window');

  // floating toast func
  const showToast = useCallback(() => {
    toastRef.current.show('사진은 최대 10장까지 올릴 수 있어요.');
  }, []);

  useEffect(() => {
    permissionFunc(); // permission code
  }, []);

  useEffect(() => {
    getPhotos({first: pageSize}); // getPhotos
  }, [pageSize]);

  const _RenderItem = useCallback(({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectHandler(item.node.image.uri);
        }}>
        <ImageBackground
          source={{uri: item.node.image.uri}}
          style={[
            styles.img,
            selectInputs.current.includes(item.node.image.uri) &&
              styles.selPhoto,
          ]}
          imageStyle={{borderRadius: 10}}>
          {selectInputs.current.includes(item.node.image.uri) && (
            <Text style={styles.selPhotoText}>
              {selectInputs.current.indexOf(item.node.image.uri) + 1}
            </Text>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  }, []);

  // select image
  const selectHandler = (uri: string) => {
    if (selectInputs.current.includes(uri)) {
      selectInputs.current = selectInputs.current.filter(el => el !== uri);
      setCurrentPhoto(selectInputs.current[selectInputs.current.length - 1]);
    } else if (selectInputs.current.length < 10) {
      // maximum 10 photo
      if (selectInputs.current.length >= 9) showToast(); // when 10 photo full
      selectInputs.current.push(uri);
      setCurrentPhoto(uri);
    }
  };

  // permission code
  const permissionFunc = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
  };

  // permission method
  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Number(Platform.Version) >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
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
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.progressbox}>
          <View style={styles.progress}>
            <View style={[styles.dot, {backgroundColor: '#98DC63'}]} />
            <View style={[styles.dot, {backgroundColor: '#D9D9D9'}]} />
            <View style={[styles.dot, {backgroundColor: '#D9D9D9'}]} />
          </View>
          {selectInputs.current.length < 1 ? (
            <ArrowRight style={{color: '#C0C0C0'}} />
          ) : (
            <ArrowRight
              style={{color: '#61A257'}}
              onPress={() =>
                // 메서드 추가
                navigation.navigate('PostLoadingPage', {
                  photos: selectInputs.current,
                })
              }
            />
          )}
        </View>
        <Text>이미지를 선택해볼까요?</Text>
      </View>
      {/* height */}
      <View style={{height: 10}} />
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <ImageBackground
            source={
              currentPhoto
                ? {uri: currentPhoto}
                : require('../../assets/graphic/basic-upload.jpg')
            }
            imageStyle={{borderRadius: 10}}
            style={styles.pickImg}></ImageBackground>
        </View>
        <View style={styles.line} />
        {photos ? (
          <View style={styles.listContainer}>
            <FlatList
              data={photos.edges}
              renderItem={_RenderItem}
              key={'#'}
              keyExtractor={(item, index) => '#' + index.toString()}
              // 페이징 처리
              onEndReached={() => {
                setPageSize(pageSize + 24);
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,
                flexGrow: 1,
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
              }}
              numColumns={3}
            />
          </View>
        ) : (
          <Text>이미지가 없습니다.</Text>
        )}
      </View>
      <Toast
        ref={toastRef}
        positionValue={height * 0.5}
        fadeInDuration={500}
        fadeOutDuration={1500}
        style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
      />
    </View>
  );
}
