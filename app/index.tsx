import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, PermissionsAndroid, Platform, Pressable, RefreshControl, StyleSheet, View, FlatList, Text } from "react-native";
import * as fileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { PhotoModal } from "@/components/PhotoModal/PhotoModal";
import { VideoModal } from "@/components/VideoModal/VideoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";

const itemWidth = Dimensions.get("screen").width / 3.5;

export default function Index() {
  const directoryUri = "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";
  const [files, setFiles] = useState<string[]>([]);
  const [data, setData] = useState<string>("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermission, setPermission] = useState<Promise<boolean> | boolean>(async () => {
    const data = await AsyncStorage.getItem("permission");
    return data === "true";
  });

  const getFiles = async () => {
    try {
      if (!await hasPermission) {
        const permission = await fileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(directoryUri);
        setPermission(permission.granted);
        if (permission.granted) {
          await AsyncStorage.setItem("permission", "true");
        }
      }

      if (Platform.OS === "android") {
        const statusFiles = await fileSystem.StorageAccessFramework.readDirectoryAsync(directoryUri);
        setFiles(statusFiles);
      }
    } catch (error) {
      console.log(`Error - ${error}`);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  const handleImagePress = (item: string) => {
    setData(item);
    setShowImageModal(true);
  };

  const handleVideoPress = (item: string) => {
    setData(item);
    setShowVideoModal(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const statusFiles = await fileSystem.StorageAccessFramework.readDirectoryAsync(directoryUri);
    setFiles(statusFiles);
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: string }) => {
    if (item.endsWith(".jpg")) {
      return (
        <Pressable style={styles.itemContainer} onPress={() => handleImagePress(item)}>
          <Image source={{ uri: item }} style={styles.image} />
        </Pressable>
      );
    } else if (item.endsWith(".mp4")) {
      return (
        <Pressable style={styles.itemContainer} onPress={() => handleVideoPress(item)}>
          <View style={styles.playIconContainer}>
            <MaterialIcons name="play-circle-outline" size={80} color="white" />
          </View>
          <Image source={{ uri: item }} style={styles.image} />
        </Pressable>
      );
    } else {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.playIconContainer}>
            <Entypo name="warning" size={80} color="white" />
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={files}
        renderItem={renderItem}
        estimatedItemSize={2000}
        numColumns={3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <PhotoModal isVisible={showImageModal} data={data} close={() => setShowImageModal(false)} />
      <VideoModal isVisible={showVideoModal} data={data} close={() => setShowVideoModal(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    gap: 20,
    padding: 10,
  },
  bcontainer: {
    padding: 5,
  },
  itemContainer: {
    padding: 5,
    position: "relative",
  },
  image: {
    width: itemWidth,
    height: itemWidth,
  },
  playIconContainer: {
    position: "absolute",
    zIndex: 1000,
    width: itemWidth,
    height: itemWidth,
    justifyContent: "center",
    alignItems: "center",
  },
});
