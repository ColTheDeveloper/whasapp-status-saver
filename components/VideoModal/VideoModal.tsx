import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as fileSystem from "expo-file-system"
import { Video, ResizeMode } from 'expo-av';
import { useRef } from "react";

type PhotoModalType={
    isVisible:boolean,
    data:string,
    close:()=>void
}

export function VideoModal({isVisible,data, close}:PhotoModalType){
    const video = useRef(null);
    // const newDir="content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2FWhatsApp%20Video"
    // const newDir="file://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2Fimage.mp4"
    // const perDir="content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2F"
    // const newDir=fileSystem.documentDirectory+"helloworld.mp4"

    // useEffect(() => {
    //     const backAction = () => {
    //       console.log("pressed") 
    //       close()
    //       return true// Prevent default behavior (exiting the app)
    //     };
    
    //     const backHandler = BackHandler.addEventListener(
    //       "hardwareBackPress",
    //       backAction
    //     );
    
    //     return () => backHandler.remove(); // Cleanup the event listener
    // }, []);

    const handleSave=async()=>{
        const filename=`${new Date()}.mp4`
        const mimeType="video/mp4"
        try {
            const permissions= await fileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

            if(permissions.granted){
                const base64= await fileSystem.readAsStringAsync(data,{encoding:fileSystem.EncodingType.Base64})
                await fileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri,filename,mimeType)
                .then(async(uri)=>{
                    await fileSystem.writeAsStringAsync(uri,base64,{encoding:fileSystem.EncodingType.Base64})
                })
                .catch(e=>console.log(e))
            }else{

            }
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