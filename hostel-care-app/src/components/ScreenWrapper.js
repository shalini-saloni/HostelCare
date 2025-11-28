import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import colors from '../utils/colors';

const ScreenWrapper = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default ScreenWrapper;