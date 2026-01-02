import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SearchBar from '../../components/SearchBar';
import BlogCard from '../../components/BlogCard';
import { Blog } from '../../types/blog';
import { blogService } from '../../services/api.service';

export default function SearchScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);

    // Load blogs when hashtag is passed from home screen
    useEffect(() => {
        if (params.query) {
            const query = Array.isArray(params.query) ? params.query[0] : params.query;
            setSearchQuery(query);
            searchBlogs(query);
        }
    }, [params.query]);

    const searchBlogs = async (query: string) => {
        if (!query.trim()) {
            setFilteredBlogs([]);
            return;
        }

        setLoading(true);
        try {
            const response = await blogService.getBlogs({
                search: query.startsWith('#') ? undefined : query,
                hashtag: query.startsWith('#') ? query : undefined,
            });
            setFilteredBlogs(response.data);
        } catch (error) {
            console.error('Error searching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim()) {
            searchBlogs(text);
        } else {
            setFilteredBlogs([]);
        }
    };

    const handleBlogPress = (blogId: string) => {
        router.push(`/blog/${blogId}`);
    };

    return (
        <View style={styles.container}>
            <SearchBar
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <ScrollView style={styles.content}>
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                blog={blog}
                                onPress={() => handleBlogPress(blog.id)}
                            />
                        ))
                    ) : (
                        // Different states based on searchQuery
                        <View style={styles.emptyState}>
                            {searchQuery.trim() ? (
                                // User has searched but found nothing
                                <>
                                    <Text style={styles.emptyText}>No blogs found</Text>
                                    <Text style={styles.emptySubtext}>Try a different search term</Text>
                                </>
                            ) : (
                                // User hasn't searched yet
                                <>
                                    <Text style={styles.emptyText}>Search for blogs</Text>
                                    <Text style={styles.emptySubtext}>
                                        Type in the search bar above to find blogs
                                    </Text>
                                </>
                            )}
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
});