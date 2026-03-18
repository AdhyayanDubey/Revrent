import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Button } from '../../components/common/Button';

export default function ReserveScreen() {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const [timeLeft, setTimeLeft] = useState(599); // 9:59 in seconds
  const [selectedPayment, setSelectedPayment] = useState('card');

  const themeColors = isDarkMode ? colors.background.dark : '#FFFFFF';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';

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

  const handlePayment = () => {
    navigation.navigate('Confirmation');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
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
          <TouchableOpacity>
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
          title="Pay ₹30 & Hold →" 
          onPress={handlePayment} 
          style={styles.payButton}
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
    alignItems: 'center',
  },
  timerWrapper: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  timerCircleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  timerCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: -1,
  },
  timerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 1,
  },
  timerNote: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountText: {
    fontSize: 56,
    fontWeight: 'bold',
    letterSpacing: -2,
    marginBottom: 12,
  },
  badgeContainer: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
    backgroundColor: '#DBEAFE',
    padding: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoDesc: {
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 42, // align with text
  },
  paymentMethodCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconDummy: {
    width: 40,
    height: 28,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
  },
  changeText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
  },
  payButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 16,
    marginBottom: 16,
  },
  secureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secureText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 6,
  },
});
