import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'open':
        return {
          label: 'Open',
          color: colors.statusOpen,
          backgroundColor: colors.statusOpen + '20',
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          color: colors.statusProgress,
          backgroundColor: colors.statusProgress + '20',
        };
      case 'resolved':
        return {
          label: 'Resolved',
          color: colors.statusResolved,
          backgroundColor: colors.statusResolved + '20',
        };
      case 'closed':
        return {
          label: 'Closed',
          color: colors.statusClosed,
          backgroundColor: colors.statusClosed + '20',
        };
      default:
        return {
          label: status,
          color: colors.textSecondary,
          backgroundColor: colors.border,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusBadge;