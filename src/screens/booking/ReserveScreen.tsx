import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Button } from '../../components/common/Button';
import { supabase } from '../../services/supabase';

export default function ReserveScreen() {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAppStore(state => state.user);
  
  const [timeLeft, setTimeLeft] = useState(599); // 9:59 in seconds
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const themeColors = isDarkMode ? colors.background.dark : '#FFFFFF';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';

  const { vehicle } = route.params || {};

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to reserve a vehicle.');
      navigation.navigate('Login');
      return;
    }

    if (!vehicle) {
      Alert.alert('Error', 'No vehicle selected.');
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate total price (just hold fee for now, but usually would include daily rate * days)
      const totalPrice = 30; // Token hold fee

      // Create booking in Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          vehicle_id: vehicle.id,
          start_date: new Date().toISOString(), // In a real app, these would be selected dates
          end_date: new Date(Date.now() + 86400000).toISOString(), // +1 day
          total_price: totalPrice,
          status: 'pending' // Should update to confirmed after real payment
        })
        .select()
        .single();

      if (error) throw error;

      // Update vehicle status
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ available: false })
        .eq('id', vehicle.id);
        
      if (vehicleError) throw vehicleError;

      navigation.navigate('Confirmation', { booking: data, vehicle });
    } catch (error: any) {
      Alert.alert('Booking Error', error.message || 'Failed to complete reservation.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isProcessing}
        >
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Reserve Vehicle</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Timer Section */}
        <View style={styles.timerWrapper}>
          <View style={styles.timerCircleOuter}>
            <View style={styles.timerCircleInner}>
              <Text style={[styles.timerText, { color: textColor }]}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={styles.timerSubtitle}>REMAINING</Text>
            </View>
          </View>
          
          <Text style={[styles.timerNote, { color: secondaryTextColor }]}>
            Complete payment to hold this{'\n'}vehicle for 15 mins.
          </Text>
        </View>

        {vehicle && (
            <View style={[styles.vehicleInfoCard, { backgroundColor: cardColor, borderColor: '#E5E7EB' }]}>
                <Text style={[styles.vehicleInfoTitle, { color: textColor }]}>{vehicle.make} {vehicle.model}</Text>
                <Text style={[styles.vehicleInfoSubtitle, { color: secondaryTextColor }]}>{vehicle.year}</Text>
            </View>
        )}

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={[styles.amountText, { color: textColor }]}>₹30.00</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Token Hold Fee</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#2563EB" style={styles.infoIcon} />
            <Text style={[styles.infoTitle, { color: textColor }]}>Why a hold fee?</Text>
          </View>
          <Text style={[styles.infoDesc, { color: secondaryTextColor }]}>
            This small fee reserves the scooter exclusively for you. The amount is automatically adjusted in your final ride bill.
          </Text>
        </View>

        {/* Payment Method Card */}
        <View style={[styles.paymentMethodCard, { backgroundColor: cardColor, borderColor: '#E5E7EB' }]}>
          <View style={styles.paymentMethodLeft}>
            <View style={styles.cardIconDummy}>
              <View style={[styles.cardDot, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.cardDot, { backgroundColor: '#F79E1B', marginLeft: -6 }]} />
            </View>
            <View>
              <Text style={[styles.paymentMethodTitle, { color: textColor }]}>Mastercard •••• 4242</Text>
              <Text style={[styles.paymentMethodSubtitle, { color: secondaryTextColor }]}>Personal</Text>
            </View>
          </View>
          <TouchableOpacity disabled={isProcessing}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={[styles.bottomBar, { 
        backgroundColor: themeColors,
        borderTopColor: '#F3F4F6',
      }]}>
        <Button 
          title={isProcessing ? "Processing..." : "Pay ₹30 & Hold →"} 
          onPress={handlePayment} 
          style={styles.payButton}
          disabled={isProcessing}
        />
        <View style={styles.secureContainer}>
          <Ionicons name="lock-closed-outline" size={12} color="#9CA3AF" />
          <Text style={styles.secureText}>Secure Payment Encrypted</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  timerWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginTop: 4,
  },
  timerNote: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  vehicleInfoCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
  },
  vehicleInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  vehicleInfoSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoDesc: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 32,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 24,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconDummy: {
    flexDirection: 'row',
    width: 40,
    height: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
  },
  changeText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  payButton: {
    marginBottom: 16,
    height: 56,
  },
  secureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
});
