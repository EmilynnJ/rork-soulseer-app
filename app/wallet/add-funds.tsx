import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, CreditCard, Plus, Check, Sparkles } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';

const PRESET_AMOUNTS = [10, 25, 50, 100];

const BONUS_TIERS = [
  { min: 50, bonus: 5 },
  { min: 100, bonus: 15 },
];

export default function AddFundsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, addFunds } = useUser();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getBonus = (amount: number) => {
    for (let i = BONUS_TIERS.length - 1; i >= 0; i--) {
      if (amount >= BONUS_TIERS[i].min) {
        return BONUS_TIERS[i].bonus;
      }
    }
    return 0;
  };

  const currentAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
  const bonus = getBonus(currentAmount);
  const total = currentAmount + bonus;

  const handleAddFunds = async () => {
    if (currentAmount <= 0) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addFunds(total);
      setIsSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Failed to add funds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Check size={48} color="white" />
          </View>
          <Text style={styles.successTitle}>Funds Added!</Text>
          <Text style={styles.successAmount}>${total.toFixed(2)}</Text>
          <Text style={styles.successSubtext}>
            Your new balance is ${((user?.balance || 0) + total).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Add Funds</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${(user?.balance || 0).toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Amount</Text>
        <View style={styles.amountGrid}>
          {PRESET_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountButton,
                selectedAmount === amount && styles.amountButtonActive,
              ]}
              onPress={() => {
                setSelectedAmount(amount);
                setCustomAmount('');
              }}
            >
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === amount && styles.amountTextActive,
                ]}
              >
                ${amount}
              </Text>
              {amount >= 50 && (
                <View style={styles.bonusBadge}>
                  <Sparkles size={10} color={Colors.dark.tint} />
                  <Text style={styles.bonusText}>+${getBonus(amount)}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.orText}>or enter custom amount</Text>

        <View style={styles.customInputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.customInput}
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text.replace(/[^0-9.]/g, ''));
              setSelectedAmount(null);
            }}
            keyboardType="decimal-pad"
          />
        </View>

        {bonus > 0 && (
          <View style={styles.bonusCard}>
            <Sparkles size={20} color={Colors.dark.tint} />
            <Text style={styles.bonusCardText}>
              Add ${currentAmount}+ and get ${bonus} bonus!
            </Text>
          </View>
        )}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>${currentAmount.toFixed(2)}</Text>
          </View>
          {bonus > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bonus</Text>
              <Text style={[styles.summaryValue, styles.bonusValue]}>+${bonus.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Credit</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.cardIcon}>
              <CreditCard size={24} color={Colors.dark.tint} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardType}>•••• •••• •••• 4242</Text>
              <Text style={styles.cardExpiry}>Expires 12/25</Text>
            </View>
            <Check size={20} color={Colors.dark.tint} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addCardButton}>
            <Plus size={20} color={Colors.dark.tint} />
            <Text style={styles.addCardText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.payButton, currentAmount <= 0 && styles.payButtonDisabled]}
          onPress={handleAddFunds}
          disabled={currentAmount <= 0 || isLoading}
        >
          <LinearGradient
            colors={currentAmount > 0 ? [Colors.dark.tint, '#D84A8C'] : ['#444', '#333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payGradient}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.payButtonText}>
                Add ${total.toFixed(2)} to Wallet
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C851',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  successAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    marginBottom: 8,
  },
  successSubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: Colors.dark.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 120,
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
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 36,
    color: Colors.dark.tint,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  amountButton: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  amountButtonActive: {
    borderColor: Colors.dark.tint,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  amountTextActive: {
    color: Colors.dark.tint,
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  bonusText: {
    color: Colors.dark.tint,
    fontSize: 12,
    fontWeight: 'bold',
  },
  orText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 20,
  },
  dollarSign: {
    color: Colors.dark.tint,
    fontSize: 24,
    fontWeight: 'bold',
  },
  customInput: {
    flex: 1,
    color: 'white',
    fontSize: 24,
    paddingVertical: 16,
    paddingLeft: 8,
  },
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
    gap: 12,
  },
  bonusCardText: {
    color: Colors.dark.tint,
    fontSize: 14,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  bonusValue: {
    color: '#00C851',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: Colors.dark.tint,
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardType: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardExpiry: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderStyle: 'dashed',
    gap: 8,
  },
  addCardText: {
    color: Colors.dark.tint,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
