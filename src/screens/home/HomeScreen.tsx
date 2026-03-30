import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Animated, ScrollView, Dimensions, Platform, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Vehicle } from '../../types';
import { Button } from '../../components/common/Button';
import { supabase } from '../../services/supabase';

// Mock data
const CATEGORIES = [
  { id: 'all', name: 'All Vehicles', icon: null },
  { id: 'ebikes', name: 'E-Bikes', icon: 'bicycle-outline' },
  { id: 'scooters', name: 'Scooters', icon: 'bicycle-outline' } 
];

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'VanMoof S3',
    type: 'Electric • Large Frame',
    rating: 4.9,
    tags: ['LIKE NEW', '25 KM RANGE'],
    pricePerHour: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1571188654248-7a89213914f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    speed: '32 km/h',
    range: '25 km range',
    batteryStatus: 100,
    location: '',
  },
  {
    id: '2',
    name: 'Ninebot Max G30',
    type: 'Electric Scooter • Long Range',
    rating: 4.8,
    tags: ['GOOD CONDITION', '40 KM RANGE'],
    pricePerHour: 650,
    imageUrl: 'https://images.unsplash.com/photo-1593950315186-76a92975b60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    speed: '30 km/h',
    range: '40 km range',
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
    speed: 'Manual',
    range: 'Manual',
    batteryStatus: 100,
    location: '',
  },
];

const VehicleCard = ({ vehicle, isDarkMode }: { vehicle: Vehicle, isDarkMode: boolean }) => {
  const navigation = useNavigation<any>();
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate('Details', { vehicleId: vehicle.id })}
        style={[styles.card, { backgroundColor: cardColor }]}
      >
        <Image style={styles.cardImage} source={{ uri: vehicle.imageUrl }} />
        
        {/* Top Badges overlayed on image */}
        <View style={styles.cardImageBadges}>
          <View style={[styles.badgePremium, { backgroundColor: vehicle.type.includes('Scooter') ? 'transparent' : '#111827' }]}>
            <Text style={styles.badgePremiumText}>{vehicle.type.includes('Scooter') ? '' : vehicle.id === '3' ? 'CLASSIC' : 'PREMIUM'}</Text>
          </View>
          <View style={styles.badgeRating}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.badgeRatingText}>{vehicle.rating}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: textColor }]}>{vehicle.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.priceAmount, { color: colors.primary }]}>₹{vehicle.pricePerHour}</Text>
              <Text style={[styles.priceUnit, { color: secondaryTextColor }]}>/hr</Text>
            </View>
          </View>
          <Text style={[styles.cardSubtitle, { color: secondaryTextColor }]}>{vehicle.type}</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {vehicle.tags?.map((tag, index) => (
              <View key={index} style={styles.tagWrapper}>
                <Ionicons name={tag.includes('RANGE') ? 'battery-charging' : 'checkmark-circle'} size={12} color="#4B5563" />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showNotificationModal, setShowNotificationModal] = React.useState(false);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(MOCK_VEHICLES);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Custom Filter State
  const [tempPriceRange, setTempPriceRange] = React.useState<[number, number]>([0, 2000]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 2000]);
  const [tempMinRating, setTempMinRating] = React.useState(0);
  const [minRating, setMinRating] = React.useState(0);

  const themeColors = isDarkMode ? colors.background.dark : '#F3F4F6';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';

  // Fetch real data from Supabase
  React.useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('is_available', true);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map DB columns to our Vehicle type
          const formattedVehicles: Vehicle[] = data.map(v => ({
            id: v.id,
            name: v.name,
            type: v.type,
            rating: v.rating,
            tags: v.tags || [],
            pricePerHour: v.price_per_hour,
            imageUrl: v.image_url,
            speed: v.speed,
            range: v.range,
            chargeTime: v.charge_time,
            batteryStatus: v.battery_status,
            location: v.location || '',
          }));
          setVehicles(formattedVehicles);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        // Fallback to mock data if it fails
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter(v => {
      // 1. Search Query Filter
      if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // 2. Category Filter
      let matchesCategory = true;
      if (activeCategory !== 'all') {
        matchesCategory = v.type.toLowerCase().includes(activeCategory);
      }
      
      // 3. Price Range Filter
      const withinPriceRange = v.pricePerHour >= priceRange[0] && v.pricePerHour <= priceRange[1];
      
      // 4. Rating Filter
      const meetsMinRating = v.rating >= minRating;
      
      return matchesCategory && withinPriceRange && meetsMinRating;
    });
  }, [vehicles, activeCategory, priceRange, minRating, searchQuery]);

  const handleApplyFilter = () => {
    setPriceRange(tempPriceRange);
    setMinRating(tempMinRating);
    setShowFilterModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors }]}>
      {/* Header Profile */}
      <View style={styles.topHeader}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileAvatar} 
          />
          <View style={styles.profileStatus} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.welcomeText}>WELCOME BACK</Text>
            <Text style={[styles.userNameText, { color: textColor }]}>Adhyayan Dubey</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn} onPress={() => setShowNotificationModal(true)}>
          <Ionicons name="notifications-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Where to next?"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="options-outline" size={20} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map(category => {
            const isActive = activeCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  { backgroundColor: isActive ? '#0B0F19' : '#FFFFFF', borderColor: '#F3F4F6', borderWidth: isActive ? 0 : 1 }
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                {category.icon && (
                  <Ionicons 
                    name={category.icon as any} 
                    size={16} 
                    color={isActive ? '#FFFFFF' : '#374151'} 
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[
                  styles.categoryText,
                  { color: isActive ? '#FFFFFF' : '#374151', fontWeight: isActive ? '600' : '500' }
                ]}>{category.name}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Vehicle List */}
      {isLoading ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VehicleCard vehicle={item} isDarkMode={isDarkMode} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={[styles.emptyTitle, { color: textColor }]}>No Vehicles Found</Text>
              <Text style={[styles.emptySubtitle, { color: secondaryTextColor }]}>Try adjusting your filters</Text>
            </View>
          )}
        />
      )}

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: themeColors, borderTopColor: isDarkMode ? '#374151' : '#F3F4F6' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Saved')}>
          <Ionicons name="heart-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Map')}>
          <Ionicons name="map-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Notifications Modal */}
      <Modal visible={showNotificationModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? colors.card.dark : '#FFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.notificationEmpty}>
              <Ionicons name="notifications-off-outline" size={48} color={secondaryTextColor} />
              <Text style={[styles.notificationEmptyText, { color: textColor }]}>No new notifications.</Text>
              <Text style={[styles.notificationEmptySubText, { color: secondaryTextColor }]}>You will see real-time updates here soon.</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter/Sort Modal */}
      <Modal visible={showFilterModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? colors.card.dark : '#FFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: textColor }]}>Sort By</Text>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={{ color: colors.primary }}>Price: Low to High</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={{ color: textColor }}>Price: High to Low</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={{ color: textColor }}>Rating: Highest First</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: textColor }]}>Vehicle Type</Text>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={{ color: colors.primary }}>Any Type</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={{ color: textColor }}>Electric Scooter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={{ color: textColor }}>Electric Bike</Text>
              </TouchableOpacity>
            </View>
            <Button title="Apply Filters" onPress={() => setShowFilterModal(false)} />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: 0,
    left: 36,
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },
  profileTextContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    height: '100%',
  },
  filterBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 32,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  cardImageBadges: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgePremium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgePremiumText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  badgeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeRatingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardContent: {
    padding: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#6B7280',
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    color: '#374151',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  notificationEmptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  notificationEmptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
