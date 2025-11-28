import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';
import { getData, STORAGE_KEYS } from '../../utils/helpers';

const InsightsScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    byCategory: {},
    byStatus: {},
    avgResolutionTime: 0,
    topIssues: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadInsights = async () => {
    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    
    // Calculate stats
    const byCategory = {};
    const byStatus = {};
    
    complaints.forEach(c => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    });

    // Calculate top issues (most upvoted)
    const topIssues = complaints
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 5);

    setStats({
      totalComplaints: complaints.length,
      byCategory,
      byStatus,
      avgResolutionTime: 0, // Placeholder
      topIssues,
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadInsights();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
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
          <Text style={styles.title}>Insights & Analytics</Text>
          <Text style={styles.subtitle}>Performance metrics and trends</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.overviewCard}>
            <Text style={styles.cardTitle}>📈 Overview</Text>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewNumber}>{stats.totalComplaints}</Text>
                <Text style={styles.overviewLabel}>Total Complaints</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewNumber}>{stats.byStatus?.resolved || 0}</Text>
                <Text style={styles.overviewLabel}>Resolved</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Complaints by Category</Text>
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <View key={category} style={styles.statRow}>
                <Text style={styles.statLabel}>{category}</Text>
                <View style={styles.statBar}>
                  <View 
                    style={[
                      styles.statBarFill, 
                      { width: `${(count / stats.totalComplaints) * 100}%` }
                    ]} 
                  />
                  <Text style={styles.statCount}>{count}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏷️ Complaints by Status</Text>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <View key={status} style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusLabel}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </Text>
                <Text style={styles.statusCount}>{count}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔥 Top Issues (Most Upvoted)</Text>
            {stats.topIssues.length === 0 ? (
              <Text style={styles.emptyText}>No data available</Text>
            ) : (
              stats.topIssues.map((issue, index) => (
                <View key={issue.id} style={styles.topIssueRow}>
                  <View style={styles.topIssueRank}>
                    <Text style={styles.topIssueRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topIssueContent}>
                    <Text style={styles.topIssueTitle} numberOfLines={1}>
                      {issue.title}
                    </Text>
                    <Text style={styles.topIssueCategory}>{issue.category}</Text>
                  </View>
                  <Text style={styles.topIssueUpvotes}>👍 {issue.upvotes}</Text>
                </View>
              ))
            )}
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: colors.primary + '15',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statRow: {
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  statBar: {
    height: 32,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  statBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    minWidth: '10%',
  },
  statCount: {
    position: 'absolute',
    right: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  statusLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  statusCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  topIssueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  topIssueRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topIssueRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  topIssueContent: {
    flex: 1,
  },
  topIssueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  topIssueCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  topIssueUpvotes: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default InsightsScreen;