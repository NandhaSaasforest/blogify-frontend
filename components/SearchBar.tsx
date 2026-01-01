import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onSubmitEditing?: () => void;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder,
    onSubmitEditing
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || 'Search blogs...'}
                placeholderTextColor="#999"
                onSubmitEditing={onSubmitEditing}
                returnKeyType="search"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginVertical: 12,
    },
    input: {
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
});