import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

export type AuthLoadingType = 'email' | 'google' | 'apple' | 'facebook' | null;

export const useAuthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const { login, register, loginWithSocial } = useAuth();
  const { showModal } = useModal();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Isolated loading state per action type
  const [loadingType, setLoadingType] = useState<AuthLoadingType>(null);

  const handleFinishAuth = () => {
    if (route.params?.onSuccess) {
      route.params.onSuccess();
    }
    navigation.goBack();
  };

  const handleEmailSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      showModal({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please provide both your email address and password to continue.',
        primaryText: 'Understood',
      });
      return;
    }

    if (mode === 'register' && !name.trim()) {
      showModal({
        type: 'warning',
        title: 'Missing Name',
        message: 'Please enter your full name to create an account.',
        primaryText: 'Got It',
      });
      return;
    }

    setLoadingType('email');
    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      handleFinishAuth();
    } catch (err: any) {
      showModal({
        type: 'error',
        title: 'Authentication Failed',
        message: err?.message || 'Unable to sign in. Please check your credentials.',
        primaryText: 'Try Again',
      });
    } finally {
      setLoadingType(null);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoadingType(provider);
    try {
      await loginWithSocial(provider);
      handleFinishAuth();
    } catch (err: any) {
      showModal({
        type: 'error',
        title: 'Social Sign In Failed',
        message: err?.message || 'Could not connect with your social account.',
        primaryText: 'Dismiss',
      });
    } finally {
      setLoadingType(null);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return {
    mode,
    setMode,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading: loadingType !== null,
    loadingType,
    isEmailLoading: loadingType === 'email',
    isAppleLoading: loadingType === 'apple',
    isGoogleLoading: loadingType === 'google',
    isFacebookLoading: loadingType === 'facebook',
    isAnyLoading: loadingType !== null,
    handleEmailSubmit,
    handleSocialLogin,
    handleClose,
    promptTitle: route.params?.promptTitle || 'Sign in to Continue',
  };
};

export default useAuthScreen;
