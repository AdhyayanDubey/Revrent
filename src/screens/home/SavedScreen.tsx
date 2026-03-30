import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppStore } from '../../store';

const SAVED_VEHICLES = [
  {
    id: '1',
    name: 'VanMoof S3',
    type: 'Electric • Large Frame',
    pricePerHour: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1571188654248-7a89213914f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.9,
  }
];

export default function SavedScreen({ navigation }: any) {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const themeColors = isDarkMode ? colors.background.dark : '#F9FAFB';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Saved Vehicles</Text>
      </View>
      
      {SAVED_VEHICLES.length > 0 ? (
        <FlatList
          data={SAVED_VEHICLES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: cardColor }]}
              onPress={() => navigation.navigate('Details', { vehicleId: item.id })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={[styles.vehicleName, { color: textColor }]}>{item.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={[styles.vehicleType, { color: secondaryTextColor }]}>{item.type}</Text>
                
                <View style={styles.footerRow}>
                  <Text style={[styles.priceText, { color: textColor }]}>
                    ₹{item.pricePerHour}<Text style={{ fontSize: 14, color: secondaryTextColor, fontWeight: 'normal' }}>/hr</Text>
                  </Text>
                  <TouchableOpacity style={styles.removeButton}>
                    <Ionicons name="bookmark" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={64} color={secondaryTextColor} />
          <Text style={[styles.emptyStateTitle, { color: textColor }]}>No saved vehicles</Text>
          <Text style={[styles.emptyStateDesc, { color: secondaryTextColor }]}>Vehicles you bookmark will appear here.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 4,
  },
  vehicleType: {
    fontSize: 13,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateDesc: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  }
});
