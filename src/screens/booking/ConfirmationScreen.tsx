import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Button } from '../../components/common/Button';
import * as Haptics from 'expo-haptics';

export default function ConfirmationScreen() {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();
  
  const themeColors = isDarkMode ? colors.background.dark : colors.background.light;
  const textColor = isDarkMode ? colors.text.primaryDark : colors.text.primaryLight;
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight;
  const cardColor = isDarkMode ? colors.card.dark : colors.card.light;

  // Animation values
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 15,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleGetDirections = () => {
    // Navigate to map/navigation flow
    console.log('Get directions logic');
  };

  const handleBackToHome = () => {
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors }]}>
      <View style={styles.successContainer}>
        <Animated.View style={[
          styles.checkCircle,
          { 
            backgroundColor: colors.success,
            transform: [{ scale: scaleValue }],
            opacity: opacityValue
          }
        ]}>
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>
        
        <Animated.View style={[styles.textContent, { opacity: opacityValue }]}>
          <Text style={[styles.title, { color: textColor }]}>Booking Confirmed!</Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
            Your vehicle has been reserved successfully.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.detailsContainer, { opacity: opacityValue }]}>
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Vehicle</Text>
            <Text style={[styles.detailValue, { color: textColor }]}>Rev-S1 Pro</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Booking ID</Text>
            <Text style={[styles.detailValue, { color: textColor }]}>#RR-84920</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>Token Paid</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>₹30.00</Text>
          </View>
        </View>

        <View style={styles.locationSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Pickup Location</Text>
          <View style={[styles.mapPlaceholder, { backgroundColor: cardColor }]}>
            <Text style={{ color: secondaryTextColor }}>Map Preview Centered on Vehicle</Text>
          </View>
          <Text style={[styles.addressText, { color: textColor }]}>Connaught Place, Block A, New Delhi</Text>
          <Text style={[styles.distanceText, { color: secondaryTextColor }]}>1.2 km away • 15 min walk</Text>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            title="Get Directions" 
            onPress={handleGetDirections} 
            style={styles.primaryButton}
          />
          <Button 
            title="Back to Home" 
            variant="outline"
            onPress={handleBackToHome} 
            style={styles.secondaryButton}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 50,
    fontWeight: 'bold',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  card: {
    borderRadius: borderRadius.m,
    padding: spacing.l,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    ...typography.body,
  },
  detailValue: {
    ...typography.h3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150,150,150,0.2)',
    marginVertical: spacing.s,
  },
  locationSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.m,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  addressText: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  distanceText: {
    ...typography.body,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: spacing.m,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: borderRadius.m,
    height: 56,
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
