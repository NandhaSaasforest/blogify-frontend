import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import BlogCard from '../../components/BlogCard';
import { bookmarkService } from '@/services/api.service';
import { useFocusEffect } from '@react-navigation/native';

export default function BookmarkScreen() {
    const router = useRouter();
    const [bookmarkedBlogs, getBookmarkedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleBlogPress = (blogId: string) => {
        router.push(`/blog/${blogId}`);
    };

    useFocusEffect(
        useCallback(() => {
            const loadBookmarks = async () => {
                try {
                    const res = await bookmarkService.getBookmarks();
                    getBookmarkedBlogs(res.data);
                } catch (error) {
                    console.log('Failed to load bookmarks', error);
                } finally {
                    setLoading(false);
                }
            };

            loadBookmarks();
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {bookmarkedBlogs.length > 0 ? (
                    bookmarkedBlogs.map((blog) => (
                        <BlogCard
                            key={blog.id}
                            blog={blog}
                            onPress={() => handleBlogPress(blog.id)}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🔖</Text>
                        <Text style={styles.emptyText}>No bookmarks yet</Text>
                        <Text style={styles.emptySubtext}>
                            Save your favorite blogs to read them later
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});