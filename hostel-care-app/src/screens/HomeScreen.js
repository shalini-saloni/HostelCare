import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import colors from '../utils/colors';

const HomeScreen = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>HostelCare</Text>
          <Text style={styles.subtitle}>Complaint & Maintenance Management System</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, styles.studentCard]}
            onPress={() => navigation.navigate('StudentLogin')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🎓</Text>
            </View>
            <Text style={styles.cardTitle}>Student</Text>
            <Text style={styles.cardDescription}>
              Report issues, track complaints, and upvote concerns in your hostel
            </Text>
            <View style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Continue as Student</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.wardenCard]}
            onPress={() => navigation.navigate('WardenLogin')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🛡️</Text>
            </View>
            <Text style={styles.cardTitle}>Warden / Staff</Text>
            <Text style={styles.cardDescription}>
              Manage complaints, assign staff, and track resolution progress
            </Text>
            <View style={[styles.cardButton, styles.wardenButton]}>
              <Text style={styles.cardButtonText}>Continue as Warden</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  cardsContainer: {
    flex: 1,
    gap: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  studentCard: {
    borderColor: colors.primary + '30',
  },
  wardenCard: {
    borderColor: colors.secondary + '30',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 40,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  cardButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  wardenButton: {
    backgroundColor: colors.secondary,
  },
  cardButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;