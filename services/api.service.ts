import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth Services
export const authService = {
    async login(data: { email: string; password: string }) {
        const response = await api.post('/login', data);
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    },

    async register(data: { name: string; email: string; password: string; password_confirmation: string }) {
        const response = await api.post('/register', data);
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    },

    async logout() {
        await api.post('/logout');
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user');
    },

    async getCurrentUser() {
        const response = await api.get('/me');
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },
};

// Blog Services
export const blogService = {
    async getBlogs(params?: { search?: string; hashtag?: string; user_id?: number }) {
        const response = await api.get('/blogs', { params });
        return response.data;
    },

    async getBlog(id: string) {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    },

    async createBlog(data: { title: string; content: string; hashtags?: string[] }) {
        const response = await api.post('/blogs', data);
        return response.data;
    },

    async likeBlog(id: string) {
        const response = await api.post(`/blogs/${id}/like`);
        return response.data;
    },

    async unlikeBlog(id: string) {
        const response = await api.post(`/blogs/${id}/unlike`);
        return response.data;
    },

    async getBlogStatus(id: string) {
        const response = await api.get(`/blogs/${id}/status`);
        return response.data;
    },

    async getComments(blogId: string) {
        const response = await api.get(`/blogs/${blogId}/comments`);
        return response.data;
    },

    async addComment(blogId: string, data: { content: string }) {
        const response = await api.post(`/blogs/${blogId}/comments`, data);
        return response.data;
    },

    async addReply(blogId: string, commentId: string, data: { content: string }) {
        const response = await api.post(
            `/blogs/${blogId}/comments/${commentId}/replies`,
            data
        );
        return response.data;
    },

    async deleteComment(blogId: string, commentId: string) {
        const response = await api.delete(`/blogs/${blogId}/comments/${commentId}`);
        return response.data;
    },

    async editComment(blogId: string, commentId: string, data: { content: string }) {
        const response = await api.put(
            `/blogs/${blogId}/comments/${commentId}`,
            data
        );
        return response.data;
    },

    async likeComment(blogId: string, commentId: string) {
        const response = await api.post(`/blogs/${blogId}/comments/${commentId}/like`);
        return response.data;
    },

    async unlikeComment(blogId: string, commentId: string) {
        const response = await api.delete(`/blogs/${blogId}/comments/${commentId}/like`);
        return response.data;
    },
};

export const followService = {
    // Follow a user
    async followUser(userId: number | string) {
        const response = await api.post(`/users/${userId}/follow`);
        return response.data;
    },

    // Unfollow a user
    async unfollowUser(userId: number | string) {
        const response = await api.delete(`/users/${userId}/follow`);
        return response.data;
    },
};


// Bookmark Services
export const bookmarkService = {
    async getBookmarks() {
        const response = await api.get('/bookmarks');
        return response.data;
    },

    async addBookmark(blogId: string) {
        const response = await api.post(`/blogs/${blogId}/bookmark`);
        return response.data;
    },

    async removeBookmark(blogId: string) {
        const response = await api.delete(`/blogs/${blogId}/bookmark`);
        return response.data;
    },
};

// Hashtag Services
export const hashtagService = {
    async getPopularHashtags() {
        const response = await api.get('/hashtags/popular');
        return response.data.hashtags;
    },
};