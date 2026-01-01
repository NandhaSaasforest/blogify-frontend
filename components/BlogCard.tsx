import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Blog } from '../types/blog';

interface BlogCardProps {
    blog: Blog;
    onPress: () => void;
}

export default function BlogCard({ blog, onPress }: BlogCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.avatar}>{blog.author.avatar}</Text>
                <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{blog.author.name}</Text>
                    <Text style={styles.date}>{blog.createdAt}</Text>
                </View>
            </View>

            <Text style={styles.title}>{blog.title}</Text>
            <Text style={styles.content} numberOfLines={3}>
                {blog.content}
            </Text>

            <View style={styles.hashtags}>
                {blog.hashtags.map((tag, index) => (
                    <Text key={index} style={styles.hashtag}>{tag}</Text>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.likes}>❤️ {blog.likes}</Text>
                <Text style={styles.bookmark}>{blog.isBookmarked ? '🔖' : '📑'}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        fontSize: 32,
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 12,
    },
    hashtags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    hashtag: {
        color: '#007AFF',
        marginRight: 8,
        fontSize: 13,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    likes: {
        fontSize: 14,
        color: '#666',
    },
    bookmark: {
        fontSize: 20,
    },
});