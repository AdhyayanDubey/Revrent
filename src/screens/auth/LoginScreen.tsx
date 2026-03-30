import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Button } from '../../components/common/Button';
import { useAppStore } from '../../store';
import { supabase } from '../../services/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// To handle auth redirects smoothly on apps
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const navigation = useNavigation<any>();

  // Match the screenshot: light theme forced to see the design (or support dark appropriately later)
  const themeColors = isDarkMode ? colors.background.dark : '#F3F4F6';
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      // Setup successful auth inside state
      useAppStore.getState().setUser({ 
        id: data.user.id, 
        name: data.user.user_metadata?.full_name || 'User',
        email: data.user.email || '',
        phone: data.user.phone || ''
      });
      navigation.replace('Home');
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      setLoading(true);

      // Verify if user already exists
      // Assuming email is checked on successful callback, but normally 
      // Supabase automatically links accounts if enabled in dashboard.
      // If the requirement is "users cannot log in if they hadn't signed up", 
      // we check for existing profile on callback.

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
          // Parse the URL to get the access token and refresh token
          // Since Supabase handles the session via URL hash automatically if configured,
          // or we can manually set the session.
          
          const params = new URL(url.replace('#', '?')).searchParams;
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
             const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
             });

             if (sessionError) throw sessionError;

             // Fetch the user's profile to check if they have signed up
             if (sessionData.user) {
               const { data: profileData } = await supabase
                 .from('profiles')
                 .select('*')
                 .eq('id', sessionData.user.id)
                 .single();

               if (!profileData) {
                 // The user has not signed up (profile doesn't exist)
                 // Sign them out and alert
                 await supabase.auth.signOut();
                 Alert.alert('Login Failed', 'You must sign up before logging in.');
                 return;
               }

               // User exists, setup store and navigate
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
      Alert.alert(`${provider} Login Failed`, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.cardContainer}>
          {/* Header Graphic matching screenshot */}
          <View style={styles.heroBackground}>
            <View style={styles.heroIconContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/?size=100&id=lwnFajdemOCN&format=png&color=000000' }} 
                style={{ width: 64, height: 64, tintColor: '#1D4ED8' }} 
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={[styles.content, { backgroundColor: cardColor }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: textColor }]}>Let's get moving.</Text>
              <Text style={[styles.subtitle, { color: secondaryTextColor }]}>Log in to unlock premium rides near you.</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email or Phone Number</Text>
                <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333333' : '#E5E7EB' }]}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="name@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333333' : '#E5E7EB' }]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="********"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <Button 
                title={loading ? "Loading..." : "Continue"} 
                onPress={handleLogin} 
                style={styles.loginButton}
                disabled={loading}
              />
            </View>

            <View style={styles.socialAuthContainer}>
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? '#333333' : '#E5E7EB' }]} />
                <Text style={[styles.dividerText, { color: secondaryTextColor }]}>or continue with</Text>
                <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? '#333333' : '#E5E7EB' }]} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity style={[styles.socialButton, { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }]} onPress={() => handleOAuthLogin('google')}>
                  <Image 
                    source={{ uri: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000' }} 
                    style={styles.socialIcon} 
                    resizeMode="contain"
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { borderColor: '#111827', backgroundColor: '#111827' }]} onPress={() => handleOAuthLogin('apple')}>
                  <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                  <Text style={[styles.socialButtonText, { color: '#FFFFFF' }]}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={{ color: secondaryTextColor, ...typography.body }}>New to RevRent? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={[styles.signUpText, { color: '#1D4ED8' }]}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsFooter}>
              <TouchableOpacity><Text style={styles.termsText}>Terms</Text></TouchableOpacity>
              <TouchableOpacity><Text style={[styles.termsText, { marginHorizontal: 24 }]}>Privacy</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.termsText}>Help</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    padding: spacing.m,
    justifyContent: 'center',
  },
  heroBackground: {
    height: 180,
    backgroundColor: '#EEF2FF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroIconContainer: {
    padding: spacing.m,
  },
  heroIcon: {
    fontWeight: 'bold',
  },
  content: {
    padding: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    marginTop: 8,
  },
  socialAuthContainer: {
    marginBottom: 32,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    marginHorizontal: 16,
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
    marginBottom: 32,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
  }
});
