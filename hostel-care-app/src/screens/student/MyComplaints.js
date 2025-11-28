import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import ComplaintCard from '../../components/ComplaintCard';
import colors from '../../utils/colors';
import { getData, STORAGE_KEYS } from '../../utils/helpers';

const MyComplaintsScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadComplaints = async () => {
    const currentUser = await getData('@currentUser');
    const allComplaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const myComplaints = allComplaints.filter(c => c.studentId === currentUser?.id);
    setComplaints(myComplaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useFocusEffect(
    useCallback(() => {
      loadComplaints();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadComplaints();
    setRefreshing(false);
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>My Complaints</Text>
        <Text style={styles.subtitle}>{complaints.length} total complaints</Text>
      </View>

      <FlatList
        data={complaints}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ComplaintCard
            complaint={item}
            onPress={() => navigation.navigate('ComplaintDetail', { complaintId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No complaints yet</Text>
            <Text style={styles.emptySubtext}>Create your first complaint to get started</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
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
  list: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default MyComplaintsScreen;