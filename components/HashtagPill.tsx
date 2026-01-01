import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface HashtagPillProps {
    hashtag: string;
    onPress: () => void;
}

export default function HashtagPill({ hashtag, onPress }: HashtagPillProps) {
    return (
        <TouchableOpacity style={styles.pill} onPress={onPress}>
            <Text style={styles.text}>{hashtag}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    pill: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    text: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
});