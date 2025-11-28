import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import StatusBadge from '../../components/StatusBadge';
import CustomButton from '../../components/CustomButton';
import DropDown from '../../components/DropDown';
import colors from '../../utils/colors';
import { getData, setData, STORAGE_KEYS, formatDate } from '../../utils/helpers';

const WardenComplaintDetailScreen = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadData = async () => {
    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const found = complaints.find(c => c.id === complaintId);
    setComplaint(found);
    setSelectedStatus(found?.status || '');
    setSelectedStaff(found?.assignedTo || '');

    const staff = await getData(STORAGE_KEYS.STAFF) || [];
    setStaffList(staff);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [complaintId])
  );

  const handleUpdate = async () => {
    if (!selectedStatus) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const index = complaints.findIndex(c => c.id === complaintId);

    if (index === -1) return;

    complaints[index].status = selectedStatus;
    complaints[index].assignedTo = selectedStaff;
    complaints[index].updatedAt = new Date().toISOString();

    await setData(STORAGE_KEYS.COMPLAINTS, complaints);
    setComplaint(complaints[index]);
    Alert.alert('Success', 'Complaint updated successfully!');
  };

  if (!complaint) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{complaint.title}</Text>
            <StatusBadge status={complaint.status} />
          </View>

          <View style={styles.metaSection}>
            <Text style={styles.metaText}>
              By {complaint.studentName} • Room {complaint.roomNumber}
            </Text>
            <Text style={styles.metaText}>Submitted: {formatDate(complaint.createdAt)}</Text>
            <Text style={styles.metaText}>Updated: {formatDate(complaint.updatedAt)}</Text>
          </View>

          <View style={styles.categorySection}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{complaint.category}</Text>
            </View>
            <View style={styles.upvoteBadge}>
              <Text style={styles.upvoteText}>👍 {complaint.upvotes} upvotes</Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{complaint.description}</Text>
          </View>

          <View style={styles.managementSection}>
            <Text style={styles.sectionTitle}>Manage Complaint</Text>
            
            <DropDown
              label="Assign Staff"
              value={selectedStaff}
              items={['Unassigned', ...staffList]}
              onSelect={setSelectedStaff}
              placeholder="Select staff member"
            />

            <DropDown
              label="Update Status"
              value={selectedStatus}
              items={['open', 'in-progress', 'resolved', 'closed']}
              onSelect={setSelectedStatus}
              placeholder="Select status"
            />

            <CustomButton
              title="Update Complaint"
              onPress={handleUpdate}
              variant="secondary"
            />
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comments ({complaint.comments.length})</Text>
            
            {complaint.comments.length === 0 ? (
              <Text style={styles.noComments}>No comments yet</Text>
            ) : (
              complaint.comments.map((c) => (
                <View key={c.id} style={styles.comment}>
                  <Text style={styles.commentAuthor}>{c.author}</Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                  <Text style={styles.commentDate}>{formatDate(c.createdAt)}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  metaSection: {
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  upvoteBadge: {
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  upvoteText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  descriptionSection: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  managementSection: {
    backgroundColor: colors.secondary + '10',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  commentsSection: {
    marginBottom: 24,
  },
  comment: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  commentDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  noComments: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default WardenComplaintDetailScreen;