import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const t = setTimeout(() => onFinish && onFinish(), 1400);
    return () => clearTimeout(t);
  }, [anim, onFinish]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-120, 120] });

  return (
    <View style={styles.root}>
      <View style={styles.logoWrap}>
        <Text style={styles.title}>Givo</Text>
        <View style={styles.skeleton}>
          <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1720' },
  logoWrap: { width: '80%', alignItems: 'center' },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 20 },
  skeleton: { width: '100%', height: 12, backgroundColor: '#222', overflow: 'hidden', borderRadius: 6 },
  shimmer: { width: 100, height: '100%', backgroundColor: 'linear-gradient(90deg,#333,#999,#333)' as any, opacity: 0.6 },
});
