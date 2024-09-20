import { Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
import { router } from "expo-router";

export default function RootLayout() {

  // useEffect(()=>{
  //   const loadUser=async()=>{
  //     await 
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
