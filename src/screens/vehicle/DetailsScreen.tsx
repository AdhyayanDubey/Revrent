import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Button } from '../../components/common/Button';
import { Vehicle } from '../../types';

// Temporarily using mock data to resolve vehicle (would typically come from API/Store)
const mockVehicle: Vehicle = {
  id: '1',
  name: 'Rev-S1 Pro',
  type: 'Scooter',
  rating: 4.8,
  tags: ['Smooth ride', 'Long range'],
  pricePerHour: 15,
  imageUrl: 'scooter-1',
  speed: '25 km/h',
  range: '40 km',
  batteryStatus: 85,
  location: '1.2 km away',
};

export default function DetailsScreen() {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { vehicleId } = route.params || {};

  // Find vehicle by ID logic goes here
  const vehicle = mockVehicle;

  const themeColors = isDarkMode ? colors.background.dark : colors.background.light;
  const textColor = isDarkMode ? colors.text.primaryDark : colors.text.primaryLight;
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight;
  const cardColor = isDarkMode ? colors.card.dark : colors.card.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image Area */}
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 24, color: textColor }}>←</Text>
          </TouchableOpacity>
          <View style={[styles.placeholderImage, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E5EA' }]}>
            <Text style={{ color: secondaryTextColor, fontSize: 24 }}>Vehicle Image</Text>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: textColor }]}>{vehicle.name}</Text>
              <Text style={[styles.location, { color: secondaryTextColor }]}>📍 {vehicle.location}</Text>
            </View>
            <View style={[styles.ratingBadge, { backgroundColor: cardColor }]}>
              <Text style={styles.star}>★</Text>
              <Text style={[styles.rating, { color: textColor }]}>{vehicle.rating}</Text>
            </View>
          </View>

          {/* Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={[styles.specCard, { backgroundColor: cardColor }]}>
              <Text style={styles.specIcon}>⚡</Text>
              <Text style={[styles.specValue, { color: textColor }]}>{vehicle.speed}</Text>
              <Text style={[styles.specLabel, { color: secondaryTextColor }]}>Top Speed</Text>
            </View>
            <View style={[styles.specCard, { backgroundColor: cardColor }]}>
              <Text style={styles.specIcon}>🔋</Text>
              <Text style={[styles.specValue, { color: textColor }]}>{vehicle.batteryStatus}%</Text>
              <Text style={[styles.specLabel, { color: secondaryTextColor }]}>Battery</Text>
            </View>
            <View style={[styles.specCard, { backgroundColor: cardColor }]}>
              <Text style={styles.specIcon}>🛣️</Text>
              <Text style={[styles.specValue, { color: textColor }]}>{vehicle.range}</Text>
              <Text style={[styles.specLabel, { color: secondaryTextColor }]}>Range</Text>
            </View>
          </View>

          {/* Features/Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Features</Text>
            <View style={styles.tagsContainer}>
              {vehicle.tags.map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7' }]}>
                  <Text style={[styles.tagText, { color: textColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Map Preview Placeholder */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Location</Text>
            <View style={[styles.mapPlaceholder, { backgroundColor: cardColor }]}>
              <Text style={{ color: secondaryTextColor }}>Map Preview</Text>
            </View>
          </View>

          {/* Padding for bottom bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={[styles.bottomBar, { 
        backgroundColor: themeColors,
        borderTopColor: isDarkMode ? colors.border.dark : colors.border.light 
      }]}>
        <View>
          <Text style={[styles.priceAmount, { color: textColor }]}>₹{vehicle.pricePerHour}<Text style={[styles.priceUnit, { color: secondaryTextColor }]}>/hr</Text></Text>
        </View>
        <Button 
          title="Reserve Now" 
          onPress={() => navigation.navigate('Reserve', { vehicleId: vehicle.id })} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.l,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: spacing.l,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  location: {
    ...typography.body,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.round,
  },
  star: {
    color: colors.warning,
    marginRight: 4,
  },
  rating: {
    ...typography.h3,
  },
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.m,
    marginBottom: spacing.xl,
  },
  specCard: {
    flex: 1,
    padding: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
  },
  specIcon: {
    fontSize: 24,
    marginBottom: spacing.s,
  },
  specValue: {
    ...typography.h3,
    marginBottom: 2,
  },
  specLabel: {
    ...typography.caption,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.m,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  tag: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.round,
  },
  tagText: {
    ...typography.body,
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.m,
    borderTopWidth: 1,
  },
  priceAmount: {
    ...typography.h1,
    color: colors.primary,
  },
  priceUnit: {
    ...typography.body,
  },
});
