import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import StatusBadge from '../../components/StatusBadge';
import CustomButton from '../../components/CustomButton';
import Input from '../../components/Input';
import colors from '../../utils/colors';
import { getData, setData, STORAGE_KEYS, formatDate } from '../../utils/helpers';

const ComplaintDetailScreen = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [comment, setComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const loadComplaint = async () => {
    const user = await getData('@currentUser');
    setCurrentUser(user);
    
    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const found = complaints.find(c => c.id === complaintId);
    setComplaint(found);
    setHasUpvoted(found?.upvotedBy?.includes(user?.id) || false);
  };

  useFocusEffect(
    useCallback(() => {
      loadComplaint();
    }, [complaintId])
  );

  const handleUpvote = async () => {
    if (!complaint) return;

    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const index = complaints.findIndex(c => c.id === complaintId);

    if (index === -1) return;

    if (hasUpvoted) {
      complaints[index].upvotes -= 1;
      complaints[index].upvotedBy = complaints[index].upvotedBy.filter(id => id !== currentUser.id);
      setHasUpvoted(false);
    } else {
      complaints[index].upvotes += 1;
      complaints[index].upvotedBy.push(currentUser.id);
      setHasUpvoted(true);
    }

    await setData(STORAGE_KEYS.COMPLAINTS, complaints);
    setComplaint(complaints[index]);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];
    const index = complaints.findIndex(c => c.id === complaintId);

    if (index === -1) return;

    const newComment = {
      id: Date.now().toString(),
      text: comment,
      author: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    complaints[index].comments.push(newComment);
    await setData(STORAGE_KEYS.COMPLAINTS, complaints);
    setComplaint(complaints[index]);
    setComment('');
    Alert.alert('Success', 'Comment added');
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
            <Text style={styles.metaText}>{formatDate(complaint.createdAt)}</Text>
          </View>

          <View style={styles.categorySection}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{complaint.category}</Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{complaint.description}</Text>
          </View>

          {complaint.assignedTo && (
            <View style={styles.assignedSection}>
              <Text style={styles.sectionTitle}>Assigned To</Text>
              <Text style={styles.assignedText}>{complaint.assignedTo}</Text>
            </View>
          )}

          <View style={styles.upvoteSection}>
            <CustomButton
              title={hasUpvoted ? `👍 Upvoted (${complaint.upvotes})` : `👍 Upvote (${complaint.upvotes})`}
              onPress={handleUpvote}
              variant={hasUpvoted ? 'primary' : 'outline'}
            />
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comments ({complaint.comments.length})</Text>
            
            {complaint.comments.map((c) => (
              <View key={c.id} style={styles.comment}>
                <Text style={styles.commentAuthor}>{c.author}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
                <Text style={styles.commentDate}>{formatDate(c.createdAt)}</Text>
              </View>
            ))}

            <Input
              label="Add a comment"
              value={comment}
              onChangeText={setComment}
              placeholder="Share your thoughts..."
              multiline
              numberOfLines={3}
            />
            <CustomButton
              title="Post Comment"
              onPress={handleAddComment}
              variant="secondary"
            />
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
    color: colors.primary,
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
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  descriptionSection: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  assignedSection: {
    backgroundColor: colors.secondary + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  assignedText: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '600',
  },
  upvoteSection: {
    marginBottom: 24,
  },
  commentsSection: {
    marginBottom: 24,
  },
  comment: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
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
});

export default ComplaintDetailScreen;