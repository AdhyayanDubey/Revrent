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

// Mock data for the second vehicle to compare if only one is passed
const mockVehicle1: Vehicle = {
  id: 'v1',
  name: 'Vespa Elettrica',
  type: 'SCOOTER CLASS',
  rating: 4.7,
  tags: ['AVAILABLE'],
  pricePerHour: 350,
  imageUrl: 'https://via.placeholder.com/300x200.png?text=Vespa',
  speed: '70',
  range: '100',
  chargeTime: '4 hrs',
  batteryStatus: 95,
  location: '0,0'
};

const mockVehicle2: Vehicle = {
  id: 'v2',
  name: 'Revolt RV400',
  type: 'BIKE CLASS',
  rating: 4.5,
  tags: [],
  pricePerHour: 280,
  imageUrl: 'https://via.placeholder.com/300x200.png?text=Revolt',
  speed: '85',
  range: '150',
  chargeTime: '4.5 hrs',
  batteryStatus: 80,
  location: '0,0'
};

type RootStackParamList = {
  Compare: { vehicle1: Vehicle; vehicle2?: Vehicle };
  Reserve: { vehicle: Vehicle };
};

type CompareScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Compare'>;

export default function CompareScreen({ route }: any) {
  const navigation = useNavigation<CompareScreenNavigationProp>();
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const themeColors = isDarkMode ? colors.background.dark : colors.background.light;

  const themeColorsDict = {
    background: isDarkMode ? colors.background.dark : colors.background.light,
    surface: isDarkMode ? colors.background.secondaryDark : colors.background.secondaryLight,
    text: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight,
    textSecondary: isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight,
    primary: colors.primary, // Changed from primary.main
    border: isDarkMode ? colors.border.dark : colors.border.light,
  };

  const vehicle1: Vehicle = route.params?.vehicle1 || mockVehicle1;
  const vehicle2: Vehicle = route.params?.vehicle2 || mockVehicle2;

  const renderProgress = (val: number, max: number, color: string) => {
    const percent = Math.min((val / max) * 100, 100);
    return (
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={'#1A1C29'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comparison</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imagesRow}>
          <View style={styles.vehicleColumn}>
            <View style={styles.imageCard}>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>AV</Text>
              </View>
              <Image source={{ uri: vehicle1.imageUrl }} style={styles.vehicleImage} resizeMode="contain" />
            </View>
            <Text style={styles.vehicleName} numberOfLines={1}>{vehicle1.name}</Text>
            <Text style={styles.vehicleType}>{vehicle1.type}</Text>
          </View>

          <View style={styles.vehicleColumn}>
            <View style={styles.imageCard}>
              <Image source={{ uri: vehicle2.imageUrl }} style={styles.vehicleImage} resizeMode="contain" />
            </View>
            <Text style={styles.vehicleName} numberOfLines={1}>{vehicle2.name}</Text>
            <Text style={styles.vehicleType}>{vehicle2.type}</Text>
          </View>
        </View>

        <View style={styles.specsDivider} />

        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>HOURLY RATE</Text>
             <Text style={styles.statValueDark}>₹{vehicle1.pricePerHour}<Text style={styles.statUnitDark}>/hr</Text></Text>
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>HOURLY RATE</Text>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Text style={styles.statValueBlue}>₹{vehicle2.pricePerHour}<Text style={styles.statUnitDark}>/hr</Text></Text>
               <MaterialCommunityIcons name="check-decagram-outline" size={18} color="#2A64F6" style={{ marginLeft: 4, position: 'absolute', right: -25, top: 4 }} />
             </View>
          </View>
        </View>

        <View style={styles.specsDividerSmall} />

        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>TOP SPEED</Text>
             <Text style={styles.statValueDark}>{vehicle1.speed} <Text style={styles.statUnitDark}>km/h</Text></Text>
             {renderProgress(70, 100, '#D4D8E2')}
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>TOP SPEED</Text>
             <Text style={styles.statValueBlue}>{vehicle2.speed} <Text style={styles.statUnitDark}>km/h</Text></Text>
             {renderProgress(85, 100, '#2A64F6')}
          </View>
        </View>

        <View style={styles.specsDividerSmall} />

        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>RANGE</Text>
             <View style={styles.rowCenter}>
               <MaterialCommunityIcons name="battery" size={16} color="#B3B8C8" />
               <Text style={[styles.statValueDark, { fontSize: 18, marginLeft: 4 }]}>{vehicle1.range} km</Text>
             </View>
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>RANGE</Text>
             <View style={styles.rowCenter}>
                <MaterialCommunityIcons name="battery-charging" size={16} color="#2A64F6" />
               <Text style={[styles.statValueBlue, { fontSize: 18, marginLeft: 4 }]}>{vehicle2.range} km</Text>
             </View>
          </View>
        </View>
        
        <View style={styles.specsDividerSmall} />

        <View style={styles.comparisonRow}>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>CHARGE TIME</Text>
             <Text style={[styles.statValueBlue, { fontSize: 18 }]}>{vehicle1.chargeTime}</Text>
          </View>
          <View style={styles.alignCenter}>
             <Text style={styles.statLabel}>CHARGE TIME</Text>
             <Text style={[styles.statValueDark, { fontSize: 18 }]}>{vehicle2.chargeTime}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
           <TouchableOpacity style={styles.btnOutline}>
             <Text style={styles.btnOutlineText}>Book Vespa</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.btnSolid}>
             <Text style={styles.btnSolidText}>Book Revolt</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>
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
  specsDivider: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginVertical: 30,
  },
  specsDividerSmall: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginVertical: 20,
    marginHorizontal: 10,
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
    fontWeight: '600',
    color: '#9CA4B4',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  statValueDark: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1C29',
  },
  statValueBlue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2A64F6',
  },
  statUnitDark: {
    fontSize: 14,
    fontWeight: '600',
    color: '#768196',
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
  }
});
