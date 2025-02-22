import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ThemedTextInputProps extends TextInputProps {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedTextInput(props: ThemedTextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: 'rgba(255,255,255,0.1)', dark: 'rgba(255,255,255,0.05)' }, 'background');

  return (
    <TextInput
      style={[
        styles.input,
        { color, backgroundColor },
        style,
      ]}
      placeholderTextColor="rgba(255,255,255,0.5)"
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
}); 