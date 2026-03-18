// src/components/common/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  StyleProp,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.text.secondaryLight;
    switch (variant) {
      case 'primary':
        return '#1D4ED8'; // Hardcoded fix to force strictly blue instead of whatever colors.primary mapped to (which seems to be red)
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.secondaryDark;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF'; // Explicit white text
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return colors.text.primaryDark;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? colors.text.secondaryLight : colors.primary;
    }
    return 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.s, paddingHorizontal: spacing.m };
      case 'medium':
        return { paddingVertical: 14, paddingHorizontal: spacing.l }; // Increased vertical padding for better text visibility
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: spacing.xl }; // Increased vertical padding for better text visibility
      default:
        return { paddingVertical: spacing.m, paddingHorizontal: spacing.l };
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || isLoading}
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'outline' ? 1 : 0,
            ...getPadding(),
          },
          style,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <React.Fragment>
            {icon && <React.Fragment>{icon} </React.Fragment>}
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
              {title}
            </Text>
          </React.Fragment>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    ...typography.h3,
  },
});
