import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Subheading, Text, Divider, ActivityIndicator } from 'react-native-paper';
import ScreenWrapper from '../../components/ScreenWrapper';
import CustomButton from '../../components/CustomButton';
import colors from '../../utils/colors';

// --- Placeholder Imports for Firebase ---
// NOTE: These are placeholder functions. You will implement the actual logic in Phase 4.
import { auth, db } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
// Replace this with actual Firestore query in Phase 4
const fetchUserProfile = async (userId) => {
  // Simulate fetching user data from Firestore
  return new Promise(resolve => setTimeout(() => {
    // Check for a dummy warden ID to simulate roles
    const isWarden = userId === 'warden-dummy-id'; 
    
    resolve({
      name: isWarden ? 'Prof. A. K. Sharma' : 'Tushar Verma',
      email: auth.currentUser?.email || 'user@hostelcare.com',
      role: isWarden ? 'Warden' : 'Student',
      hostelBlock: 'Block A',
      roomNumber: isWarden ? 'Office' : '101',
      // We will actually fetch this from Firestore in Phase 4
    });
  }, 1000));
};
// ----------------------------------------

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // --- 1. Fetch User Data ---
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        // In the real app (Phase 4), replace 'auth.currentUser?.uid'
        // with the actual logged-in user ID.
        const userId = auth.currentUser?.uid || (navigation.getState().routes[0].name === 'WardenTabs' ? 'warden-dummy-id' : 'student-dummy-id');
        const userData = await fetchUserProfile(userId);
        setProfile(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Could not load user profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigation]);

  // --- 2. Logout Handler (Connects to Firebase Auth) ---
  const handleLogout = async () => {
    try {
      // Use Firebase signOut
      await signOut(auth);
      // The main navigator (index.js) will automatically redirect to AuthStack
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Logout Failed", "Please try again.");
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={colors.PRIMARY} size="large" />
        <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper isScrollable={true}>
      <View style={styles.headerContainer}>
        <Title style={styles.name}>{profile?.name || 'User Profile'}</Title>
        <Subheading style={styles.roleText}>{profile?.role || 'User'}</Subheading>
      </View>
      
      <Divider style={styles.divider} />

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{profile?.email || 'N/A'}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Hostel Block:</Text>
        <Text style={styles.infoValue}>{profile?.hostelBlock || 'N/A'}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Room/Office No.:</Text>
        <Text style={styles.infoValue}>{profile?.roomNumber || 'N/A'}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Logout Button */}
      <CustomButton
        title="Logout"
        onPress={handleLogout}
        mode="outlined"
        icon="logout"
        style={styles.logoutButton}
        labelStyle={{ color: colors.URGENT }}
        contentStyle={{ borderColor: colors.URGENT, borderWidth: 1 }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.TEXT_DARK,
  },
  roleText: {
    fontSize: 16,
    color: colors.PRIMARY,
    marginTop: 5,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TEXT_LIGHT,
  },
  infoValue: {
    fontSize: 16,
    color: colors.TEXT_DARK,
    fontWeight: '400',
  },
  divider: {
    marginVertical: 20,
    height: 1,
    backgroundColor: colors.BORDER,
  },
  logoutButton: {
    marginTop: 30,
  },
});

export default ProfileScreen;