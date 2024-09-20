import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as fileSystem from "expo-file-system"
import { Video, ResizeMode } from 'expo-av';
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PhotoModalType={
    isVisible:boolean,
    data:string,
    close:()=>void
}

export function VideoModal({isVisible,data, close}:PhotoModalType){
    const video = useRef(null);
    const [saveDir,setSaveDir] = useState(async()=>{
        const data= await AsyncStorage.getItem("saveDir")
        return data
    })
    const [hasPermission,setHasPermission] = useState((async()=>{
        const data= await AsyncStorage.getItem("savePermission")
        
        if(data=="true"){
            return true
        }
        return false
    }))

    const handleSave=async()=>{
        const filename=`${new Date().toISOString()}.mp4`
        const mimeType="video/mp4"
        console.log(await hasPermission)
        try {
            if(! await hasPermission){
                const permissions= await fileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
                console.log(permissions)

                await AsyncStorage.setItem("saveDir",permissions.directoryUri)
                setSaveDir(permissions.directoryUri)
                if(permissions.granted){
                    await AsyncStorage.setItem("savePermission","true")
                    setSaveDir(permissions.granted)
                }

            }

            const base64= await fileSystem.readAsStringAsync(data,{encoding:fileSystem.EncodingType.Base64})
            await fileSystem.StorageAccessFramework.createFileAsync(await saveDir,filename,mimeType)
            .then(async(uri)=>{
                await fileSystem.writeAsStringAsync(uri,base64,{encoding:fileSystem.EncodingType.Base64})
            })
            close()
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <Modal 
            animationType="slide"
            style={styles.mainContainer}
            transparent={true}
            visible={isVisible}
        >
            <View style={styles.mainContainer}>
                <View style={styles.subContainer}>
                    <View
                        style={{
                            alignItems:"flex-end",
                            paddingHorizontal:20,
                            paddingTop:20,
                            marginBottom:30
                        }}
                    >
                        <Pressable
                            onPress={() => close()}
                            style={{
                                backgroundColor:"#ffffff14",
                                borderRadius:50,
                            }}
                        >
                            <Ionicons name="close-sharp" size={40} color="red" />
                        </Pressable>
                    </View>
                    <Video
                        ref={video}
                        style={{
                            width:"70%",
                            height:"40%",
                            marginHorizontal:"auto"
                        }}
                        source={{   uri: data }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        onLoad={()=>video.current?.playAsync()}
                        isLooping
                        // onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                    <Pressable 
                        onPress={()=>handleSave()}
                        style={{
                            width:"50%",
                            height:48,
                            backgroundColor:"#007501",
                            borderRadius:50,
                            justifyContent:"center",
                            alignItems:"center",
                            marginTop:30,
                            marginHorizontal:"auto"
                        }}
                    >
                        <Text style={{
                            fontSize:20,
                            color:"white",
                            fontWeight:"700"
                        }}>Save</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        height:"100%",
        backgroundColor:"#001606e6",
        justifyContent:"flex-end",
    },
    subContainer:{
        height:"80%",
        backgroundColor:"#202020",
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
    }
})