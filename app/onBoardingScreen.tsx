// OnboardingScreen.js

// import GlassTheme from '../constants/theme';
import theme, { GlassTheme } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BoardingScreen() {
    const theme = GlassTheme.dark;
  
  return (
    <View style={styles.container}>
      {/* Purple background */}
      <View style={styles.purpleBg} />

      {/* Big illustration (replace with your image asset if you have one) */}
      <View style={styles.illustrationWrapper}>
        <View style={styles.notepadShape1} />
        <View style={styles.notepadShape} />
        <View style={styles.penShape} />
      </View>

      {/* Blurred title card */}
      <View style={styles.blurTitleCard}>
        <View style={styles.titleLine2Row}>
        <Text style={[styles.titleLine1 ]}>All your ideas</Text>
          <Text style={styles.titleLine2Black}> in </Text>
          <BlurView intensity={30} tint="light" style={styles.titleChip}>
            <Text style={ [styles.titleLine2Black , { color: theme.check }]}>one place</Text>
          </BlurView>
        </View>
      </View>

      {/* <Link href="/screens/ProfileScreen" push asChild>
         <Button title="Push Button" />
      </Link> */}

      {/* <Link href="/screens/ProfileScreen" dismissTo asChild>
         <Button title="Push Button" />
      </Link> */}

      {/*   <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonInner}
            onPress={() => router.push("/Home")}
            >
            <Text style={[styles.buttonText, { color: theme.check } ]}>Get Started</Text>
          </TouchableOpacity> */}



      {/* Blurred bottom button */}
      <BlurView intensity={80} tint="default" style={[styles.blurButtonWrap]}>
        <Link href="/Home" dismissTo asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonInner}
            >
            <Text style={[styles.buttonText, { color: theme.check } ]}>Get Started</Text>
          </TouchableOpacity>
        </Link>
      </BlurView>
    </View>
  );
}

const BORDER_RADIUS_BIG = 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A855F7", // purple base
    alignItems: "center",
    justifyContent: "flex-start",
  },
  purpleBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#212121ff",
  },
  illustrationWrapper: {
    width: "100%",
    height: "55%",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notepadShape: {
    width: "80%",
    height: "80%",
    backgroundColor: theme.dark.textSecondary,
    borderRadius: 40,
    transform: [{ rotate: "-10deg" }],
  },
  notepadShape1:{
    width: "80%",
    height: "80%",
    backgroundColor: theme.dark.glassOverlay,
    position: 'absolute',
    borderRadius: 40,
    top:60,
    left: 15,
    transform: [{ rotate: "-2deg" }],

  },
  penShape: {
    position: "absolute",
    width: 40,
    height: "90%",
    backgroundColor: theme.dark.check,
    borderRadius: 20,
    right: "13%",
    transform: [{ rotate: "10deg" }],
  
  },
  blurTitleCard: {
    position: "absolute",
    bottom: 120,
    width: "86%",
    borderRadius: BORDER_RADIUS_BIG,
    paddingHorizontal: 22,
    paddingVertical: 20,
    overflow: "hidden",    
  },
  titleLine1: {
    fontSize: 46,
    fontWeight: "700",
    color: theme.dark.textSecondary,
  },
  titleLine2Row: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
    flexWrap: "wrap",
  },
  titleLine2Black: {
    fontSize: 46,
    fontWeight: "700",
    color: theme.dark.textSecondary,
  },
  titleChip: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 2,
    transform: [{ rotate: "-10deg" }],
  },
  blurButtonWrap: {
    position: "absolute",
    // backgroundColor:theme.dark.check,
    bottom: 20,
    width: "86%",
    borderRadius: BORDER_RADIUS_BIG,
    overflow: "hidden",
  },
  buttonInner: {
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
