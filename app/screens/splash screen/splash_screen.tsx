import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const images = [
  require('../../../assets/images/img1.jpg'),
  require('../../../assets/images/img2.jpg'),
  require('../../../assets/images/img3.jpg')
];

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const router = useRouter();
  const carouselRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
    // Auto-scroll carousel
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        carouselRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [anim, onFinish]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-120, 120] });

  return (
    <View style={styles.root}>
      <FlatList
        ref={carouselRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <Image source={item} style={styles.carouselImg} resizeMode="cover" />
        )}
        style={styles.carousel}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
      />
      <View style={styles.centeredLogoWrap} pointerEvents="none">
        <Text style={styles.centeredTitle}>Givo</Text>
      </View>
      <View style={styles.dotsWrap}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, currentIndex === i && styles.dotActive]} />
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/screens/Home')}> 
        <Text style={styles.btnText}>Go to Home</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  carousel: { position: 'absolute', top: 0, left: 0, width, height },
  carouselImg: { width, height, position: 'absolute', top: 0, left: 0 },
  centeredLogoWrap: { position: 'absolute', top: 0, left: 0, width, height, justifyContent: 'center', alignItems: 'center' },
  centeredTitle: { fontSize: 48, fontWeight: 'bold', color: '#fff', textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12 },
  dotsWrap: { position: 'absolute', bottom: 100, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 6 },
  dotActive: { backgroundColor: '#fff', width: 16, height: 16 },
  btn: { position: 'absolute', bottom: 40, left: 0, right: 0, backgroundColor: '#0a84ff', paddingVertical: 14, borderRadius: 24, alignSelf: 'center', marginHorizontal: 40 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 18, textAlign: 'center' },
});