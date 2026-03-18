import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store';

type RootStackParamList = {
  Home: undefined;
  VendorDashboard: undefined;
  AddVehicle: undefined;
};

type VendorDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorDashboard'>;

const { width } = Dimensions.get('window');

export default function VendorDashboardScreen() {
  const navigation = useNavigation<VendorDashboardNavigationProp>();
  const isDarkMode = useAppStore(state => state.isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Profile Section */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.statusDot} />
            </View>
            <View>
              <Text style={styles.welcomeText}>WELCOME BACK</Text>
              <Text style={styles.nameText}>Alex Johnson</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1A1C29" />
          </TouchableOpacity>
        </View>

        {/* Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <View style={styles.growthBadge}>
              <Feather name="trending-up" size={14} color="#00B873" />
              <Text style={styles.growthText}> 5.2%</Text>
            </View>
          </View>
          <Text style={styles.revenueAmount}>₹8745</Text>
          {/* Mock Graph */}
          <View style={styles.graphContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/300x60.png?text=Graph' }} 
              style={styles.graphImage} 
              resizeMode="stretch"
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainerBlue}>
              <MaterialCommunityIcons name="scooter" size={20} color="#2A64F6" />
              <Text style={styles.statCardLabel}>Active Rides</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statSubValue}> / 42</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '60%', backgroundColor: '#2A64F6' }]} />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainerBlue, { backgroundColor: '#F4F0FF' }]}>
              <Ionicons name="bookmark-outline" size={20} color="#8A2BE2" />
              <Text style={styles.statCardLabel}>Bookings</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>142</Text>
              <Text style={[styles.statSubValue, { color: '#00B873' }]}> +12</Text>
            </View>
            {/* Small Graph */}
            <View style={{ height: 20, marginTop: 8 }}>
               <Image source={{ uri: 'https://via.placeholder.com/100x20.png?text=MiniGraph' }} style={{width: '100%', height: '100%'}} />
            </View>
          </View>
        </View>

        {/* Add New Vehicle Button */}
        <TouchableOpacity style={styles.addVehicleBtn}>
          <Ionicons name="add-circle-outline" size={24} color="#FFF" />
          <Text style={styles.addVehicleBtnText}>Add New Vehicle</Text>
        </TouchableOpacity>

        {/* Fleet Status Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fleet Status</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Fleet Item 1 */}
        <View style={styles.fleetItem}>
          <View style={styles.fleetItemLeft}>
            <View style={styles.fleetImageCard}>
              <Image source={{ uri: 'https://via.placeholder.com/100.png?text=Segway' }} style={styles.fleetImage} />
            </View>
            <View>
              <Text style={styles.fleetName}>Segway Max G30</Text>
              <View style={styles.fleetDetailsRow}>
                <Text style={styles.fleetId}>ID: #8291</Text>
                <View style={styles.dotSeparator} />
                <MaterialCommunityIcons name="battery-charging-outline" size={14} color="#00B873" />
                <Text style={[styles.fleetBattery, { color: '#00B873' }]}>85%</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#F0F5FF' }]}>
            <Text style={[styles.statusBadgeText, { color: '#2A64F6' }]}>Rented</Text>
          </View>
        </View>

        {/* Fleet Item 2 */}
        <View style={styles.fleetItem}>
          <View style={styles.fleetItemLeft}>
            <View style={styles.fleetImageCard}>
              <Image source={{ uri: 'https://via.placeholder.com/100.png?text=Niu' }} style={styles.fleetImage} />
            </View>
            <View>
              <Text style={styles.fleetName}>Niu NQi Sport</Text>
              <View style={styles.fleetDetailsRow}>
                <Text style={styles.fleetId}>ID: #4421</Text>
                <View style={styles.dotSeparator} />
                <MaterialCommunityIcons name="battery-outline" size={14} color="#FF6B00" />
                <Text style={[styles.fleetBattery, { color: '#FF6B00' }]}>12%</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#FFF4EB' }]}>
            <Text style={[styles.statusBadgeText, { color: '#FF6B00' }]}>Charging</Text>
          </View>
        </View>

        {/* Fleet Item 3 */}
        <View style={styles.fleetItem}>
          <View style={styles.fleetItemLeft}>
            <View style={styles.fleetImageCard}>
              <Image source={{ uri: 'https://via.placeholder.com/100.png?text=VanMoof' }} style={styles.fleetImage} />
            </View>
            <View>
              <Text style={styles.fleetName}>VanMoof S3</Text>
              <View style={styles.fleetDetailsRow}>
                <Text style={styles.fleetId}>ID: #9902</Text>
                <View style={styles.dotSeparator} />
                <MaterialCommunityIcons name="battery" size={14} color="#00B873" />
                <Text style={[styles.fleetBattery, { color: '#00B873' }]}>100%</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#E6FAF1' }]}>
            <Text style={[styles.statusBadgeText, { color: '#00B873' }]}>Available</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="view-dashboard" size={24} color="#2A64F6" />
          <Text style={[styles.navText, { color: '#2A64F6' }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="moped" size={24} color="#9CA4B4" />
          <Text style={styles.navText}>Fleet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="map-outline" size={24} color="#9CA4B4" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#9CA4B4" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100, // accommodate bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8292A1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00B873',
    borderWidth: 2,
    borderColor: '#F8F9FA',
  },
  welcomeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#768196',
    letterSpacing: 1,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C29',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  revenueLabel: {
    fontSize: 14,
    color: '#768196',
    fontWeight: '600',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FAF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growthText: {
    color: '#00B873',
    fontSize: 12,
    fontWeight: '700',
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1C29',
    marginBottom: 16,
  },
  graphContainer: {
    height: 60,
    width: '100%',
    overflow: 'hidden',
  },
  graphImage: {
    width: '100%',
    height: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statIconContainerBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  statCardLabel: {
    fontSize: 12,
    color: '#768196',
    fontWeight: '600',
    marginLeft: 6,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1C29',
  },
  statSubValue: {
    fontSize: 12,
    color: '#9CA4B4',
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F2F5',
    borderRadius: 3,
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  addVehicleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A64F6',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  addVehicleBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C29',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2A64F6',
    fontWeight: '600',
  },
  fleetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  fleetItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fleetImageCard: {
    width: 60,
    height: 60,
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  fleetImage: {
    width: '100%',
    height: '100%',
  },
  fleetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C29',
    marginBottom: 4,
  },
  fleetDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fleetId: {
    fontSize: 12,
    color: '#768196',
    fontWeight: '500',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4D8E2',
    marginHorizontal: 6,
  },
  fleetBattery: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingBottom: 32, // for safe area
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  }
});
