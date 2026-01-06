// hooks/useAuth.js
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '@/services/api.service';
import { useFocusEffect } from '@react-navigation/native';

export const useAuth = (redirectTo = '/auth/login') => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await authService.getCurrentUser();
            const userData = res?.data ?? res;
            if (!userData) {
                setUser(null);
                router.replace(redirectTo);
            } else {
                setUser(userData);
            }
        } catch (error) {
            setUser(null);
            router.replace(redirectTo);
        } finally {
            setIsLoading(false);
        }
    }, [redirectTo]);

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Re-check auth whenever screen comes into focus
    useFocusEffect(
        useCallback(() => {
            checkAuth();
        }, [checkAuth])
    );

    return { isLoading, user, refetchUser: checkAuth };
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