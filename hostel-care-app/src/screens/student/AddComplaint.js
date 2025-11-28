import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import DropDown from '../../components/DropDown';
import CustomButton from '../../components/CustomButton';
import colors from '../../utils/colors';
import { getData, setData, STORAGE_KEYS, generateId, CATEGORIES } from '../../utils/helpers';

const AddComplaintScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const currentUser = await getData('@currentUser');
      const complaints = await getData(STORAGE_KEYS.COMPLAINTS) || [];

      const newComplaint = {
        id: generateId(),
        title,
        description,
        category,
        status: 'open',
        priority: 'medium',
        studentId: currentUser.id,
        studentName: currentUser.name,
        roomNumber: currentUser.roomNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        upvotedBy: [],
        comments: [],
        assignedTo: null,
        images: [],
      };

      complaints.push(newComplaint);
      await setData(STORAGE_KEYS.COMPLAINTS, complaints);

      Alert.alert('Success', 'Complaint submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Complaint</Text>
          <Text style={styles.subtitle}>Describe your issue in detail</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="Brief description of the issue"
          />

          <DropDown
            label="Category *"
            value={category}
            items={CATEGORIES}
            onSelect={setCategory}
            placeholder="Select category"
          />

          <Input
            label="Description *"
            value={description}
            onChangeText={setDescription}
            placeholder="Provide detailed information about the issue"
            multiline
            numberOfLines={6}
          />

          <CustomButton
            title="Submit Complaint"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />

          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
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
  form: {
    padding: 20,
  },
  submitButton: {
    marginBottom: 12,
  },
});

export default AddComplaintScreen;