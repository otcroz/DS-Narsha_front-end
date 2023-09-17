import React, {useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import SingleBadge from '../../components/SingleBadge';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import AchieveData from '../../data/AchieveData.json';
import {badgeSources} from '../../data/BadgeSources';
import Config from 'react-native-config';
import { useSelector, useDispatch } from "react-redux";
import store, { turn } from '../../../Achievement'

type UserData = {
  userId: string;
};

// @ts-ignore
export default function BadgeList({route, navigation}) {
  const queryClient = useQueryClient();
  const {data: userData} = useQuery(['user'], () => {
    return queryClient.getQueryData(['user']);
  }) as {data: UserData};

  // get badge list
  const getBadgeList = async () => {
    try {
      const res = await fetch(
        `http://${Config.HOST_NAME}/api/user/badge-list?userId=${userData.userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await res.json();
      return json;
    } catch (err) {
      console.log(err);
    }
  };

  const achieveQuery = useQuery({
    queryKey: ['badge-list'],
    queryFn: getBadgeList,
  });

  

  // get Achievement
  const ac = store.getState().achieve
  const dispatch = useDispatch();
   
  // get profile
  const getProfileDetail = async () => {
    try {
      const res = await fetch(
        `http://${Config.HOST_NAME}/api/user/detail?userId=${userData.userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await res.json();
      return json;
    } catch (err) {
      console.log(err);
    }
  };

  const profileQuery = useQuery({
    queryKey: ['profile-detail'],
    queryFn: getProfileDetail,
  });

  // update achievement
  const updateBirthAchi = useMutation(async () => {
    try {
      const res = await fetch(
        `http://${Config.HOST_NAME}/api/user/check-achieve?userId=${
          userData.userId
        }&achieveNum=${4}`,
        {
          method: 'PUT',
        },
      );

      const json = await res.json();
      dispatch(turn(4));
      return json;
    } catch (err) {
      console.log(err);
    }
  });

  const handleBirthAchi = async () => {
    try {
      await updateBirthAchi.mutateAsync();
    } catch (error) {}
  };

  // handleAchi();
  useEffect(()=> {
    !(ac.includes(4)) && !profileQuery.isLoading && !(profileQuery.data.data.birth === null)?
    handleBirthAchi():null;
    console.log(ac)
  }, [])


  const _RenderItem = useCallback(({item, index}: any) => {
    // console.log(item.title);
    return (
      <View>
        {!achieveQuery.isLoading && achieveQuery.data && (
          <>
            <SingleBadge
              badge={
                isCompletefunc(achieveQuery.data.data, index)
                  ? badgeSources[index]
                  : require('../../assets/badge/badge-none.png')
              }
              content={AchieveData[index]}
              progress={stringToArray(achieveQuery.data.data, index)}
            />
          </>
        )}
      </View>
    );
  }, []);

  const isCompletefunc = (data: any, index: number) => {
    const badgeArray = data.substring(1, data.length - 1).split(', ');
    if (badgeArray[index] === 'false') return false;
    else return true;
  };

  const stringToArray = (data: any, index: number) => {
    const badgeArray = data.substring(1, data.length - 1).split(', ');

    return badgeArray;
  };

  return (
    <View style={styles.container}>
      {!achieveQuery.isLoading && achieveQuery.data && (
        <>
          <View style={styles.ds_container}>
            <Image
              style={styles.ds_image}
              source={require('../../assets//graphic/applogo.png')}
            />
            <Text
              style={
                styles.ds_text
              }>{`업적을 달성하면 뱃지를 얻을 수 있는 거 아시나요? 여러분이 획득한 뱃지를 볼 수 있는 공간이에요~!`}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <FlatList
              data={AchieveData}
              renderItem={_RenderItem}
              key={'#'}
              keyExtractor={(item, index) => '#' + index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,
                marginHorizontal: 20,
                flexGrow: 0.5,
                justifyContent: 'flex-start',
                alignSelf: 'flex-start',
              }}
              numColumns={3}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  top: {
    flexDirection: 'row',
    height: 63,
    width: 400,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#E3F1A9',
  },
  ds_container: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  ds_image: {
    width: 49,
    height: 49,
    borderRadius: 50,
  },
  ds_text: {
    flex: 1,
    marginLeft: 7,
    backgroundColor: '#FFF',
    fontSize: 13,
    borderRadius: 20,
    padding: 12,
    fontFamily: 'NanumSquareB',
    color: '#61A257',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 5,
  },
  gridView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
    justifyContent: 'flex-start',
    margin: 15,
  },
});
