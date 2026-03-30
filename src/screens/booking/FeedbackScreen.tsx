import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Button } from '../../components/common/Button';

export default function FeedbackScreen() {
  const navigation = useNavigation<any>();
  const isDarkMode = useAppStore(state => state.isDarkMode);
  
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    // Submit feedback logic
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? colors.background.dark : colors.background.light }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 24, color: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight }}>×</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight }]}>Rate your ride</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.subtitle, { color: isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight }]}>
          How was your experience with Rev-S1 Pro?
        </Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => setRating(star)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={40} 
                style={[
                styles.starIcon,
                { color: star <= rating ? colors.warning : (isDarkMode ? '#374151' : '#E0E0E0') }
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <View style={styles.reviewContent}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight }]}>What stood out?</Text>
            <View style={styles.tagsContainer}>
              {['Cleanliness', 'Condition', 'Pickup Location', 'Battery Life', 'Communication'].map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      { 
                        backgroundColor: isSelected ? `${colors.primary}10` : (isDarkMode ? colors.background.dark : '#F3F4F6'),
                        borderColor: isSelected ? colors.primary : (isDarkMode ? '#374151' : '#E5E7EB')
                      }
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagText,
                      { color: isSelected ? colors.primary : (isDarkMode ? colors.text.primaryDark : colors.text.primaryLight) }
                    ]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight }]}>Additional Comments</Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                backgroundColor: isDarkMode ? colors.background.dark : '#F9FAFB',
                color: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight,
                borderColor: isDarkMode ? '#374151' : '#D1D5DB'
                }
              ]}
              placeholder="Tell us what you liked or what could be improved..."
              placeholderTextColor={isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight}
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Photo Upload */}
        <View style={styles.uploadSection}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight }]}>Add Media</Text>
          <TouchableOpacity style={[
                styles.uploadButton,
                { 
                backgroundColor: isDarkMode ? colors.background.dark : '#F9FAFB',
                borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                }
              ]}>
            <Text style={styles.uploadIcon}>📸</Text>
            <Text style={[styles.uploadText, { color: isDarkMode ? colors.text.primaryDark : colors.text.primaryLight }]}>Add Photos / Videos</Text>
            <Text style={[styles.uploadSubtext, { color: isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight }]}>Optional</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { 
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
      }]}>
        <Button 
          title="Submit Feedback" 
          onPress={handleSubmit} 
          disabled={rating === 0}
          style={styles.submitButton}
        />
      </View>
    </SafeAreaView>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
  },
  content: {
    padding: spacing.l,
    paddingBottom: 100, // padding for bottom bar
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.m,
    marginBottom: spacing.xl,
  },
  starIcon: {
    color: colors.warning,
  },
  reviewContent: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.m,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  tag: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.s,
    borderWidth: 1,
  },
  tagText: {
    ...typography.body,
  },
  commentSection: {
    marginBottom: spacing.xl,
  },
  textArea: {
    width: '100%',
    padding: spacing.m,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    minHeight: 100,
  },
  uploadSection: {
    marginBottom: spacing.xl,
  },
  uploadButton: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: spacing.s,
  },
  uploadText: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  uploadSubtext: {
    fontSize: 12,
  },
  bottomBar: {
    padding: spacing.l,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.l,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: borderRadius.m,
    height: 56,
  },
});
