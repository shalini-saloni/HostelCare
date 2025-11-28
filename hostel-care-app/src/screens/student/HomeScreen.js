import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';

// -------------------- Complaint Card --------------------
const ComplaintCard = ({ complaint, onPress }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return '#10B981';
      case 'in-progress':
        return '#F59E0B';
      case 'pending':
      default:
        return '#EF4444';
    }
  };

  const statusColor = getStatusColor(complaint.status);

  return (
    <TouchableOpacity
      onPress={() => onPress(complaint)}
      style={styles.cardContainer}
      activeOpacity={0.7}
    >
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {complaint.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusBadgeText}>
              {complaint.status === 'in-progress' ? 'IN-PROGRESS' : complaint.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Location Info */}
        <Text style={styles.cardSubText}>
          Location: {complaint.hostelBlock} / Room: {complaint.roomNumber}
        </Text>

        {/* Category */}
        <Text style={styles.cardMetaText}>
          Category: {complaint.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// -------------------- Custom Button --------------------
const CustomButton = ({ title, mode = 'contained', onPress, style }) => {
  const contained = mode === 'contained';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonBase,
        contained ? styles.buttonContained : styles.buttonOutlined,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.buttonText,
          contained ? styles.buttonTextContained : styles.buttonTextOutlined,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// -------------------- Main Screen --------------------
const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockComplaints = [
    {
      id: '1',
      title: 'Broken AC',
      category: 'Maintenance',
      status: 'pending',
      roomNumber: '101',
      hostelBlock: 'A',
      createdAt: new Date(),
      description: 'Air conditioner not working properly',
    },
    {
      id: '2',
      title: 'Water Leakage',
      category: 'Plumbing',
      status: 'in-progress',
      roomNumber: '205',
      hostelBlock: 'B',
      createdAt: new Date(Date.now() - 86400000),
      description: 'Bathroom pipe is leaking continuously',
    },
    {
      id: '3',
      title: 'WiFi Issue',
      category: 'Internet',
      status: 'resolved',
      roomNumber: '302',
      hostelBlock: 'C',
      createdAt: new Date(Date.now() - 172800000),
      description: 'No internet connection in room',
    },
    {
      id: '4',
      title: 'Door Lock Broken',
      category: 'Security',
      status: 'pending',
      roomNumber: '150',
      hostelBlock: 'A',
      createdAt: new Date(Date.now() - 43200000),
      description: 'Room door lock not functioning',
    },
    {
      id: '5',
      title: 'Electricity Fluctuation',
      category: 'Electrical',
      status: 'in-progress',
      roomNumber: '410',
      hostelBlock: 'D',
      createdAt: new Date(Date.now() - 259200000),
      description: 'Power supply keeps fluctuating',
    },
  ];

  const filteredComplaints = mockComplaints.filter((item) => {
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(s) ||
      item.category.toLowerCase().includes(s) ||
      item.roomNumber.includes(s) ||
      item.hostelBlock.toLowerCase().includes(s);

    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleComplaintPress = (c) => {
    Alert.alert('Complaint Details', `Title: ${c.title}\nStatus: ${c.status}`);
  };

  const handleNewComplaint = () => {
    Alert.alert('New Complaint', 'Navigate to Create Complaint Screen');
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Main Content */}
      <View style={styles.contentWrapper}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        {/* Title Section */}
        <Text style={styles.pageTitle}>My Complaints</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search complaints..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterRow}
        >
          <CustomButton
            title="All"
            mode={filterStatus === 'all' ? 'contained' : 'outlined'}
            onPress={() => setFilterStatus('all')}
            style={styles.filterBtn}
          />
          <CustomButton
            title="Pending"
            mode={filterStatus === 'pending' ? 'contained' : 'outlined'}
            onPress={() => setFilterStatus('pending')}
            style={styles.filterBtn}
          />
          <CustomButton
            title="In Progress"
            mode={filterStatus === 'in-progress' ? 'contained' : 'outlined'}
            onPress={() => setFilterStatus('in-progress')}
            style={styles.filterBtn}
          />
          <CustomButton
            title="Resolved"
            mode={filterStatus === 'resolved' ? 'contained' : 'outlined'}
            onPress={() => setFilterStatus('resolved')}
            style={styles.filterBtn}
          />
        </ScrollView>

        {/* Complaints List */}
        <ScrollView 
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredComplaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c} onPress={handleComplaintPress} />
          ))}

          {filteredComplaints.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Complaints Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'Try adjusting your search or filter'
                  : 'Create your first complaint to get started'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleNewComplaint}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Content Wrapper
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
  },

  // Header Section
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#111827',
  },

  // Page Title
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  // Search
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },

  // Filters
  filterScrollView: {
    marginBottom: 20,
    maxHeight: 44,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 20,
    minWidth: 100,
  },

  // Cards
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusBar: {
    width: 6,
  },
  cardContent: {
    padding: 18,
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardSubText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Buttons
  buttonBase: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContained: {
    backgroundColor: '#7C3AED',
  },
  buttonOutlined: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonTextContained: {
    color: '#FFFFFF',
  },
  buttonTextOutlined: {
    color: '#6B7280',
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: 36,
  },
});

export default HomeScreen;