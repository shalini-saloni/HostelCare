import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../utils/colors'; 

const CustomButton = ({ 
  title, 
  onPress, 
  mode = 'contained', 
  loading = false, 
  disabled = false,
  style = {},
  contentStyle = {},
  labelStyle = {},
  icon,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Button
        mode={mode}
        onPress={onPress}
        loading={loading}
        disabled={disabled || loading}
        icon={icon}
        buttonColor={mode === 'contained' ? (COLORS?.primary ?? '#2563EB') : undefined}
        textColor={
          mode === 'contained'
            ? (COLORS?.white ?? '#FFFFFF')
            : (COLORS?.primary ?? '#2563EB')
        }
        contentStyle={[styles.buttonContent, contentStyle]}
        labelStyle={[styles.buttonLabel, labelStyle]}
      >
        {title}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden', 
  },
  buttonContent: {
    paddingVertical: 4, 
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});

export default CustomButton;