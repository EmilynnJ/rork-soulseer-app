import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Platform, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Activity, 
  DollarSign, 
  BarChart, 
  Video, 
  Phone, 
  User as UserIcon,
  RefreshCw,
  Plus,
  Edit
} from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { trpc } from '@/lib/trpc';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, isLoading: userLoading, toggleRole, isReaderOnline, toggleOnlineStatus, logout } = useUser();
  const { isAdmin, user: authUser } = useAuth();

  console.log('[Dashboard] Rendering - authUser:', authUser?.email, 'role:', authUser?.role, 'isAdmin:', isAdmin);

  const { data: readerEarnings } = useQuery({
    queryKey: ['reader', 'earnings', user?.id],
    queryFn: () => apiService.getReaderEarnings(user!.id),
    enabled: !!user && user.role === 'reader',
  });

  if (userLoading || !user) {
    return (
      <View style={styles.container}>
        <Header title="Dashboard" showShop={true} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </View>
    );
  }

  const renderClientDashboard = () => (
    <>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>${user.balance.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.addFundsButton} 
          onPress={() => router.push('/wallet/add-funds' as any)}
        >
          <Plus size={16} color={Colors.dark.tint} />
          <Text style={styles.addFundsText}>Add Funds</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Calendar size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Upcoming Readings</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/wallet/transactions' as any)}
        >
          <View style={styles.menuItemLeft}>
            <Clock size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Transaction History</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <CreditCard size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Payment Methods</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <View style={styles.adminBanner}>
        <View style={styles.adminBadge}>
          <Settings size={16} color="white" />
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
        <Text style={styles.adminWelcome}>Admin Control Panel</Text>
      </View>

      <View style={styles.adminStatsContainer}>
        <View style={styles.adminStatCard}>
          <BarChart size={24} color={Colors.dark.tint} />
          <Text style={styles.adminStatValue}>--</Text>
          <Text style={styles.adminStatLabel}>Total Users</Text>
        </View>
        <View style={styles.adminStatCard}>
          <UserIcon size={24} color={Colors.dark.tint} />
          <Text style={styles.adminStatValue}>--</Text>
          <Text style={styles.adminStatLabel}>Active Readers</Text>
        </View>
        <View style={styles.adminStatCard}>
          <DollarSign size={24} color={Colors.dark.tint} />
          <Text style={styles.adminStatValue}>--</Text>
          <Text style={styles.adminStatLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>User Management</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <UserIcon size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Manage Users</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Activity size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Manage Readers</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Video size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Manage Streams</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Financial</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <DollarSign size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Revenue Reports</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <CreditCard size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Payouts</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Clock size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Transaction History</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Content</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Calendar size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Community Posts</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <BarChart size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Analytics</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderReaderDashboard = () => (
    <>
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusTitle}>Availability Status</Text>
          <Text style={[styles.statusText, isReaderOnline ? styles.textOnline : styles.textOffline]}>
            {isReaderOnline ? 'Online & Taking Calls' : 'Offline'}
          </Text>
        </View>
        <Switch
          value={isReaderOnline}
          onValueChange={toggleOnlineStatus}
          trackColor={{ false: '#333', true: Colors.dark.tint }}
          thumbColor={Platform.OS === 'ios' ? '#fff' : isReaderOnline ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today&apos;s Earnings</Text>
          <Text style={styles.statValue}>${readerEarnings?.todayEarnings.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Payout</Text>
          <Text style={styles.statValue}>${readerEarnings?.pendingPayout.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Reader Tools</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Activity size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Live Session Manager</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <BarChart size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Analytics & Insights</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <DollarSign size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Earnings & Payouts</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Services</Text>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Video size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Video Readings</Text>
          </View>
          <Text style={styles.servicePrice}>$3.99/min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Phone size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Audio Readings</Text>
          </View>
          <Text style={styles.servicePrice}>$2.99/min</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Header title={isAdmin ? 'Admin Dashboard' : user.role === 'reader' ? 'Reader Dashboard' : 'My Profile'} showShop={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={[styles.roleBadge, isAdmin && styles.adminRoleBadge]}>
              <UserIcon size={12} color="white" />
              <Text style={styles.roleText}>{isAdmin ? 'Administrator' : user.role === 'reader' ? 'Verified Reader' : 'Client'}</Text>
            </View>
          </View>
        </View>

        {isAdmin ? renderAdminDashboard() : user.role === 'reader' ? renderReaderDashboard() : renderClientDashboard()}

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/edit' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Edit size={20} color={Colors.dark.text} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Settings size={20} color={Colors.dark.text} />
              <Text style={styles.menuItemText}>Preferences</Text>
            </View>
            <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>

          {!isAdmin && (
            <TouchableOpacity style={styles.menuItem} onPress={toggleRole}>
              <View style={styles.menuItemLeft}>
                <RefreshCw size={20} color={Colors.dark.tint} />
                <Text style={[styles.menuItemText, { color: Colors.dark.tint }]}>
                  Switch to {user.role === 'reader' ? 'Client' : 'Reader'} View
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={async () => {
              await logout();
              router.replace('/auth/login' as any);
            }}
          >
            <View style={styles.menuItemLeft}>
              <LogOut size={20} color="#FF453A" />
              <Text style={[styles.menuItemText, { color: '#FF453A' }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'PlayfairDisplay_400Regular',
    marginTop: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.dark.tint,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: Colors.dark.text,
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  roleText: {
    color: Colors.dark.tint,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  balanceCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: Colors.dark.tint,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  addFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 105, 180, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    gap: 8,
  },
  addFundsText: {
    color: Colors.dark.tint,
    fontWeight: 'bold' as const,
    fontSize: 14,
  },
  statusCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statusTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  textOnline: {
    color: '#00FF00',
  },
  textOffline: {
    color: 'rgba(255,255,255,0.4)',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: Colors.dark.text,
    fontSize: 16,
    marginLeft: 16,
  },
  servicePrice: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
  },
  adminBanner: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.4)',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 12,
  },
  adminBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  adminWelcome: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  adminStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  adminStatCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  adminStatValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  adminStatLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  adminRoleBadge: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
  },
});
