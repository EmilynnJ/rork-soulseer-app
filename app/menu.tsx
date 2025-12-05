import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Home, Eye, Video, ShoppingBag, Users, MessageCircle, User, HelpCircle, FileText } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const MENU_ITEMS = [
  { label: 'Home', icon: Home, route: '/' },
  { label: 'Readings', icon: Eye, route: '/readings' },
  { label: 'Live Streams', icon: Video, route: '/live' },
  { label: 'Shop', icon: ShoppingBag, route: '/shop' },
  { label: 'Community', icon: Users, route: '/community' },
  { label: 'Messages', icon: MessageCircle, route: '/messages' },
  { label: 'Dashboard', icon: User, route: '/dashboard' },
  { label: 'Help Center', icon: HelpCircle, route: '/help' },
  { label: 'Policies', icon: FileText, route: '/policies' },
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
              // Handle special cases or simply push
              if (item.route === '/') {
                router.dismissAll();
                router.push('/(tabs)');
              } else if (['/readings', '/live', '/messages', '/dashboard'].includes(item.route)) {
                 // For tabs, we want to go to the tab
                 router.dismissAll();
                 router.push(`/(tabs)${item.route}` as any);
              } else {
                router.push(item.route as any);
              }
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
