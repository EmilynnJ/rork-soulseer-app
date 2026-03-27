import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Home, Eye, Video, ShoppingBag, Users, MessageCircle, User, HelpCircle, FileText, Info, Settings, Wallet } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const MENU_ITEMS = [
  { label: 'Home', icon: Home, route: '/', isTab: true },
  { label: 'Readings', icon: Eye, route: '/readings', isTab: true },
  { label: 'Live Streams', icon: Video, route: '/live', isTab: true },
  { label: 'Shop', icon: ShoppingBag, route: '/shop', isTab: false },
  { label: 'Community', icon: Users, route: '/community', isTab: false },
  { label: 'Messages', icon: MessageCircle, route: '/messages', isTab: true },
  { label: 'Dashboard', icon: User, route: '/dashboard', isTab: true },
  { label: 'Wallet', icon: Wallet, route: '/wallet/add-funds', isTab: false },
  { label: 'Settings', icon: Settings, route: '/settings', isTab: false },
  { label: 'About Us', icon: Info, route: '/about', isTab: false },
  { label: 'Help Center', icon: HelpCircle, route: '/help', isTab: false },
  { label: 'Policies', icon: FileText, route: '/policies', isTab: false },
];

export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      <View style={[styles.header, { marginTop: insets.top }]}>
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X color={Colors.dark.text} size={24} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              router.back();
              setTimeout(() => {
                if (item.route === '/') {
                  router.push('/(tabs)');
                } else if (item.isTab) {
                  router.push(`/(tabs)${item.route}` as never);
                } else {
                  router.push(item.route as never);
                }
              }, 100);
            }}
          >
            <item.icon color={Colors.dark.tint} size={24} style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.versionText}>v1.0.0 • SoulSeer</Text>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    color: Colors.dark.text,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  versionText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
});
