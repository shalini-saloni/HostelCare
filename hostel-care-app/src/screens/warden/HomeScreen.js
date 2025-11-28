import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';
import { getData, STORAGE_KEYS, getComplaintStats } from '../../utils/helpers';

const WardenHomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const calculatedStats = getComplaintStats(complaints);
    setStats(calculatedStats);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Warden Dashboard</Text>
            <Text style={styles.subGreeting}>Manage hostel complaints and staff</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.totalCard]}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={[styles.statCard, styles.openCard]}>
            <Text style={styles.statNumber}>{stats.open}</Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
          
          <View style={[styles.statCard, styles.progressCard]}>
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          
          <View style={[styles.statCard, styles.resolvedCard]}>
            <Text style={styles.statNumber}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('AllComplaints')}
          activeOpacity={0.8}
        >
          <View style={styles.viewAllContent}>
            <Text style={styles.viewAllIcon}>☰</Text>
            <Text style={styles.viewAllText}>View All Complaints</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>📊 Insights & Analytics</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Insights')}
            activeOpacity={0.7}
          >
            <View style={styles.actionCardContent}>
              <Text style={styles.actionCardTitle}>View Analytics</Text>
              <Text style={styles.actionCardDescription}>
                Analyze complaint trends and performance metrics
              </Text>
            </View>
            <Text style={styles.actionCardArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalCard: {
    backgroundColor: colors.primary + '20',
  },
  openCard: {
    backgroundColor: colors.statusOpen + '20',
  },
  progressCard: {
    backgroundColor: colors.statusProgress + '20',
  },
  resolvedCard: {
    backgroundColor: colors.statusResolved + '20',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  viewAllButton: {
    margin: 20,
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllIcon: {
    fontSize: 24,
    marginRight: 12,
    color: colors.white,
  },
  viewAllText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionCardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionCardArrow: {
    fontSize: 24,
    color: colors.textLight,
    marginLeft: 12,
  },
});

export default WardenHomeScreen;