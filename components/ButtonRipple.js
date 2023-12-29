import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const RipplePressable = ({ onPress, text, backgroundColor }) => {

  const alteredStyle = {
    backgroundColor,
  }

  return (
    <View style={[styles.container, alteredStyle]} >
      <Pressable style={[styles.container, alteredStyle]} android_ripple={{ color: '#ddd' }} onPress={onPress}>
        <View style={{ overflow: "hidden" }}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    overflow: "hidden",
},
  pressable: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: '#3498db',
    margin: 5,
  },
  text: {
    color: "#ffffffcc",
    gap: 10
  }
});

export default RipplePressable;
