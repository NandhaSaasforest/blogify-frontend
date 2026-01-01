import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SearchBar from '../../components/SearchBar';
import BlogCard from '../../components/BlogCard';
import { mockBlogs } from '../../data/mockData';
import { Blog } from '../../types/blog';

export default function SearchScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(mockBlogs);

    useEffect(() => {
        if (params.query) {
            const query = Array.isArray(params.query) ? params.query[0] : params.query;
            setSearchQuery(query);
            filterBlogs(query);
        }
    }, [params.query]);

    const filterBlogs = (query: string) => {
        if (!query.trim()) {
            setFilteredBlogs(mockBlogs);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = mockBlogs.filter(blog =>
            blog.title.toLowerCase().includes(lowerQuery) ||
            blog.content.toLowerCase().includes(lowerQuery) ||
            blog.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
        setFilteredBlogs(filtered);
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        filterBlogs(text);
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
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No blogs found</Text>
                        <Text style={styles.emptySubtext}>Try a different search term</Text>
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