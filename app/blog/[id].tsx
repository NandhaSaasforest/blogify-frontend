import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { blogService, bookmarkService, followService } from '@/services/api.service';

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const [blog, setBlog] = useState<any>(null);

    useEffect(() => {
        const blogId = Array.isArray(id) ? id[0] : id;
        if (!blogId) return;

        const getBlog = async () => {
            try {
                const res = await blogService.getBlog(blogId);
                setBlog(res.data);
            } catch (error) {
                console.log('Failed to load blog', error);
            }
        };

        getBlog();
    }, [id]);


    const [isBookmarked, setIsBookmarked] = useState(blog?.isBookmarked || false);
    const [likes, setLikes] = useState(blog?.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);


    if (!blog) {
        return (
            <View style={styles.container}>
                <Text>Blog not found</Text>
            </View>
        );
    }

    const handleLike = async () => {
        try {
            if (isLiked) {
                await blogService.unlikeBlog(blog.id);
                setLikes(likes - 1);
                setIsLiked(false);
            } else {
                await blogService.likeBlog(blog.id);
                setLikes(likes + 1);
                setIsLiked(true);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update like');
        }
    };

    const handleBookmark = async () => {
        try {
            if (isBookmarked) {
                await bookmarkService.removeBookmark(blog.id);
                setIsBookmarked(false);
            } else {
                await bookmarkService.addBookmark(blog.id);
                setIsBookmarked(true);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update bookmark');
        }
    };

    const handleFollowToggle = async () => {
        try {
            setLoading(true);

            if (isFollowing) {
                await followService.unfollowUser(blog.author.id);
                setIsFollowing(false);
            } else {
                await followService.followUser(blog.author.id);
                setIsFollowing(true);
            }
        } catch (error) {
            console.log('Follow action failed', error);
        } finally {
            setLoading(false);
        }
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

                    <TouchableOpacity onPress={handleFollowToggle} disabled={loading}>
                        <Text>
                            {loading ? 'Please wait...' : isFollowing ? 'Unfollow' : 'Follow'}
                        </Text>
                    </TouchableOpacity>

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