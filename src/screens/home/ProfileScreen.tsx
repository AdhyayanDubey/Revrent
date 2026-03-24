import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppStore } from '../../store';

export default function ProfileScreen({ navigation }: any) {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const toggleDarkMode = useAppStore(state => state.toggleDarkMode);
  const user = useAppStore(state => state.user);
  const setUser = useAppStore(state => state.setUser);

  const themeColors = isDarkMode ? colors.background.dark : '#F9FAFB';
  const textColor = isDarkMode ? colors.text.primaryDark : '#111827';
  const secondaryTextColor = isDarkMode ? colors.text.secondaryDark : '#6B7280';
  const cardColor = isDarkMode ? colors.card.dark : '#FFFFFF';

  const handleLogout = () => {
    setUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  const menuItems = [
    { title: 'Personal Information', icon: 'person-outline', onPress: () => {} },
    { title: 'Payment Methods', icon: 'card-outline', onPress: () => {} },
    { title: 'Rental History', icon: 'time-outline', onPress: () => {} },
    { title: 'Notifications', icon: 'notifications-outline', onPress: () => {} },
    { title: 'Help & Support', icon: 'help-circle-outline', onPress: () => {} },
    { title: 'Dark Mode', icon: 'moon-outline', rightContent: <Switch trackColor={{ false: "#D1D5DB", true: colors.primary }} thumbColor={"#FFFFFF"} ios_backgroundColor="#D1D5DB" onValueChange={toggleDarkMode} value={isDarkMode} /> }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
        </View>

        {!user ? (
          <View style={[styles.authPromptCard, { backgroundColor: cardColor }]}>
            <Ionicons name="person-circle-outline" size={64} color={colors.primary} />
            <Text style={[styles.authPromptTitle, { color: textColor }]}>Sign in or Create Account</Text>
            <Text style={[styles.authPromptText, { color: secondaryTextColor }]}>Login to view your saved vehicles, track your rentals, and enjoy a seamless booking experience.</Text>
            <TouchableOpacity style={styles.authPromptButton} onPress={handleLoginRedirect}>
              <Text style={styles.authPromptButtonText}>Continue with Email / Phone</Text>
            </TouchableOpacity>
            
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialIconButton}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000' }} 
                  style={styles.socialIconMini} 
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIconButton, { backgroundColor: '#111827', borderColor: '#111827' }]}>
                <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={[styles.profileCard, { backgroundColor: cardColor }]}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.profileAvatar} />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: textColor }]}>{user?.name || 'Alexander Doe'}</Text>
                <Text style={[styles.profileEmail, { color: secondaryTextColor }]}>{user?.email || '+1 (555) 123-4567'}</Text>
                <TouchableOpacity style={styles.editProfileBtn}>
                  <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={[styles.statBox, { backgroundColor: cardColor }]}>
                <Text style={[styles.statValue, { color: textColor }]}>12</Text>
                <Text style={[styles.statLabel, { color: secondaryTextColor }]}>Rentals</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: cardColor }]}>
                <Text style={[styles.statValue, { color: textColor }]}>$450</Text>
                <Text style={[styles.statLabel, { color: secondaryTextColor }]}>Spent</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: cardColor }]}>
                <Text style={[styles.statValue, { color: textColor }]}>4.9</Text>
                <Text style={[styles.statLabel, { color: secondaryTextColor }]}>Rating</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.menuItem, { backgroundColor: cardColor, borderBottomColor: isDarkMode ? '#374151' : '#F3F4F6' }]} onPress={item.onPress} disabled={!!item.rightContent}>
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={secondaryTextColor} />
                <Text style={[styles.menuItemTitle, { color: textColor }]}>{item.title}</Text>
              </View>
              {item.rightContent || <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />}
            </TouchableOpacity>
          ))}
        </View>

        {user && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#1D4ED8" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  authPromptCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  authPromptTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  authPromptText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  authPromptButton: {
    backgroundColor: '#1D4ED8',
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  authPromptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconMini: {
    width: 24,
    height: 24,
  },
  profileCard: {
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  editProfileBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 40,
    marginHorizontal: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  logoutText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});
