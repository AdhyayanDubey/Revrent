import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Button } from '../../components/common/Button';
import { useAppStore } from '../../store';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();

  const themeColors = isDarkMode ? colors.background.dark : colors.background.light;
  const textColor = isDarkMode ? colors.text.primaryDark : colors.text.primaryLight;
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight;
  const cardColor = isDarkMode ? colors.card.dark : colors.card.light;

  const handleSignUp = () => {
    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: themeColors }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>Join RevRent to start riding</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: cardColor, 
                  color: textColor,
                  borderColor: isDarkMode ? colors.border.dark : colors.border.light 
                }
              ]}
              placeholder="Full Name"
              placeholderTextColor={secondaryTextColor}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: cardColor, 
                  color: textColor,
                  borderColor: isDarkMode ? colors.border.dark : colors.border.light 
                }
              ]}
              placeholder="Email"
              placeholderTextColor={secondaryTextColor}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: cardColor, 
                  color: textColor,
                  borderColor: isDarkMode ? colors.border.dark : colors.border.light 
                }
              ]}
              placeholder="Password"
              placeholderTextColor={secondaryTextColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button 
            title="Sign Up" 
            onPress={handleSignUp} 
            style={styles.signUpButton}
          />
        </View>

        <View style={styles.socialAuthContainer}>
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? colors.border.dark : colors.border.light }]} />
            <Text style={[styles.dividerText, { color: secondaryTextColor }]}>Or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? colors.border.dark : colors.border.light }]} />
          </View>

          <View style={styles.socialButtons}>
            <Button
              title="Google"
              variant="outline"
              style={styles.socialButton}
              textStyle={{ color: textColor }}
              onPress={() => handleSignUp()}
            />
            <Button
              title="Apple"
              variant="outline"
              style={styles.socialButton}
              textStyle={{ color: textColor }}
              onPress={() => handleSignUp()}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: secondaryTextColor }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginText, { color: colors.primary }]}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.l,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.s,
  },
  subtitle: {
    ...typography.body,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.m,
  },
  input: {
    ...typography.body,
    padding: spacing.m,
    borderRadius: borderRadius.m,
    borderWidth: 1,
  },
  signUpButton: {
    marginTop: spacing.l,
  },
  socialAuthContainer: {
    marginBottom: spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...typography.caption,
    marginHorizontal: spacing.m,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.m,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: spacing.l,
  },
  loginText: {
    ...typography.body,
    fontWeight: '600',
  },
});
