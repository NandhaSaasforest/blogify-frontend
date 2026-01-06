import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { blogService, bookmarkService, followService } from '@/services/api.service';
import { useAuthCheck } from '@/hooks/useAuth';

interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    createdAt: string;
    replies?: Comment[];
    isAuthorReply?: boolean;
}

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const [blog, setBlog] = useState<any>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const { checkAuth, user, isAuthLoading } = useAuthCheck();
    const [isFollowing, setIsFollowing] = useState(false);
    
    // Comment states
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        const blogId = Array.isArray(id) ? id[0] : id;
        if (!blogId) return;

        const loadBlogData = async () => {
            try {
                const res = await blogService.getBlog(blogId);
                const blogData = res.data ?? res;
                setBlog(blogData);
                setLikes(blogData.likes_count ?? blogData.likes ?? 0);
                setIsFollowing(blogData.author?.is_following ?? blogData.author?.isFollowing ?? false);

                if (user) {
                    try {
                        const status = await blogService.getBlogStatus(blogId);
                        setIsLiked(status.is_liked ?? false);
                        setIsBookmarked(status.is_bookmarked ?? false);
                    } catch (err) {
                        console.log('Could not fetch blog status', err);
                    }

                    // Load comments only for logged in users
                    await loadComments(blogId);
                }
            } catch (error) {
                console.log('Failed to load blog', error);
            }
        };

        loadBlogData();
    }, [id, user]);

    const loadComments = async (blogId: string) => {
        try {
            const response = await blogService.getComments(blogId);
            setComments(response.data ?? response);
        } catch (error) {
            console.log('Failed to load comments', error);
        }
    };

    if (!blog) {
        return (
            <View style={styles.container}>
                <Text>Blog not found</Text>
            </View>
        );
    }

    const handleLike = async () => {
        if (!checkAuth()) return;

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
        if (!checkAuth()) return;

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
        if (!checkAuth()) return;
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

    const handleSubmitComment = async () => {
        if (!checkAuth()) return;
        if (!commentText.trim()) return;

        try {
            setSubmittingComment(true);
            await blogService.addComment(blog.id, { content: commentText });
            setCommentText('');
            await loadComments(blog.id);
            Alert.alert('Success', 'Comment posted successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleSubmitReply = async (commentId: string) => {
        if (!checkAuth()) return;
        if (!replyText.trim()) return;

        try {
            setSubmittingComment(true);
            await blogService.addReply(blog.id, commentId, { content: replyText });
            setReplyText('');
            setReplyingTo(null);
            await loadComments(blog.id);
            Alert.alert('Success', 'Reply posted successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to post reply');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleLoginPrompt = () => {
        Alert.alert(
            'Login Required',
            'Please login to view and post comments',
            [{ text: 'OK' }]
        );
        checkAuth();
    };

    const renderComment = (comment: Comment, isReply: boolean = false) => {
        const isAuthor = comment.author.id === blog.author.id;
        const showReplyBox = replyingTo === comment.id;

        return (
            <View key={comment.id} style={[styles.commentContainer, isReply && styles.replyContainer]}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentAuthorSection}>
                        <Text style={styles.commentAvatar}>{comment.author.avatar}</Text>
                        <View style={styles.commentAuthorInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.commentAuthorName}>{comment.author.name}</Text>
                                {isAuthor && (
                                    <View style={styles.authorBadge}>
                                        <Text style={styles.authorBadgeText}>Author</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.commentDate}>{comment.createdAt}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.commentContent}>{comment.content}</Text>

                {!isReply && (
                    <TouchableOpacity 
                        style={styles.replyButton}
                        onPress={() => setReplyingTo(showReplyBox ? null : comment.id)}
                    >
                        <Text style={styles.replyButtonText}>
                            {showReplyBox ? 'Cancel' : 'Reply'}
                        </Text>
                    </TouchableOpacity>
                )}

                {showReplyBox && (
                    <View style={styles.replyInputContainer}>
                        <TextInput
                            style={styles.replyInput}
                            placeholder={`Reply to ${comment.author.name}...`}
                            value={replyText}
                            onChangeText={setReplyText}
                            multiline
                            maxLength={500}
                        />
                        <View style={styles.replyInputActions}>
                            <TouchableOpacity
                                style={styles.cancelReplyButton}
                                onPress={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                }}
                            >
                                <Text style={styles.cancelReplyText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitReplyButton, !replyText.trim() && styles.submitDisabled]}
                                onPress={() => handleSubmitReply(comment.id)}
                                disabled={!replyText.trim() || submittingComment}
                            >
                                <Text style={styles.submitReplyText}>
                                    {submittingComment ? 'Posting...' : 'Post'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                        {comment.replies.map(reply => renderComment(reply, true))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <View style={styles.authorRow}>
                        <View style={styles.authorSection}>
                            <Text style={styles.avatar}>{blog.author.avatar}</Text>

                            <View>
                                <Text style={styles.authorName}>{blog.author.name}</Text>
                                <Text style={styles.date}>{blog.createdAt}</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleFollowToggle} disabled={loading || isAuthLoading}>
                            <Text style={styles.followButton}>
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

                {/* Comments Section */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>
                        Comments {user && `(${comments.length})`}
                    </Text>

                    {!user ? (
                        // Login prompt for non-authenticated users
                        <TouchableOpacity 
                            style={styles.loginPromptContainer}
                            onPress={handleLoginPrompt}
                        >
                            <Text style={styles.loginPromptIcon}>🔒</Text>
                            <Text style={styles.loginPromptTitle}>Login to see comments</Text>
                            <Text style={styles.loginPromptSubtitle}>
                                Join the conversation by logging in
                            </Text>
                            <View style={styles.loginPromptButton}>
                                <Text style={styles.loginPromptButtonText}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    ) : comments.length === 0 ? (
                        <View style={styles.noComments}>
                            <Text style={styles.noCommentsText}>
                                No comments yet. Be the first to share your thoughts!
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.commentsList}>
                            {comments.map(comment => renderComment(comment))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Comment Input - Only show for logged in users */}
            {user && (
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSubmitComment}
                        disabled={!commentText.trim() || submittingComment}
                    >
                        <Text style={styles.sendButtonText}>
                            {submittingComment ? '⏳' : '📤'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
    followButton: {
        fontSize: 16,
        color: '#007AFF',
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
    // Comments Section
    commentsSection: {
        borderTopWidth: 8,
        borderTopColor: '#F5F5F5',
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    // Login Prompt Styles
    loginPromptContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginVertical: 20,
    },
    loginPromptIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    loginPromptTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    loginPromptSubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    loginPromptButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    loginPromptButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    noComments: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    noCommentsText: {
        fontSize: 15,
        color: '#999',
        textAlign: 'center',
    },
    commentsList: {
        gap: 16,
    },
    commentContainer: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    replyContainer: {
        marginLeft: 24,
        backgroundColor: '#F0F0F0',
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    commentAuthorSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    commentAvatar: {
        fontSize: 32,
        marginRight: 10,
    },
    commentAuthorInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    commentAuthorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    authorBadge: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    authorBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
    },
    commentDate: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    commentContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 8,
    },
    replyButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
    },
    replyButtonText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    repliesContainer: {
        marginTop: 12,
        gap: 8,
    },
    replyInputContainer: {
        marginTop: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    replyInput: {
        fontSize: 15,
        color: '#333',
        minHeight: 60,
        maxHeight: 120,
        textAlignVertical: 'top',
    },
    replyInputActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 8,
    },
    cancelReplyButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    cancelReplyText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    submitReplyButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    submitReplyText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    submitDisabled: {
        backgroundColor: '#CCC',
    },
    // Comment Input at Bottom
    commentInputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        gap: 8,
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#CCC',
    },
    sendButtonText: {
        fontSize: 20,
    },
});