import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { authService, blogService } from '@/services/api.service';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await authService.getCurrentUser();
                setUser(res.data);
            } catch (error) {
                console.log('Failed to load user', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const getMyBlogs = async () => {
            try {
                const res = await blogService.getBlogs({ user_id: user.id });
                setUserBlogs(res.data);
            } catch (error) {
                console.log('Failed to load blogs', error);
            }
        };

        getMyBlogs();
    }, [user]);



    const handleLogout = async () => {
        try {
            await authService.logout();
            router.replace('/auth/login');
        } catch (error: any) {
            Alert.alert('Logout Failed', error.response?.data?.message || 'Logout failed');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.avatar}>{user?.avatar}</Text>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text style={styles.bio}>{user?.bio}</Text>
                <Text style={styles.joinDate}>Joined {user?.joinDate}</Text>
            </View>

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{userBlogs.length}</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{user?.followersCount}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{user?.followingCount}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Blogs</Text>
                {userBlogs.map((blog) => (
                    <TouchableOpacity
                        key={blog.id}
                        style={styles.blogItem}
                        onPress={() => router.push(`/blog/${blog.id}`)}
                    >
                        <Text style={styles.blogTitle}>{blog.title}</Text>
                        <Text style={styles.blogDate}>{blog.createdAt}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    avatar: {
        fontSize: 80,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    bio: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    joinDate: {
        fontSize: 12,
        color: '#999',
    },
    stats: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 20,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    section: {
        marginTop: 16,
        backgroundColor: '#fff',
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    blogItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    blogTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    blogDate: {
        fontSize: 12,
        color: '#666',
    },
    logoutButton: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});