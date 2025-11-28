import AsyncStorage from '@react-native-async-storage/async-storage';

// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Generate unique ID
export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Storage keys
export const STORAGE_KEYS = {
  USER: '@user',
  COMPLAINTS: '@complaints',
  STAFF: '@staff',
};

// Get data from AsyncStorage
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Error reading data', e);
    return null;
  }
};

// Set data to AsyncStorage
export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Error saving data', e);
    return false;
  }
};

// Remove data from AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing data', e);
    return false;
  }
};

// Initialize mock data
export const initializeMockData = async () => {
  const existingComplaints = await getData(STORAGE_KEYS.COMPLAINTS);
  
  if (!existingComplaints || existingComplaints.length === 0) {
    const mockComplaints = [
      {
        id: '1',
        title: 'Broken WiFi in Room 204',
        description: 'WiFi has been down for 3 days. Unable to attend online classes.',
        category: 'Internet',
        status: 'open',
        priority: 'high',
        studentId: 'student1',
        studentName: 'John Doe',
        roomNumber: '204',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 5,
        upvotedBy: [],
        comments: [],
        assignedTo: null,
        images: [],
      },
      {
        id: '2',
        title: 'Leaking Tap in Common Bathroom',
        description: 'The tap in the common bathroom on floor 2 has been leaking continuously.',
        category: 'Plumbing',
        status: 'in-progress',
        priority: 'medium',
        studentId: 'student2',
        studentName: 'Jane Smith',
        roomNumber: '210',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 3,
        upvotedBy: [],
        comments: [
          {
            id: 'c1',
            text: 'Working on it',
            author: 'Staff Member',
            createdAt: new Date().toISOString(),
          }
        ],
        assignedTo: 'Plumbing Staff',
        images: [],
      },
    ];
    
    await setData(STORAGE_KEYS.COMPLAINTS, mockComplaints);
  }
  
  const existingStaff = await getData(STORAGE_KEYS.STAFF);
  if (!existingStaff || existingStaff.length === 0) {
    const mockStaff = [
      'Maintenance Staff',
      'Plumbing Staff',
      'Electrical Staff',
      'Cleaning Staff',
      'IT Support',
      'Security Staff',
    ];
    await setData(STORAGE_KEYS.STAFF, mockStaff);
  }
};

// Get complaint stats
export const getComplaintStats = (complaints) => {
  const total = complaints.length;
  const open = complaints.filter(c => c.status === 'open').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  
  return { total, open, inProgress, resolved };
};

// Categories
export const CATEGORIES = [
  'Maintenance',
  'Plumbing',
  'Electrical',
  'Internet',
  'Cleaning',
  'Security',
  'Food',
  'Other',
];