import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { mockBlogs } from '../../data/mockData';

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams();
    const blog = mockBlogs.find(b => b.id === id);

    const [isBookmarked, setIsBookmarked] = useState(blog?.isBookmarked || false);
    const [likes, setLikes] = useState(blog?.likes || 0);
    const [isLiked, setIsLiked] = useState(false);

    if (!blog) {
        return (
            <View style={styles.container}>
                <Text>Blog not found</Text>
            </View>
        );
    }

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
            setIsLiked(false);
        } else {
            setLikes(likes + 1);
            setIsLiked(true);
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.authorSection}>
                    <Text style={styles.avatar}>{blog.author.avatar}</Text>
                    <View>
                        <Text style={styles.authorName}>{blog.author.name}</Text>
                        <Text style={styles.date}>{blog.createdAt}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.title}>{blog.title}</Text>

                <View style={styles.hashtags}>
                    {blog.hashtags.map((tag, index) => (
                        <Text key={index} style={styles.hashtag}>{tag}</Text>
                    ))}
                </View>

                <Text style={styles.contentText}>{blog.content}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLike}
                >
                    <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
                    <Text style={styles.actionText}>{likes} Likes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleBookmark}
                >
                    <Text style={styles.actionIcon}>{isBookmarked ? '🔖' : '📑'}</Text>
                    <Text style={styles.actionText}>
                        {isBookmarked ? 'Saved' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        fontSize: 48,
        marginRight: 12,
    },
    authorName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    body: {
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
        lineHeight: 36,
    },
    hashtags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    hashtag: {
        color: '#007AFF',
        marginRight: 12,
        fontSize: 15,
        fontWeight: '500',
    },
    contentText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    actions: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        justifyContent: 'space-around',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    actionIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    actionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});