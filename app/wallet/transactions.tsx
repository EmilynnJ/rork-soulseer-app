import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, Calendar } from 'lucide-react-native';

type Transaction = {
  id: string;
  type: 'credit' | 'debit' | 'refund';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'debit', amount: 15.50, description: 'Reading with Mystic Luna', timestamp: '2025-01-11T14:30:00Z', status: 'completed' },
  { id: '2', type: 'credit', amount: 50.00, description: 'Added funds to wallet', timestamp: '2025-01-11T10:15:00Z', status: 'completed' },
  { id: '3', type: 'debit', amount: 8.97, description: 'Reading with Celestial Rose', timestamp: '2025-01-10T18:45:00Z', status: 'completed' },
  { id: '4', type: 'refund', amount: 5.00, description: 'Session refund - technical issues', timestamp: '2025-01-09T12:00:00Z', status: 'completed' },
  { id: '5', type: 'debit', amount: 23.94, description: 'Reading with Oracle James', timestamp: '2025-01-08T20:30:00Z', status: 'completed' },
  { id: '6', type: 'credit', amount: 100.00, description: 'Added funds to wallet (+$15 bonus)', timestamp: '2025-01-07T09:00:00Z', status: 'completed' },
  { id: '7', type: 'debit', amount: 12.45, description: 'Reading with Spirit Maya', timestamp: '2025-01-06T16:20:00Z', status: 'completed' },
  { id: '8', type: 'debit', amount: 29.90, description: 'Gift sent during live stream', timestamp: '2025-01-05T21:00:00Z', status: 'completed' },
];

type FilterType = 'all' | 'credit' | 'debit' | 'refund';

export default function TransactionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading] = useState(false);

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => 
    filter === 'all' ? true : t.type === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isCredit = item.type === 'credit' || item.type === 'refund';
    
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.iconContainer, isCredit ? styles.creditIcon : styles.debitIcon]}>
          {isCredit ? (
            <ArrowDownLeft size={20} color="#00C851" />
          ) : (
            <ArrowUpRight size={20} color="#FF6B6B" />
          )}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDesc}>{item.description}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.timestamp)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, isCredit ? styles.creditAmount : styles.debitAmount]}>
            {isCredit ? '+' : '-'}${item.amount.toFixed(2)}
          </Text>
          <Text style={[
            styles.status,
            item.status === 'completed' && styles.statusCompleted,
            item.status === 'pending' && styles.statusPending,
            item.status === 'failed' && styles.statusFailed,
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}
    >
      <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={24} color={Colors.dark.tint} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton type="all" label="All" />
        <FilterButton type="credit" label="Added" />
        <FilterButton type="debit" label="Spent" />
        <FilterButton type="refund" label="Refunds" />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
        </View>
      ) : filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Filter size={48} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyText}>No transactions found</Text>
          <Text style={styles.emptySubtext}>
            {filter !== 'all' ? 'Try selecting a different filter' : 'Your transactions will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 105, 180, 0.15)',
    borderColor: Colors.dark.tint,
  },
  filterText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  filterTextActive: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditIcon: {
    backgroundColor: 'rgba(0, 200, 81, 0.15)',
  },
  debitIcon: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionDesc: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  creditAmount: {
    color: '#00C851',
  },
  debitAmount: {
    color: '#FF6B6B',
  },
  status: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  statusCompleted: {
    color: 'rgba(255,255,255,0.4)',
  },
  statusPending: {
    color: '#FFD700',
  },
  statusFailed: {
    color: '#FF3B30',
  },
});
