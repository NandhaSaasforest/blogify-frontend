export interface Author {
    id: string;
    name: string;
    avatar: string;
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    author: Author;
    hashtags: string[];
    createdAt: string;
    likes: number;
    isBookmarked: boolean;
}