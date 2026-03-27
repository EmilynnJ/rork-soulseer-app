import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Platform, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
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
  Edit,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  CheckCircle,
  MessageCircle,
  Users,
  ShoppingBag,
  FileText,
} from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { trpc } from '@/lib/trpc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BACKGROUND_IMAGE = 'https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29-A-vivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, isLoading: userLoading, toggleRole, isReaderOnline, toggleOnlineStatus, logout } = useUser();
  const { isAdmin, isAuthenticated, isInitialized } = useAuth();
  const insets = useSafeAreaInsets();

  const { data: adminStats, isLoading: adminStatsLoading } = trpc.admin.getStats.useQuery(undefined, {
    enabled: isAdmin && isAuthenticated,
  });

  const { data: adminUsers } = trpc.admin.getUsers.useQuery({ limit: 5 }, {
    enabled: isAdmin && isAuthenticated,
  });

  const { data: revenueReport } = trpc.admin.getRevenueReport.useQuery(undefined, {
    enabled: isAdmin && isAuthenticated,
  });

  const { data: adminSessions } = trpc.admin.getSessions.useQuery({ limit: 5 }, {
    enabled: isAdmin && isAuthenticated,
  });

  const { data: adminTransactions } = trpc.admin.getTransactions.useQuery({ limit: 5 }, {
    enabled: isAdmin && isAuthenticated,
  });

  const { data: readerEarnings } = trpc.readerDashboard.getEarnings.useQuery(
    { readerId: user?.id || '' },
    { enabled: !!user && user.role === 'reader' },
  );

  const { data: readerSchedule } = trpc.readerDashboard.getSchedule.useQuery(
    { readerId: user?.id || '' },
    { enabled: !!user && user.role === 'reader' },
  );

  const { data: readerSessions } = trpc.readerDashboard.getSessions.useQuery(
    { readerId: user?.id || '', limit: 5 },
    { enabled: !!user && user.role === 'reader' },
  );

  const { data: clientBalance } = trpc.clientDashboard.getBalance.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user && user.role === 'client' },
  );

  const { data: upcomingReadings } = trpc.clientDashboard.getUpcomingReadings.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user && user.role === 'client' },
  );

  const { data: clientTransactions } = trpc.clientDashboard.getTransactions.useQuery(
    { userId: user?.id || '', limit: 5 },
    { enabled: !!user && user.role === 'client' },
  );

  const { data: favoriteReaders } = trpc.clientDashboard.getFavoriteReaders.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user && user.role === 'client' },
  );

  if (!isInitialized || (isAuthenticated && userLoading)) {
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

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: BACKGROUND_IMAGE }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={styles.authOverlay} />
        <View style={[styles.authContainer, { paddingTop: insets.top + 60 }]}>
          <Sparkles size={48} color={Colors.dark.tint} />
          <Text style={styles.authTitle}>Welcome to SoulSeer</Text>
          <Text style={styles.authSubtitle}>Sign in to access your dashboard, manage readings, and connect with our community</Text>
          
          <TouchableOpacity
            style={styles.authLoginButton}
            onPress={() => router.push('/auth/login' as never)}
          >
            <LinearGradient
              colors={[Colors.dark.tint, '#D84A8C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.authLoginGradient}
            >
              <Text style={styles.authLoginText}>Sign In</Text>
              <ArrowRight size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.authSignupButton}
            onPress={() => router.push('/auth/signup' as never)}
          >
            <Text style={styles.authSignupText}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const renderClientDashboard = () => (
    <>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(clientBalance?.balance ?? user.balance)}</Text>
        <TouchableOpacity 
          style={styles.addFundsButton} 
          onPress={() => router.push('/wallet/add-funds' as never)}
        >
          <Plus size={16} color={Colors.dark.tint} />
          <Text style={styles.addFundsText}>Add Funds</Text>
        </TouchableOpacity>
      </View>

      {upcomingReadings && upcomingReadings.length > 0 && (
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Upcoming Readings</Text>
          {upcomingReadings.map((reading) => (
            <TouchableOpacity key={reading.id} style={styles.upcomingCard}>
              <Image source={{ uri: reading.readerAvatar }} style={styles.upcomingAvatar} contentFit="cover" />
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingReaderName}>{reading.readerName}</Text>
                <Text style={styles.upcomingDetail}>{reading.sessionType} • {reading.duration} min</Text>
                <Text style={styles.upcomingTime}>{formatDate(reading.scheduledAt)}</Text>
              </View>
              <View style={styles.upcomingPrice}>
                <Text style={styles.upcomingPriceText}>{formatCurrency(reading.pricePerMin)}/min</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {favoriteReaders && favoriteReaders.length > 0 && (
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Favorite Readers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favReadersScroll}>
            {favoriteReaders.map((reader) => (
              <TouchableOpacity
                key={reader.id}
                style={styles.favReaderCard}
                onPress={() => router.push(`/reader/${reader.id}` as never)}
              >
                <Image source={{ uri: reader.avatar }} style={styles.favReaderAvatar} contentFit="cover" />
                <View style={[styles.onlineIndicator, { backgroundColor: reader.isOnline ? '#00FF00' : '#888' }]} />
                <Text style={styles.favReaderName} numberOfLines={1}>{reader.name}</Text>
                <View style={styles.favReaderRating}>
                  <Star size={10} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.favReaderRatingText}>{reader.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {clientTransactions && clientTransactions.length > 0 && (
        <View style={styles.menuSection}>
          <View style={styles.menuTitleRow}>
            <Text style={styles.menuTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/wallet/transactions' as never)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {clientTransactions.map((txn) => (
            <View key={txn.id} style={styles.transactionItem}>
              <View style={[styles.txnIcon, { backgroundColor: txn.type === 'credit' ? 'rgba(0,255,0,0.1)' : 'rgba(255,105,180,0.1)' }]}>
                {txn.type === 'credit' ? <Plus size={16} color="#00CC00" /> : <DollarSign size={16} color={Colors.dark.tint} />}
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnDescription}>{txn.description}</Text>
                <Text style={styles.txnDate}>{formatDate(txn.timestamp)}</Text>
              </View>
              <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? '#00CC00' : '#FF6B6B' }]}>
                {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/readings' as never)}
        >
          <View style={styles.menuItemLeft}>
            <Calendar size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Browse Readers</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/wallet/transactions' as never)}
        >
          <View style={styles.menuItemLeft}>
            <Clock size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Transaction History</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/wallet/add-funds' as never)}
        >
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
          <Users size={22} color={Colors.dark.tint} />
          <Text style={styles.adminStatValue}>
            {adminStatsLoading ? '...' : adminStats?.totalUsers ?? '--'}
          </Text>
          <Text style={styles.adminStatLabel}>Total Users</Text>
        </View>
        <View style={styles.adminStatCard}>
          <Activity size={22} color="#00CC00" />
          <Text style={styles.adminStatValue}>
            {adminStatsLoading ? '...' : adminStats?.activeReaders ?? '--'}
          </Text>
          <Text style={styles.adminStatLabel}>Active Readers</Text>
        </View>
        <View style={styles.adminStatCard}>
          <DollarSign size={22} color="#FFD700" />
          <Text style={styles.adminStatValue}>
            {adminStatsLoading ? '...' : adminStats ? formatCurrency(adminStats.totalRevenue) : '--'}
          </Text>
          <Text style={styles.adminStatLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.adminStatsContainer}>
        <View style={styles.adminStatCard}>
          <TrendingUp size={22} color="#4ECDC4" />
          <Text style={styles.adminStatValue}>
            {adminStatsLoading ? '...' : adminStats ? formatCurrency(adminStats.monthlyRevenue) : '--'}
          </Text>
          <Text style={styles.adminStatLabel}>Monthly Rev.</Text>
        </View>
        <View style={styles.adminStatCard}>
          <BarChart size={22} color="#FF6B6B" />
          <Text style={styles.adminStatValue}>
            {adminStatsLoading ? '...' : adminStats?.totalSessions ?? '--'}
          </Text>
          <Text style={styles.adminStatLabel}>Sessions</Text>
        </View>
        <View style={styles.adminStatCard}>
          <DollarSign size={22} color="#FFA07A" />
          <Text style={styles.adminStatValue}>
            {adminStatsLoading ? '...' : adminStats ? formatCurrency(adminStats.pendingPayouts) : '--'}
          </Text>
          <Text style={styles.adminStatLabel}>Payouts Due</Text>
        </View>
      </View>

      {revenueReport && (
        <View style={styles.revenueSection}>
          <Text style={styles.menuTitle}>Revenue This Week</Text>
          <View style={styles.revenueCard}>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>Weekly Total</Text>
              <Text style={styles.revenueValue}>{formatCurrency(revenueReport.totalWeekly)}</Text>
            </View>
            <View style={styles.revenueDivider} />
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>Monthly Total</Text>
              <Text style={styles.revenueValue}>{formatCurrency(revenueReport.totalMonthly)}</Text>
            </View>
            <View style={styles.revenueDivider} />
            {revenueReport.daily.slice(-3).map((day, i) => (
              <View key={i} style={styles.revenueDayRow}>
                <Text style={styles.revenueDayLabel}>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                <View style={styles.revenueDayBar}>
                  <View style={[styles.revenueDayBarFill, { width: `${Math.min((day.revenue / 600) * 100, 100)}%` }]} />
                </View>
                <Text style={styles.revenueDayAmount}>{formatCurrency(day.revenue)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {adminSessions && adminSessions.length > 0 && (
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Recent Sessions</Text>
          {adminSessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View style={[styles.sessionTypeIcon, { backgroundColor: session.sessionType === 'video' ? 'rgba(255,105,180,0.15)' : session.sessionType === 'audio' ? 'rgba(78,205,196,0.15)' : 'rgba(255,215,0,0.15)' }]}>
                {session.sessionType === 'video' ? <Video size={16} color={Colors.dark.tint} /> : session.sessionType === 'audio' ? <Phone size={16} color="#4ECDC4" /> : <MessageCircle size={16} color="#FFD700" />}
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionReaderName}>{session.readerName}</Text>
                <Text style={styles.sessionClientName}>with {session.clientName}</Text>
                <Text style={styles.sessionMeta}>{session.totalMinutes} min • {formatDate(session.startTime)}</Text>
              </View>
              <Text style={styles.sessionAmount}>{formatCurrency(session.amountCharged)}</Text>
            </View>
          ))}
        </View>
      )}

      {adminUsers && adminUsers.length > 0 && (
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Recent Users</Text>
          {adminUsers.map((u) => (
            <View key={u.id} style={styles.userItem}>
              <Image source={{ uri: u.avatar }} style={styles.userAvatar} contentFit="cover" />
              <View style={styles.userItemInfo}>
                <Text style={styles.userItemName}>{u.name}</Text>
                <Text style={styles.userItemEmail}>{u.email}</Text>
              </View>
              <View style={[styles.userRoleBadge, u.role === 'admin' ? styles.adminBadgeBg : u.role === 'reader' ? styles.readerBadgeBg : styles.clientBadgeBg]}>
                <Text style={styles.userRoleText}>{u.role}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Management</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/readings' as never)}>
          <View style={styles.menuItemLeft}>
            <UserIcon size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Manage Users</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/readings' as never)}>
          <View style={styles.menuItemLeft}>
            <Activity size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Manage Readers</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/live' as never)}>
          <View style={styles.menuItemLeft}>
            <Video size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Manage Streams</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/shop' as never)}>
          <View style={styles.menuItemLeft}>
            <ShoppingBag size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Manage Products</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/community' as never)}>
          <View style={styles.menuItemLeft}>
            <FileText size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Community Posts</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Financial</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/wallet/transactions' as never)}>
          <View style={styles.menuItemLeft}>
            <DollarSign size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Revenue Reports</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/wallet/transactions' as never)}>
          <View style={styles.menuItemLeft}>
            <CreditCard size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Payouts</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/wallet/transactions' as never)}>
          <View style={styles.menuItemLeft}>
            <Clock size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Transaction History</Text>
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
          <Text style={styles.statValue}>{formatCurrency(readerEarnings?.todayEarnings ?? 0)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Payout</Text>
          <Text style={styles.statValue}>{formatCurrency(readerEarnings?.pendingPayout ?? 0)}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Weekly Earnings</Text>
          <Text style={styles.statValue}>{formatCurrency(readerEarnings?.weeklyEarnings ?? 0)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Monthly Earnings</Text>
          <Text style={styles.statValue}>{formatCurrency(readerEarnings?.monthlyEarnings ?? 0)}</Text>
        </View>
      </View>

      <View style={styles.readerMetricsContainer}>
        <View style={styles.readerMetricCard}>
          <CheckCircle size={18} color="#4ECDC4" />
          <Text style={styles.readerMetricValue}>{readerEarnings?.completionRate ?? 0}%</Text>
          <Text style={styles.readerMetricLabel}>Completion</Text>
        </View>
        <View style={styles.readerMetricCard}>
          <Star size={18} color="#FFD700" />
          <Text style={styles.readerMetricValue}>{readerEarnings?.averageRating ?? 0}</Text>
          <Text style={styles.readerMetricLabel}>Avg Rating</Text>
        </View>
        <View style={styles.readerMetricCard}>
          <Activity size={18} color={Colors.dark.tint} />
          <Text style={styles.readerMetricValue}>{readerEarnings?.totalSessions ?? 0}</Text>
          <Text style={styles.readerMetricLabel}>Sessions</Text>
        </View>
      </View>

      {readerSchedule && readerSchedule.length > 0 && (
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Upcoming Appointments</Text>
          {readerSchedule.map((appt) => (
            <View key={appt.id} style={styles.appointmentItem}>
              <View style={[styles.sessionTypeIcon, { backgroundColor: appt.sessionType === 'video' ? 'rgba(255,105,180,0.15)' : appt.sessionType === 'audio' ? 'rgba(78,205,196,0.15)' : 'rgba(255,215,0,0.15)' }]}>
                {appt.sessionType === 'video' ? <Video size={16} color={Colors.dark.tint} /> : appt.sessionType === 'audio' ? <Phone size={16} color="#4ECDC4" /> : <MessageCircle size={16} color="#FFD700" />}
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentClient}>{appt.clientName}</Text>
                <Text style={styles.appointmentMeta}>{appt.sessionType} • {appt.duration} min</Text>
                <Text style={styles.appointmentTime}>{formatDate(appt.scheduledAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Reader Tools</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/live' as never)}>
          <View style={styles.menuItemLeft}>
            <Activity size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Live Session Manager</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/wallet/transactions' as never)}>
          <View style={styles.menuItemLeft}>
            <BarChart size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Analytics & Insights</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/wallet/transactions' as never)}>
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
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MessageCircle size={20} color={Colors.dark.text} />
            <Text style={styles.menuItemText}>Chat Readings</Text>
          </View>
          <Text style={styles.servicePrice}>$1.99/min</Text>
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
            onPress={() => router.push('/profile/edit' as never)}
          >
            <View style={styles.menuItemLeft}>
              <Edit size={20} color={Colors.dark.text} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings' as never)}
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
              router.replace('/auth/login' as never);
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
    fontWeight: 'bold' as const,
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
    fontWeight: 'bold' as const,
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
    marginBottom: 16,
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
    fontWeight: 'bold' as const,
  },
  readerMetricsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  readerMetricCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 6,
  },
  readerMetricValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  readerMetricLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
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
  menuTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
  },
  seeAllText: {
    color: Colors.dark.tint,
    fontSize: 12,
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
    fontWeight: 'bold' as const,
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
    fontWeight: 'bold' as const,
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
    marginBottom: 12,
  },
  adminStatCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  adminStatValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginTop: 6,
  },
  adminStatLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
  adminRoleBadge: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
  },
  revenueSection: {
    marginBottom: 24,
    marginTop: 12,
  },
  revenueCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  revenueLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  revenueValue: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  revenueDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 4,
  },
  revenueDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  revenueDayLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    width: 40,
  },
  revenueDayBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  revenueDayBarFill: {
    height: '100%',
    backgroundColor: Colors.dark.tint,
    borderRadius: 4,
  },
  revenueDayAmount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    width: 65,
    textAlign: 'right',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  sessionTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionReaderName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  sessionClientName: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  sessionMeta: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginTop: 2,
  },
  sessionAmount: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userItemInfo: {
    flex: 1,
  },
  userItemName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  userItemEmail: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  userRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  adminBadgeBg: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
  },
  readerBadgeBg: {
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
  },
  clientBadgeBg: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  userRoleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold' as const,
    textTransform: 'uppercase',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentClient: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  appointmentMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  appointmentTime: {
    color: Colors.dark.tint,
    fontSize: 11,
    marginTop: 2,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  upcomingAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingReaderName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  upcomingDetail: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  upcomingTime: {
    color: Colors.dark.tint,
    fontSize: 11,
    marginTop: 2,
  },
  upcomingPrice: {
    paddingHorizontal: 8,
  },
  upcomingPriceText: {
    color: Colors.dark.tint,
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  txnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txnInfo: {
    flex: 1,
  },
  txnDescription: {
    color: 'white',
    fontSize: 13,
  },
  txnDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  favReadersScroll: {
    marginBottom: 8,
  },
  favReaderCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  favReaderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.dark.tint,
    marginBottom: 6,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  favReaderName: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
  },
  favReaderRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  favReaderRatingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  authOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 13, 21, 0.92)',
  },
  authContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  authTitle: {
    fontFamily: 'AlexBrush_400Regular',
    fontSize: 44,
    color: Colors.dark.tint,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  authSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  authLoginButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  authLoginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  authLoginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  authSignupButton: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    alignItems: 'center',
  },
  authSignupText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
