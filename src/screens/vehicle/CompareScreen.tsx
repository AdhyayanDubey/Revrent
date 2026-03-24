import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Vehicle } from '../../types';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

// Shared Mock Data from HomeScreen
const ALL_MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'VanMoof S3',
    type: 'Electric • Large Frame',
    rating: 4.9,
    tags: ['LIKE NEW', '25 KM RANGE', 'AVAILABLE'],
    pricePerHour: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1571188654248-7a89213914f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    speed: '32 km/h',
    range: '25',
    chargeTime: '2 hrs',
    batteryStatus: 100,
    location: '',
  },
  {
    id: '2',
    name: 'Ninebot Max G30',
    type: 'Electric Scooter • Long Range',
    rating: 4.8,
    tags: ['GOOD CONDITION', '40 KM RANGE', 'AVAILABLE'],
    pricePerHour: 650,
    imageUrl: 'https://images.unsplash.com/photo-1593950315186-76a92975b60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    speed: '30 km/h',
    range: '40',
    chargeTime: '4 hrs',
    batteryStatus: 85,
    location: '',
  },
  {
    id: '3',
    name: 'Schwinn Loop',
    type: 'Folding • Compact City',
    rating: 5.0,
    tags: ['EXCELLENT', 'MANUAL'],
    pricePerHour: 950,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    speed: '20', // Human powered avg
    range: 'Unlimited',
    chargeTime: 'N/A',
    batteryStatus: 100,
    location: '',
  },
];

type RootStackParamList = {
  Compare: { vehicle1?: Vehicle; vehicle2?: Vehicle; vehicles?: Vehicle[] };
  Reserve: { vehicleId: string; vehicle?: Vehicle };
};

type CompareScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Compare'>;

