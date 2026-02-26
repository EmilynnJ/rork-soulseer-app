import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, ShoppingBag, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  showShop?: boolean;
  showNotifications?: boolean;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'SoulSeer', 
  showMenu = true,
  showShop = true,
  showNotifications = true,
  transparent = false
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top + 10 },
      transparent && styles.transparent
    ]}>
      <View style={styles.leftContainer}>
        {showMenu && (
          <TouchableOpacity onPress={() => router.push('/menu' as any)} style={styles.iconButton}>
            <Menu color={Colors.dark.text} size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {showShop && (
          <TouchableOpacity onPress={() => router.push('/shop' as any)} style={styles.iconButton}>
            <ShoppingBag color={Colors.dark.text} size={24} />
          </TouchableOpacity>
        )}
        {showNotifications && (
          <TouchableOpacity style={styles.iconButton}>
            <Bell color={Colors.dark.text} size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    zIndex: 100,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  title: {
    fontFamily: 'AlexBrush_400Regular',
    fontSize: 32,
    color: Colors.dark.tint,
    textShadowColor: 'rgba(255, 105, 180, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  iconButton: {
    padding: 4,
  },
});
