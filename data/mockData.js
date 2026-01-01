import { Blog } from '../types/blog';

export const mockBlogs: Blog[] = [
    {
        id: '1',
        title: 'Getting Started with React Native',
        content: 'React Native is an amazing framework for building mobile apps. In this post, we will explore the basics of React Native development and how to create your first app. We\'ll cover components, styling, navigation, and more. React Native allows you to build native mobile apps using JavaScript and React.',
        author: {
            id: 'u1',
            name: 'John Doe',
            avatar: '👨‍💻'
        },
        hashtags: ['#reactnative', '#mobile', '#javascript'],
        createdAt: '2024-01-15',
        likes: 42,
        isBookmarked: false
    },
    {
        id: '2',
        title: 'Understanding State Management',
        content: 'State management is crucial in modern app development. Let\'s dive into different approaches like Context API, Redux, and Zustand. Each has its own use cases and benefits. We\'ll explore when to use each solution and best practices.',
        author: {
            id: 'u2',
            name: 'Jane Smith',
            avatar: '👩‍💼'
        },
        hashtags: ['#reactnative', '#state', '#redux'],
        createdAt: '2024-01-14',
        likes: 38,
        isBookmarked: true
    },
    {
        id: '3',
        title: 'UI Design Patterns for Mobile',
        content: 'Creating beautiful and intuitive UIs is an art. Here are some essential design patterns every mobile developer should know. From navigation patterns to form designs, we\'ll cover the fundamentals of mobile UI/UX.',
        author: {
            id: 'u3',
            name: 'Mike Johnson',
            avatar: '🎨'
        },
        hashtags: ['#design', '#ui', '#mobile'],
        createdAt: '2024-01-13',
        likes: 55,
        isBookmarked: false
    },
    {
        id: '4',
        title: 'Navigation in React Native Apps',
        content: 'Expo Router makes navigation simple and intuitive. Learn how to implement file-based routing, nested navigation, and dynamic routes. We\'ll explore the power of Expo Router and how it simplifies navigation in React Native apps.',
        author: {
            id: 'u1',
            name: 'John Doe',
            avatar: '👨‍💻'
        },
        hashtags: ['#reactnative', '#navigation', '#expo'],
        createdAt: '2024-01-12',
        likes: 29,
        isBookmarked: true
    }
];

export const popularHashtags: string[] = [
    '#reactnative',
    '#mobile',
    '#javascript',
    '#design',
    '#ui'
];