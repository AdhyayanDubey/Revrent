import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Button } from '../../components/common/Button';
import { useAppStore } from '../../store';
import { supabase } from '../../services/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();

  const themeColors = isDarkMode ? colors.background.dark : colors.background.light;
  const textColor = isDarkMode ? colors.text.primaryDark : colors.text.primaryLight;
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : colors.text.secondaryLight;
  const cardColor = isDarkMode ? colors.card.dark : colors.card.light;

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error; 

      // Show OTP verification UI instead of routing to home
      Alert.alert('OTP Sent', 'Please check your email for the verification code.');
      setIsOtpSent(true);

    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
       Alert.alert('Error', 'Please enter the OTP');
       return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (error) throw error;

      if (data.user) {
        useAppStore.getState().setUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || name,
          email: data.user.email || email,
          phone: data.user.phone || ''
        });
      }
      navigation.replace('Home');
    } catch(err:any) {
      Alert.alert('Verification Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'apple') => {
    try {
      setLoading(true);

      const redirectUrl = Linking.createURL('/auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success') {
          const { url } = result;
          const params = new URL(url.replace('#', '?')).searchParams;
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
             const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
             });

             if (sessionError) throw sessionError;

             if (sessionData.user) {
               // Verify if a profile already exists
               const { data: existingProfile } = await supabase
                 .from('profiles')
                 .select('*')
                 .eq('id', sessionData.user.id)
                 .single();

               // If profile doesn't exist, create it
               if (!existingProfile) {
                 const { error: profileError } = await supabase
                   .from('profiles')
                   .insert([
                     { 
                       id: sessionData.user.id, 
                       name: sessionData.user.user_metadata?.full_name || 'User', 
                       phone: null,
                       role: 'client' 
                     }
                   ]);
                   
                 if (profileError && profileError.code !== '23505') { 
                   console.error("Profile creation error:", profileError.message);
                 }
               }

               useAppStore.getState().setUser({
                 id: sessionData.user.id,
                 name: sessionData.user.user_metadata?.full_name || 'User',
                 email: sessionData.user.email || '',
                 phone: sessionData.user.phone || ''
               });
               
               navigation.replace('Home');
             }
          }
        }
      }
    } catch (err: any) {
      Alert.alert(`${provider} Sign Up Failed`, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: themeColors }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{isOtpSent ? "Verify your email" : "Join RevRent to start riding"}</Text>
        </View>

        {!isOtpSent ? (
          <>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: cardColor, 
                      color: textColor,
                      borderColor: isDarkMode ? '#333333' : '#E5E7EB'
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
                      borderColor: isDarkMode ? '#333333' : '#E5E7EB'
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
                      borderColor: isDarkMode ? '#333333' : '#E5E7EB'
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
                title={loading ? "Loading..." : "Sign Up"} 
                onPress={handleSignUp} 
                style={styles.signUpButton}
                disabled={loading}
              />
            </View>

            <View style={styles.socialAuthContainer}>
              <Text style={[styles.dividerText, { color: secondaryTextColor }]}>or log in with</Text>

              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton} onPress={() => handleOAuthSignUp('google')}>
                  <Image 
                    source={{ uri: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000' }} 
                    style={styles.socialIcon} 
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000000', borderColor: '#000000' }]} onPress={() => handleOAuthSignUp('apple')}>
                  <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                  <Text style={[styles.socialButtonText, { color: '#FFFFFF' }]}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={{ color: secondaryTextColor, ...typography.body }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginText, { color: '#1D4ED8' }]}>Log in</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.form}>
            <Text style={{ color: secondaryTextColor, marginBottom: 20, textAlign: 'center' }}>
              We've sent a 6-digit OTP to {email}.
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: cardColor, 
                    color: textColor,
                    borderColor: isDarkMode ? '#333333' : '#E5E7EB',
                    textAlign: 'center',
                    fontSize: 24,
                    letterSpacing: 8
                  }
                ]}
                placeholder="000000"
                placeholderTextColor={secondaryTextColor}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <Button 
              title={loading ? "Verifying..." : "Verify OTP"} 
              onPress={handleVerifyOtp} 
              style={styles.signUpButton}
              disabled={loading}
            />
            <TouchableOpacity onPress={() => setIsOtpSent(false)} style={{ marginTop: 20, alignItems: 'center' }}>
               <Text style={{ color: '#1D4ED8', ...typography.body }}>Back to Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
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
    width: '100%',
  },
  socialButton: {
    width: '47%',
    flexDirection: 'row',
    height: 52,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
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
