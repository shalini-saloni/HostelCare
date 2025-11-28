import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import StatusBadge from './StatusBadge';
import { formatDate, truncate } from '../utils/helpers';

const ComplaintCard = ({ complaint, onPress, showStudent = false }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title} numberOfLines={1}>
            {complaint.title}
          </Text>
          {showStudent && (
            <Text style={styles.studentInfo}>
              {complaint.studentName} • Room {complaint.roomNumber}
            </Text>
          )}
        </View>
        <StatusBadge status={complaint.status} />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {complaint.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.metaContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{complaint.category}</Text>
          </View>
          {complaint.upvotes > 0 && (
            <View style={styles.upvoteContainer}>
              <Text style={styles.upvoteText}>👍 {complaint.upvotes}</Text>
            </View>
          )}
        </View>
        <Text style={styles.date}>{formatDate(complaint.createdAt)}</Text>
      </View>

      {complaint.assignedTo && (
        <View style={styles.assignedContainer}>
          <Text style={styles.assignedText}>
            Assigned to: {complaint.assignedTo}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  studentInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  upvoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvoteText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  assignedContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  assignedText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
});

export default ComplaintCard;