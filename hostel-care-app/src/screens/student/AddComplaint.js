import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {
  TextInput,
  Title,
  Paragraph,
  RadioButton,
  IconButton,
  Caption,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import ScreenWrapper from '../../components/ScreenWrapper';
import CustomButton from '../../components/CustomButton';
import { COLORS } from '../../utils/colors';

const AddComplaint = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'Medium',
    hostelBlock: '',
    roomNumber: '',
    description: '',
  });
  
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Maintenance',
    'Plumbing',
    'Electrical',
    'Internet',
    'Cleaning',
    'Security',
    'Furniture',
    'Other',
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const hostelBlocks = ['A', 'B', 'C', 'D', 'E', 'F'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.hostelBlock) {
      newErrors.hostelBlock = 'Please select your hostel block';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    } else if (!/^\d+$/.test(formData.roomNumber.trim())) {
      newErrors.roomNumber = 'Room number must be numeric';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload images.'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera permissions to take photos.'
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

        
      if (!result.canceled && result.assets) {
        const newImage = result.assets[0].uri;
        setImages([...images, newImage].slice(0, 5)); // Max 5 images
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare complaint data
      const complaintData = {
        ...formData,
        images: images,
        status: 'pending',
        createdAt: new Date(),
        // Add user ID from auth context
        // userId: user.uid,
      };

      // Add your Firebase/API submission logic here
      // await firestore().collection('complaints').add(complaintData);
      // Or: await createComplaint(complaintData);

      console.log('Submitting complaint:', complaintData);

      Alert.alert(
        'Success',
        'Your complaint has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper isScrollable={true} backgroundColor={COLORS?.background ?? '#F9FAFB'}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={COLORS?.primary ?? '#2563EB'}
          onPress={() => navigation.goBack()}
        />
        <Title style={styles.headerTitle}>New Complaint</Title>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <TextInput
            label="Complaint Title *"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            mode="outlined"
            outlineColor={COLORS?.border ?? '#E5E7EB'}
            activeOutlineColor={COLORS?.primary ?? '#2563EB'}
            style={styles.input}
            error={!!errors.title}
            placeholder="e.g., Broken AC, Water Leakage"
          />
          {errors.title && <Caption style={styles.errorText}>{errors.title}</Caption>}
        </View>

        {/* Category Selection */}
        <View style={styles.inputContainer}>
          <Paragraph style={styles.label}>Category *</Paragraph>
          <View style={styles.chipContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.chip,
                  formData.category === category && styles.chipSelected,
                ]}
                onPress={() => handleInputChange('category', category)}
              >
                <Paragraph
                  style={[
                    styles.chipText,
                    formData.category === category && styles.chipTextSelected,
                  ]}
                >
                  {category}
                </Paragraph>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && <Caption style={styles.errorText}>{errors.category}</Caption>}
        </View>

        {/* Priority Selection */}
        <View style={styles.inputContainer}>
          <Paragraph style={styles.label}>Priority Level</Paragraph>
          <RadioButton.Group
            onValueChange={(value) => handleInputChange('priority', value)}
            value={formData.priority}
          >
            {priorities.map((priority) => (
              <View key={priority} style={styles.radioItem}>
                <RadioButton.Android
                  value={priority}
                  color={COLORS?.primary ?? '#2563EB'}
                />
                <Paragraph style={styles.radioLabel}>{priority}</Paragraph>
              </View>
            ))}
          </RadioButton.Group>
        </View>

        {/* Location Section */}
        <View style={styles.sectionContainer}>
          <Title style={styles.sectionTitle}>Location Details</Title>
          
          {/* Hostel Block */}
          <View style={styles.inputContainer}>
            <Paragraph style={styles.label}>Hostel Block *</Paragraph>
            <View style={styles.chipContainer}>
              {hostelBlocks.map((block) => (
                <TouchableOpacity
                  key={block}
                  style={[
                    styles.chip,
                    formData.hostelBlock === block && styles.chipSelected,
                  ]}
                  onPress={() => handleInputChange('hostelBlock', block)}
                >
                  <Paragraph
                    style={[
                      styles.chipText,
                      formData.hostelBlock === block && styles.chipTextSelected,
                    ]}
                  >
                    Block {block}
                  </Paragraph>
                </TouchableOpacity>
              ))}
            </View>
            {errors.hostelBlock && (
              <Caption style={styles.errorText}>{errors.hostelBlock}</Caption>
            )}
          </View>

          {/* Room Number */}
          <View style={styles.inputContainer}>
            <TextInput
              label="Room Number *"
              value={formData.roomNumber}
              onChangeText={(text) => handleInputChange('roomNumber', text)}
              mode="outlined"
              outlineColor={COLORS?.border ?? '#E5E7EB'}
              activeOutlineColor={COLORS?.primary ?? '#2563EB'}
              style={styles.input}
              error={!!errors.roomNumber}
              keyboardType="numeric"
              placeholder="e.g., 101"
            />
            {errors.roomNumber && (
              <Caption style={styles.errorText}>{errors.roomNumber}</Caption>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <TextInput
            label="Description *"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            mode="outlined"
            outlineColor={COLORS?.border ?? '#E5E7EB'}
            activeOutlineColor={COLORS?.primary ?? '#2563EB'}
            style={styles.textArea}
            error={!!errors.description}
            multiline
            numberOfLines={5}
            placeholder="Please provide detailed information about the issue..."
          />
          {errors.description && (
            <Caption style={styles.errorText}>{errors.description}</Caption>
          )}
        </View>

        {/* Images Section */}
        <View style={styles.sectionContainer}>
          <Title style={styles.sectionTitle}>Attachments (Optional)</Title>
          <Caption style={styles.caption}>You can add up to 5 images</Caption>

          <View style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <IconButton icon="close" size={16} iconColor={COLORS?.white ?? '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showImageOptions}
              >
                <IconButton icon="camera" size={32} iconColor={COLORS?.primary ?? '#2563EB'} />
                <Caption style={styles.addImageText}>Add Image</Caption>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Submit Complaint"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            icon="send"
          />
          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            mode="outlined"
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS?.primary ?? '#2563EB',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS?.white ?? '#FFFFFF',
  },
  textArea: {
    backgroundColor: COLORS?.white ?? '#FFFFFF',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS?.textPrimary ?? '#111827',
    marginBottom: 8,
  },
  errorText: {
    color: COLORS?.urgent ?? '#EF4444',
    marginTop: 4,
    fontSize: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS?.white ?? '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS?.border ?? '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: COLORS?.primary ?? '#2563EB',
    borderColor: COLORS?.primary ?? '#2563EB',
  },
  chipText: {
    fontSize: 14,
    color: COLORS?.textPrimary ?? '#111827',
  },
  chipTextSelected: {
    color: COLORS?.white ?? '#FFFFFF',
    fontWeight: 'bold',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 15,
    color: COLORS?.textPrimary ?? '#111827',
    marginLeft: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS?.textPrimary ?? '#111827',
    marginBottom: 8,
  },
  caption: {
    fontSize: 12,
    color: COLORS?.textSecondary ?? '#6B7280',
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS?.urgent ?? '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS?.border ?? '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS?.white ?? '#FFFFFF',
  },
  addImageText: {
    fontSize: 12,
    color: COLORS?.primary ?? '#2563EB',
    marginTop: -8,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
});

export default AddComplaint;