import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  Shield,
  CreditCard,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  User,
  Lock,
  Smartphone,
  Volume2,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

type SettingItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  danger?: boolean;
};

const SettingItem = ({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
  isSwitch,
  switchValue,
  onSwitchChange,
  danger,
}: SettingItemProps) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={isSwitch}
    activeOpacity={0.7}
  >
    <View style={[styles.settingIcon, danger && styles.dangerIcon]}>{icon}</View>
    <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
    {value && <Text style={styles.settingValue}>{value}</Text>}
    {isSwitch && (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: '#333', true: Colors.dark.tint }}
        thumbColor={Platform.OS === 'ios' ? '#fff' : switchValue ? '#fff' : '#f4f3f4'}
      />
    )}
    {showArrow && !isSwitch && (
      <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [sounds, setSounds] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login' as any);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <SettingItem
            icon={<User size={20} color={Colors.dark.tint} />}
            label="Edit Profile"
            onPress={() => router.push('/profile/edit' as never)}
          />
          <SettingItem
            icon={<Lock size={20} color={Colors.dark.tint} />}
            label="Change Password"
            onPress={() => console.log('Change password')}
          />
          <SettingItem
            icon={<CreditCard size={20} color={Colors.dark.tint} />}
            label="Payment Methods"
            onPress={() => console.log('Payment methods')}
          />
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.section}>
          <SettingItem
            icon={<Bell size={20} color={Colors.dark.tint} />}
            label="Push Notifications"
            isSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
            showArrow={false}
          />
          <SettingItem
            icon={<Volume2 size={20} color={Colors.dark.tint} />}
            label="Sound Effects"
            isSwitch
            switchValue={sounds}
            onSwitchChange={setSounds}
            showArrow={false}
          />
          <SettingItem
            icon={<Moon size={20} color={Colors.dark.tint} />}
            label="Dark Mode"
            isSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
            showArrow={false}
          />
          <SettingItem
            icon={<Globe size={20} color={Colors.dark.tint} />}
            label="Language"
            value="English"
            onPress={() => console.log('Language')}
          />
        </View>

        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.section}>
          <SettingItem
            icon={<Shield size={20} color={Colors.dark.tint} />}
            label="Privacy Settings"
            onPress={() => console.log('Privacy')}
          />
          <SettingItem
            icon={<Smartphone size={20} color={Colors.dark.tint} />}
            label="Two-Factor Authentication"
            value="Off"
            onPress={() => console.log('2FA')}
          />
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.section}>
          <SettingItem
            icon={<HelpCircle size={20} color={Colors.dark.tint} />}
            label="Help Center"
            onPress={() => router.push('/help' as any)}
          />
          <SettingItem
            icon={<FileText size={20} color={Colors.dark.tint} />}
            label="Terms & Privacy"
            onPress={() => router.push('/policies' as any)}
          />
        </View>

        {isAuthenticated ? (
          <View style={[styles.section, styles.dangerSection]}>
            <SettingItem
              icon={<LogOut size={20} color="#FF3B30" />}
              label="Log Out"
              onPress={handleLogout}
              showArrow={false}
              danger
            />
          </View>
        ) : (
          <View style={[styles.section, styles.dangerSection]}>
            <SettingItem
              icon={<LogOut size={20} color={Colors.dark.tint} />}
              label="Sign In"
              onPress={() => router.push('/auth/login' as any)}
              showArrow={false}
            />
          </View>
        )}

        {user && (
          <Text style={styles.userInfo}>Signed in as {user.email} ({user.role})</Text>
        )}

        <Text style={styles.versionText}>SoulSeer v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: Colors.dark.text,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  section: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  settingLabel: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
  },
  settingValue: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    marginRight: 8,
  },
  dangerText: {
    color: '#FF3B30',
  },
  dangerSection: {
    marginTop: 32,
  },
  versionText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
  },
  userInfo: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
