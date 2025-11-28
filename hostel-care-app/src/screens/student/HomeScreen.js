import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';
import { getData, STORAGE_KEYS, getComplaintStats } from '../../utils/helpers';

const StudentHomeScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, submitted: 0, inProgress: 0, resolved: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const user = await getData('@currentUser');
    setCurrentUser(user);

    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const myComplaints = complaints.filter(c => c.studentId === user?.id);
    
    const submitted = myComplaints.filter(c => c.status === 'open').length;
    const inProgress = myComplaints.filter(c => c.status === 'in-progress').length;
    const resolved = myComplaints.filter(c => c.status === 'resolved').length;

    setStats({
      total: myComplaints.length,
      submitted,
      inProgress,
      resolved,
    });
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
            <Text style={styles.greeting}>Welcome, Student</Text>
            <Text style={styles.subGreeting}>Manage your hostel complaints</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <Text style={styles.statNumber}>{stats.submitted}</Text>
            <Text style={styles.statLabel}>Submitted</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statNumber}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('AddComplaint')}
          activeOpacity={0.8}
        >
          <View style={styles.createButtonContent}>
            <Text style={styles.createButtonIcon}>➕</Text>
            <Text style={styles.createButtonText}>Create New Complaint</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>📋 My Complaints</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MyComplaints')}
            activeOpacity={0.7}
          >
            <View style={styles.actionCardContent}>
              <Text style={styles.actionCardTitle}>View My Complaints</Text>
              <Text style={styles.actionCardDescription}>
                Track status and updates on your submitted complaints
              </Text>
            </View>
            <Text style={styles.actionCardArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>🔍 Browse All Complaints</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('BrowseComplaints')}
            activeOpacity={0.7}
          >
            <View style={styles.actionCardContent}>
              <Text style={styles.actionCardTitle}>Browse All Complaints</Text>
              <Text style={styles.actionCardDescription}>
                View and upvote complaints from other students
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardBlue: {
    backgroundColor: colors.statusOpen + '20',
  },
  statCardOrange: {
    backgroundColor: colors.statusProgress + '20',
  },
  statCardGreen: {
    backgroundColor: colors.statusResolved + '20',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    margin: 20,
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  createButtonText: {
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

export default StudentHomeScreen;