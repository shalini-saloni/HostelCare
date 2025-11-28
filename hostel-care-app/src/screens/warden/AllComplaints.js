import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import ComplaintCard from '../../components/ComplaintCard';
import DropDown from '../../components/DropDown';
import colors from '../../utils/colors';
import { getData, STORAGE_KEYS, CATEGORIES } from '../../utils/helpers';

const AllComplaintsScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadComplaints = async () => {
    const allComplaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    setComplaints(allComplaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    applyFilters(allComplaints, filterCategory, filterStatus);
  };

  const applyFilters = (data, category, status) => {
    let filtered = data;
    
    if (category !== 'All') {
      filtered = filtered.filter(c => c.category === category);
    }
    
    if (status !== 'All') {
      filtered = filtered.filter(c => c.status === status);
    }
    
    setFilteredComplaints(filtered);
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

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    applyFilters(complaints, category, filterStatus);
  };

  const handleStatusChange = (status) => {
    setFilterStatus(status);
    applyFilters(complaints, filterCategory, status);
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>All Complaints</Text>
        <Text style={styles.subtitle}>{filteredComplaints.length} complaints</Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <DropDown
              value={filterCategory}
              items={['All', ...CATEGORIES]}
              onSelect={handleCategoryChange}
              placeholder="Category"
            />
          </View>
          <View style={styles.filterItem}>
            <DropDown
              value={filterStatus}
              items={['All', 'open', 'in-progress', 'resolved']}
              onSelect={handleStatusChange}
              placeholder="Status"
            />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredComplaints}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ComplaintCard
            complaint={item}
            onPress={() => navigation.navigate('WardenComplaintDetail', { complaintId: item.id })}
            showStudent
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No complaints found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
  filtersContainer: {
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterItem: {
    flex: 1,
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

export default AllComplaintsScreen;