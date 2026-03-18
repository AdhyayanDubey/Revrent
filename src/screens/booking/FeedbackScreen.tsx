import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAppStore } from '../../store';
import { Button } from '../../components/common/Button';

const RATING_TAGS = [
  'Smooth Ride', 
  'Clean Vehicle', 
  'Good Battery', 
  'Easy Pickup',
  'Issues with brakes',
  'Damaged parts'
];

export default function FeedbackScreen() {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();
  
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const themeColors = isDarkMode ? colors.background.dark : colors.background.light;
  const textColor = isDarkMode ? colors.text.primaryDark : colors.text.primaryLight;
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight;
  const cardColor = isDarkMode ? colors.card.dark : colors.card.light;

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
    <View style={[styles.container, { backgroundColor: themeColors }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 24, color: textColor }}>×</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Rate your ride</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
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
              <Text style={[
                styles.star, 
                { color: star <= rating ? colors.warning : (isDarkMode ? colors.border.dark : '#E0E0E0') }
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tags */}
        {rating > 0 && (
          <View style={styles.tagsSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>What went well?</Text>
            <View style={styles.tagsContainer}>
              {RATING_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      { 
                        backgroundColor: isSelected ? colors.primary : cardColor,
                        borderColor: isSelected ? colors.primary : (isDarkMode ? colors.border.dark : colors.border.light)
                      }
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagText,
                      { color: isSelected ? '#FFF' : textColor }
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Comment Input */}
        <View style={styles.commentSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Additional comments</Text>
          <TextInput
            style={[
              styles.textInput, 
              { 
                backgroundColor: cardColor,
                color: textColor,
                borderColor: isDarkMode ? colors.border.dark : colors.border.light
              }
            ]}
            placeholder="Tell us more about your experience..."
            placeholderTextColor={secondaryTextColor}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        {/* Photo Upload */}
        <View style={styles.uploadSection}>
          <TouchableOpacity 
            style={[
              styles.uploadArea, 
              { 
                backgroundColor: cardColor,
                borderColor: isDarkMode ? colors.border.dark : colors.border.light,
                borderStyle: 'dashed'
              }
            ]}
          >
            <Text style={styles.uploadIcon}>📸</Text>
            <Text style={[styles.uploadText, { color: textColor }]}>Add Photos / Videos</Text>
            <Text style={[styles.uploadSubtext, { color: secondaryTextColor }]}>Optional</Text>
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
  star: {
    fontSize: 48,
  },
  tagsSection: {
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
  textInput: {
    width: '100%',
    padding: spacing.m,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    minHeight: 100,
  },
  uploadSection: {
    marginBottom: spacing.xl,
  },
  uploadArea: {
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
