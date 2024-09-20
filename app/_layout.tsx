import { SplashScreen, Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
import { router } from "expo-router";
import {PermissionsAndroid} from 'react-native';

// SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  // useEffect(()=>{

  //   const gainPermission=async()=>{
  //     let permissions = [
  //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     ]
      
  //     let status = await PermissionsAndroid.requestMultiple(permissions)
  //     if (status = PermissionsAndroid.RESULTS.GRANTED){
  //       // granted
  //       SplashScreen.hideAsync()
  //     }else{
  //       // Not granted
  //     }
  //   }
  // },[])


  return (
    <Stack
      screenOptions={
        {headerShown:false}
      }
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