export default function CompareScreen({ route }: any) {
  const navigation = useNavigation<CompareScreenNavigationProp>();
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const themeColors = isDarkMode ? colors.background.dark : colors.background.light;

  const themeColorsDict = {
    background: themeColors,
    surface: isDarkMode ? colors.background.secondaryDark : colors.background.secondaryLight,
    text: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight,
    textSecondary: isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight,
    primary: colors.primary, 
    border: isDarkMode ? '#333333' : '#E0E0E0',
  };

  const [selectedVehicle1, setSelectedVehicle1] = React.useState<Vehicle>(route.params?.vehicles?.[0] || route.params?.vehicle1 || ALL_MOCK_VEHICLES[0]);
  const [selectedVehicle2, setSelectedVehicle2] = React.useState<Vehicle>(route.params?.vehicles?.[1] || route.params?.vehicle2 || ALL_MOCK_VEHICLES[1]);
  const [showVehiclePicker, setShowVehiclePicker] = React.useState<'left' | 'right' | null>(null);

  const renderProgress = (val: number, max: number, color: string) => {
    const percent = Math.min((val / max) * 100, 100);
    return (
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    );
  };

  const getSpeedValue = (val: string | number | undefined) => val ? val.toString().replace(/[^0-9.]/g, '') : '0';
  const getRangeValue = (val: string | number | undefined) => val ? val.toString().replace(/[^0-9.]/g, '') : '0';
  const getChargeTime = (val: string | undefined) => val || '---';

  const VehiclePickerModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Vehicle to Compare</Text>
          <TouchableOpacity onPress={() => setShowVehiclePicker(null)} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#1A1C29" />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ maxHeight: 400 }}>
          {ALL_MOCK_VEHICLES.map((v) => (
            <TouchableOpacity 
              key={v.id} 
              style={styles.pickerItem}
              onPress={() => {
                if (showVehiclePicker === 'left') setSelectedVehicle1(v);
                if (showVehiclePicker === 'right') setSelectedVehicle2(v);
                setShowVehiclePicker(null);
              }}
            >
              <Image source={{ uri: v.imageUrl }} style={styles.pickerImg} />
              <View style={styles.pickerInfo}>
                <Text style={styles.pickerName}>{v.name}</Text>
                <Text style={styles.pickerType}>{v.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={'#1A1C29'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comparison</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imagesRow}>
          <TouchableOpacity style={styles.vehicleColumn} onPress={() => setShowVehiclePicker('left')}>
            <View style={[styles.imageCard, { backgroundColor: '#F8F9FA' }]}>
              {selectedVehicle1.tags?.includes('AVAILABLE') && (
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>AV</Text>
                </View>
              )}
              <Image source={{ uri: selectedVehicle1.imageUrl }} style={styles.vehicleImage} resizeMode="contain" />
              <View style={styles.changeIcon}>
                <Ionicons name="swap-horizontal" size={16} color="#6B7280" />
              </View>
            </View>
            <Text style={styles.vehicleName} numberOfLines={1}>{selectedVehicle1.name}</Text>
            <Text style={styles.vehicleType}>{selectedVehicle1.type}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.vehicleColumn} onPress={() => setShowVehiclePicker('right')}>
            <View style={[styles.imageCard, { backgroundColor: '#F8F9FA' }]}>
              {selectedVehicle2.tags?.includes('AVAILABLE') && (
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>AV</Text>
                </View>
              )}
              <Image source={{ uri: selectedVehicle2.imageUrl }} style={styles.vehicleImage} resizeMode="contain" />
              <View style={styles.changeIcon}>
                <Ionicons name="swap-horizontal" size={16} color="#6B7280" />
              </View>
            </View>
            <Text style={styles.vehicleName} numberOfLines={1}>{selectedVehicle2.name}</Text>
            <Text style={styles.vehicleType}>{selectedVehicle2.type}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Hourly Rate */}
        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>HOURLY RATE</Text>
             <View style={styles.rowCenterBaseline}>
               <Text style={styles.statValueDark}>₹{selectedVehicle1.pricePerHour}</Text>
               <Text style={styles.statUnitDark}>/hr</Text>
             </View>
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>HOURLY RATE</Text>
             <View style={styles.rowCenterBaseline}>
               <Text style={styles.statValueBlue}>₹{selectedVehicle2.pricePerHour}</Text>
               <Text style={styles.statUnitDark}>/hr</Text>
               <MaterialCommunityIcons name="check-decagram-outline" size={18} color="#2A64F6" style={styles.checkIcon} />
             </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Top Speed */}
        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>TOP SPEED</Text>
             <View style={styles.rowCenterBaseline}>
               <Text style={styles.statValueDark}>{getSpeedValue(selectedVehicle1.speed)}</Text>
               <Text style={styles.statUnitDark}> km/h</Text>
             </View>
             {renderProgress(parseInt(getSpeedValue(selectedVehicle1.speed)), 100, '#E5E7EB')}
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>TOP SPEED</Text>
             <View style={styles.rowCenterBaseline}>
               <Text style={styles.statValueBlue}>{getSpeedValue(selectedVehicle2.speed)}</Text>
               <Text style={styles.statUnitDark}> km/h</Text>
             </View>
             {renderProgress(parseInt(getSpeedValue(selectedVehicle2.speed)), 100, '#2A64F6')}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Range */}
        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>RANGE</Text>
             <View style={styles.rowCenter}>
               <MaterialCommunityIcons name="battery" size={18} color="#9CA3AF" />
               <Text style={[styles.statValueDarkSecondary, { marginLeft: 4 }]}>{getRangeValue(selectedVehicle1.range)} km</Text>
             </View>
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>RANGE</Text>
             <View style={styles.rowCenter}>
               <MaterialCommunityIcons name="battery-charging" size={18} color="#2A64F6" />
               <Text style={[styles.statValueBlueSecondary, { marginLeft: 4 }]}>{getRangeValue(selectedVehicle2.range)} km</Text>
             </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Charge Time */}
        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>CHARGE TIME</Text>
             <View style={styles.rowCenter}>
               <MaterialCommunityIcons name="clock-outline" size={18} color="#9CA3AF" />
               <Text style={[styles.statValueDarkSecondary, { marginLeft: 4 }]}>{getChargeTime(selectedVehicle1.chargeTime)}</Text>
             </View>
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>CHARGE TIME</Text>
             <View style={styles.rowCenter}>
               <MaterialCommunityIcons name="clock-outline" size={18} color="#2A64F6" />
               <Text style={[styles.statValueBlueSecondary, { marginLeft: 4 }]}>{getChargeTime(selectedVehicle2.chargeTime)}</Text>
             </View>
          </View>
        </View>

        <View style={styles.actionRow}>
           <TouchableOpacity 
             style={styles.btnOutline}
             onPress={() => navigation.navigate('Reserve', { vehicleId: selectedVehicle1.id })}
           >
             <Text style={styles.btnOutlineText}>Book {selectedVehicle1.name.split(' ')[0]}</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={styles.btnSolid}
             onPress={() => navigation.navigate('Reserve', { vehicleId: selectedVehicle2.id })}
           >
             <Text style={styles.btnSolidText}>Book {selectedVehicle2.name.split(' ')[0]}</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>

      {showVehiclePicker && <VehiclePickerModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1C29',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleColumn: {
    width: '47%',
    alignItems: 'center',
  },
  imageCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: 20,
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 16,
    position: 'relative',
  },
  tagContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#E6FAF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: '#00B873',
    fontSize: 10,
    fontWeight: '700',
  },
  vehicleImage: {
    width: '90%',
    height: '90%',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C29',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#768196',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginVertical: 20,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  alignCenter: {
    alignItems: 'center',
    width: '45%',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA4B4',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  rowCenterBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValueDark: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  statValueBlue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3B82F6',
  },
  statValueDarkSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statValueBlueSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statUnitDark: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 2,
  },
  checkIcon: {
    marginLeft: 6,
    alignSelf: 'center',
  },
  progressTrack: {
    width: '80%',
    height: 6,
    backgroundColor: '#F0F2F5',
    borderRadius: 3,
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  btnOutline: {
    width: '47%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E2E6EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C29',
  },
  btnSolid: {
    width: '47%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10142A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolidText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changeIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C29',
  },
  closeBtn: {
    padding: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  pickerImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  pickerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  pickerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C29',
    marginBottom: 4,
  },
  pickerType: {
    fontSize: 13,
    color: '#6B7280',
  }
});
