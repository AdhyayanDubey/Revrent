import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppStore } from '../../store';

const { width, height } = Dimensions.get('window');

const MAP_MARKERS = [
  { id: '1', name: 'VanMoof S3', price: '₹1250/hr', type: 'electric' },
  { id: '2', name: 'Ninebot Max', price: '₹650/hr', type: 'scooter' },
  { id: '3', name: 'Schwinn Loop', price: '₹950/hr', type: 'folding' }
];

export default function MapScreen({ navigation }: any) {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const themeColors = isDarkMode ? colors.background.dark : '#F9FAFB';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';

  // Fake map placeholder since react-native-maps needs native setup
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Nearby Vehicles</Text>
      </View>
      
      <View style={[styles.mapPlaceholder, { backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0' }]}>
        <View style={styles.mapGrid} />
        <Ionicons name="map-outline" size={64} color={secondaryTextColor} style={{ opacity: 0.5 }} />
        <Text style={[styles.mapText, { color: secondaryTextColor }]}>Map View Placeholder</Text>
        
        {/* Fake Markers */}
        <View style={[styles.marker, { top: '30%', left: '20%' }]}>
          <Ionicons name="location" size={32} color={colors.primary} />
        </View>
        <View style={[styles.marker, { top: '50%', right: '30%' }]}>
          <Ionicons name="location" size={32} color={colors.primary} />
        </View>
        <View style={[styles.marker, { bottom: '20%', left: '40%' }]}>
          <Ionicons name="location" size={32} color={colors.primary} />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {MAP_MARKERS.map(marker => (
            <TouchableOpacity 
              key={marker.id} 
              style={[styles.markerCard, { backgroundColor: cardColor }]}
              onPress={() => navigation.navigate('Details', { vehicleId: marker.id })}
            >
              <View style={styles.markerIconContainer}>
                <Ionicons name="bicycle" size={24} color={colors.primary} />
              </View>
              <View style={styles.markerCardContent}>
                <Text style={[styles.markerName, { color: textColor }]}>{marker.name}</Text>
                <Text style={[styles.markerPrice, { color: colors.primary }]}>{marker.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'dashed',
  },
  mapText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  markerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
  },
  markerIconContainer: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  markerCardContent: {
    flex: 1,
  },
  markerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  markerPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  }
});
