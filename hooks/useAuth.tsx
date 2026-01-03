// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '@/services/api.service';

export const useAuth = (redirectTo = '/auth/login') => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await authService.getCurrentUser();
                const userData = res?.data ?? res;
                if (!userData) {
                    router.replace(redirectTo);
                } else {
                    setUser(userData);
                }
            } catch (error) {
                router.replace(redirectTo);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    return { isLoading, user };
};

export const useAuthCheck = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await authService.getCurrentUser();
                const userData = res?.data ?? res;
                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setIsAuthLoading(false);
            }
        };
        loadUser();
    }, []);

    const checkAuth = () => {
        if (!user) {
            router.push('/auth/login');
            return false;
        }
        return true;
    };

    return { checkAuth, user, isAuthLoading };
};