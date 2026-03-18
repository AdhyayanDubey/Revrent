import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppStore } from '../../store';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  
  const themeColors = isDarkMode ? colors.background.dark : '#F9FAFB';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  const navigation = useNavigation<any>();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    ]).start();

    // Navigate to Auth flow after delay
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: themeColors }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="bicycle" size={48} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </View>
        <Text style={[styles.title, { color: textColor }]}>RevRent</Text>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>RIDE THE FUTURE</Text>
      </Animated.View>
      
      <View style={styles.loaderContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: height * 0.1, // Offset slightly upwards to make room for loader
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  iconBackground: {
    width: 96,
    height: 96,
    backgroundColor: '#1E40AF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#F3F4F6', // using background color to match border
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6B7280',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: height * 0.2, // Position loader at bottom 20%
    width: width * 0.6,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
});