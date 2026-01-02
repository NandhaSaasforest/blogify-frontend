import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import BlogCard from '../../components/BlogCard';
import HashtagPill from '../../components/HashtagPill';
import SearchBar from '../../components/SearchBar';
import { blogService, hashtagService } from '@/services/api.service';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const [blogs, setBlogs] = useState([]);
  const [popularHashtags, setPopularHashtags] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [blogsData, hashtagsData] = await Promise.all([
        blogService.getBlogs(),
        hashtagService.getPopularHashtags(),
      ]);
      setBlogs(blogsData.data);
      setPopularHashtags(hashtagsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/(tabs)/SearchScreen',
        params: { query: searchQuery }
      });
    }
  };

  const handleHashtagPress = (hashtag: string) => {
    router.push({
      pathname: '/(tabs)/SearchScreen',
      params: { query: hashtag }
    });
  };

  const handleBlogPress = (blogId: string) => {
    router.push(`/blog/${blogId}`);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Hashtags</Text>
          <View style={styles.hashtagContainer}>
            {popularHashtags.map((tag, index) => (
              <HashtagPill
                key={index}
                hashtag={tag}
                onPress={() => handleHashtagPress(tag)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Blogs</Text>
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onPress={() => handleBlogPress(blog.id)}
            />
          ))}
        </View>
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
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
});