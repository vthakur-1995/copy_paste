import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PinchGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const PinchableImage = ({ source }) => {
  // Shared values for scale, translateX, and translateY
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch gesture handler
  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      // Optionally reset scale after pinch ends
    },
  });

  // Pan gesture handler
  const panHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      // Optionally add boundaries or reset position
    },
  });

  // Animated styles for scaling and translation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.Image
              source={source}
              style={[styles.image, animatedStyle]}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default PinchableImage;
