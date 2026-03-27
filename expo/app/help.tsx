import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';
import { ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FAQS = [
  {
    question: 'How do I book a reading?',
    answer: 'You can browse our list of available readers in the "Readings" tab. Once you find a reader you connect with, simply tap on their profile and choose "Chat", "Call", or "Video" to start a session immediately or book for later.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Readers set their own rates per minute. You prepay by adding funds to your wallet. During a session, funds are deducted in real-time. You will never be charged more than your available balance.',
  },
  {
    question: 'What if I am not satisfied with my reading?',
    answer: 'We strive for quality and connection. If you are unsatisfied, please end the session within the first 3 minutes and contact support for a review of your session. We offer a satisfaction guarantee for technical issues.',
  },
  {
    question: 'How do I become a reader on SoulSeer?',
    answer: 'We are always looking for gifted psychics to join our community. Please visit our website and click on "Apply to be a Reader" at the bottom of the page. You will need to undergo a vetting process.',
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Yes, your privacy is our top priority. All calls and chats are end-to-end encrypted. We do not share your personal details with readers or third parties.',
  },
];

export default function HelpCenterScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Header title="Help Center" showShop={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <View style={styles.faqList}>
          {FAQS.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.questionRow} 
                onPress={() => toggleExpand(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{faq.question}</Text>
                {expandedIndex === index ? (
                  <ChevronUp color={Colors.dark.text} size={20} />
                ) : (
                  <ChevronDown color={Colors.dark.text} size={20} />
                )}
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact Support</Text>
        <View style={styles.supportOptions}>
          <TouchableOpacity style={styles.supportCard}>
            <View style={styles.iconContainer}>
              <MessageCircle color={Colors.dark.tint} size={24} />
            </View>
            <Text style={styles.supportTitle}>Live Chat</Text>
            <Text style={styles.supportDesc}>Chat with our support team</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard}>
            <View style={styles.iconContainer}>
              <Mail color={Colors.dark.tint} size={24} />
            </View>
            <Text style={styles.supportTitle}>Email Us</Text>
            <Text style={styles.supportDesc}>support@soulseer.app</Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: Colors.dark.text,
    marginBottom: 16,
    marginTop: 8,
  },
  faqList: {
    marginBottom: 32,
  },
  faqItem: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  answerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
  },
  supportOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  supportCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  supportDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});
