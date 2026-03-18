import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Animated, ScrollView, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Vehicle } from '../../types';
import { Button } from '../../components/common/Button';

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
          <Text style={[styles.vehicleName, { color: textColor }]}>{vehicle.name}</Text>
          <Text style={[styles.vehicleType, { color: secondaryTextColor }]}>{vehicle.type}</Text>
          
          <View style={styles.tagsContainer}>
            {vehicle.tags.map((tag, idx) => (
              <View key={tag} style={[styles.tag, { backgroundColor: '#F3F4F6', marginLeft: idx > 0 ? 8 : 0 }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={[styles.priceTitle, { color: '#9CA3AF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }]}>RATE</Text>
              <Text style={[styles.priceAmount, { color: textColor, fontSize: 24, fontWeight: 'bold' }]}>₹{vehicle.pricePerHour.toLocaleString()}<Text style={[styles.priceUnit, { color: secondaryTextColor, fontSize: 14, fontWeight: 'normal' }]}> /hr</Text></Text>
            </View>
            <TouchableOpacity 
              style={styles.reserveButton}
              onPress={() => navigation.navigate('Reserve', { vehicleId: vehicle.id })}
            >
              <Text style={styles.reserveButtonText}>Reserve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const themeColors = isDarkMode ? colors.background.dark : '#F9FAFB';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

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
        <TouchableOpacity style={styles.notificationBtn}>
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
          <TouchableOpacity style={styles.filterBtn}>
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

      {/* Vehicles List */}
      <FlatList
        data={MOCK_VEHICLES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <VehicleCard vehicle={item} isDarkMode={isDarkMode} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: themeColors, borderTopColor: isDarkMode ? '#374151' : '#F3F4F6' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="home" size={24} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="heart-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="map-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
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
  vehicleName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceTitle: {},
  priceAmount: {},
  priceUnit: {},
  reserveButton: {
    backgroundColor: '#0B0F19',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  reserveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 84 : 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navItem: {
    padding: 10,
  },
});
