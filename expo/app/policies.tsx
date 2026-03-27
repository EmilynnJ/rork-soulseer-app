import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';

type Tab = 'tos' | 'privacy' | 'user';

export default function PoliciesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('tos');

  const renderContent = () => {
    switch (activeTab) {
      case 'tos':
        return (
          <View>
            <Text style={styles.paragraph}>
              Welcome to SoulSeer. By accessing or using our mobile application, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service.
            </Text>
            <Text style={styles.subHeader}>1. Accounts</Text>
            <Text style={styles.paragraph}>
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </Text>
            <Text style={styles.subHeader}>2. Readings & Entertainment</Text>
            <Text style={styles.paragraph}>
              The services provided by SoulSeer and its readers are for entertainment purposes only. SoulSeer does not guarantee the accuracy of any reading or advice given. You should not rely on any information provided for making medical, legal, or financial decisions.
            </Text>
          </View>
        );
      case 'privacy':
        return (
          <View>
            <Text style={styles.paragraph}>
              Your privacy is important to us. It is SoulSeer&apos;s policy to respect your privacy regarding any information we may collect from you across our application.
            </Text>
            <Text style={styles.subHeader}>1. Information We Collect</Text>
            <Text style={styles.paragraph}>
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            </Text>
            <Text style={styles.subHeader}>2. Data Security</Text>
            <Text style={styles.paragraph}>
              We don’t share any personally identifying information publicly or with third-parties, except when required to by law. We retain collected information for as long as necessary to provide you with your requested service.
            </Text>
          </View>
        );
      case 'user':
        return (
          <View>
            <Text style={styles.paragraph}>
              This End User License Agreement (&quot;Agreement&quot;) is between you and SoulSeer and governs use of this app made available through the Apple App Store.
            </Text>
            <Text style={styles.subHeader}>1. Scope of License</Text>
            <Text style={styles.paragraph}>
              The license granted to you for the SoulSeer App is limited to a non-transferable license to use the App on any Apple-branded Products that you own or control and as permitted by the Usage Rules set forth in the App Store Terms of Service.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Legal & Policies" showShop={false} />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tos' && styles.activeTab]} 
          onPress={() => setActiveTab('tos')}
        >
          <Text style={[styles.tabText, activeTab === 'tos' && styles.activeTabText]}>Terms</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]} 
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'user' && styles.activeTab]} 
          onPress={() => setActiveTab('user')}
        >
          <Text style={[styles.tabText, activeTab === 'user' && styles.activeTabText]}>EULA</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
  tabText: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: Colors.dark.tint,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  subHeader: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
});
