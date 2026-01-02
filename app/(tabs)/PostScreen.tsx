import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { blogService } from '@/services/api.service';

export default function PostScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        setLoading(true);
        try {
            const hashtagArray = hashtags.split(/[\s,]+/).filter(tag => tag);
            await blogService.createBlog({ title, content, hashtags: hashtagArray });
            Alert.alert('Success!', 'Blog published');
            router.push('/(tabs)');
        } catch (error) {
            Alert.alert('Error', 'Failed to publish');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter blog title"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Content</Text>
                <TextInput
                    style={[styles.input, styles.contentInput]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write your blog content here..."
                    placeholderTextColor="#999"
                    multiline
                    textAlignVertical="top"
                />

                <Text style={styles.label}>Hashtags</Text>
                <TextInput
                    style={styles.input}
                    value={hashtags}
                    onChangeText={setHashtags}
                    placeholder="#reactnative #mobile #coding"
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
                    <Text style={styles.publishButtonText}>Publish Blog</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    contentInput: {
        height: 200,
        paddingTop: 12,
    },
    publishButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
    },
    publishButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});