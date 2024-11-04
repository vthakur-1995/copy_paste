import React from "react";
import { Dimensions, ImageBackground, StyleSheet, Image,View,Text } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import PostDetail from "./component/PostDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { width, height } = Dimensions.get("screen");

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default function App() {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 50;
      const maxTranslateY = height / 2 - 50;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .runOnJS(true);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(width / 100, height / 100)
      );
    })
    .runOnJS(true);

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, 50) }],
  }));

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <QueryClientProvider client={queryClient}>
    {/* <View style={{backgroundColor:"#eee"}}>
      <Text>gjgjkgjkjkhkjhkhkhkhkhkhkhkh</Text>
    </View> */}
      <PostDetail />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
  // return (
  // <GestureHandlerRootView style={styles.container}>
  // {/* <GestureDetector gesture={pan}>
  // <Animated.View style={{flex:1}}>
  //   <GestureDetector touchAction="pinch-zoom" gesture={pinch}>
  //   <Animated.Image source={{uri: 'https://legacy.reactjs.org/logo-og.png'}}  resizeMode="cover" style={[styles.image,boxAnimatedStyles,animatedStyles]}>
  // </Animated.Image>

  //   </GestureDetector>
  //   </Animated.View>
  //   </GestureDetector> */}
  // {/* </GestureHandlerRootView> */}
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#b58df1",
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    position: "absolute",
    left: "50%",
    top: "50%",
    pointerEvents: "none",
  },
  image: {
    flex: 1,
  },
});
