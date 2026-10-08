import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './style';
import { useAuthScreen } from './useAuthScreen';
import { VectorIcon } from '../../components/VectorIcon';
import { KeyboardAwareContainer } from '../../components/Keyboard';

export const AuthScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    mode,
    setMode,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isEmailLoading,
    isAppleLoading,
    isGoogleLoading,
    isFacebookLoading,
    isAnyLoading,
    handleEmailSubmit,
    handleSocialLogin,
    handleClose,
    promptTitle,
  } = useAuthScreen();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      <KeyboardAwareContainer
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bottomOffset={30}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerPrompt}>{promptTitle}</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <VectorIcon name="close" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerDivider} />

        {/* Title & Tagline */}
        <Text style={styles.brandTitle}>
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </Text>
        <Text style={styles.brandSubtitle}>
          {mode === 'signin'
            ? 'Sign in to access your curated makeup bag and instant checkout.'
            : 'Join the boutique to unlock exclusive beauty perks & fast checkout.'}
        </Text>

        {/* Segmented Mode Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'signin' && styles.tabBtnActive]}
            onPress={() => setMode('signin')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                mode === 'signin' && styles.tabTextActive,
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
            onPress={() => setMode('register')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                mode === 'register' && styles.tabTextActive,
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        {mode === 'register' && (
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. Ronak Gami"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="name@example.com"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="••••••••••••"
            placeholderTextColor="#64748B"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {mode === 'signin' && (
          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isAnyLoading && { opacity: 0.75 }]}
          onPress={handleEmailSubmit}
          disabled={isAnyLoading}
          activeOpacity={0.85}
        >
          {isEmailLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Social Login Options */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsWrapper}>
          <TouchableOpacity
            style={[styles.socialBtn, isAnyLoading && { opacity: isAppleLoading ? 0.9 : 0.6 }]}
            onPress={() => handleSocialLogin('apple')}
            disabled={isAnyLoading}
            activeOpacity={0.8}
          >
            {isAppleLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
            ) : (
              <VectorIcon name="apple" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.socialBtnText}>
              {isAppleLoading ? 'Connecting with Apple...' : 'Continue with Apple'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialBtn, isAnyLoading && { opacity: isGoogleLoading ? 0.9 : 0.6 }]}
            onPress={() => handleSocialLogin('google')}
            disabled={isAnyLoading}
            activeOpacity={0.8}
          >
            {isGoogleLoading ? (
              <ActivityIndicator size="small" color="#EA4335" style={{ marginRight: 10 }} />
            ) : (
              <VectorIcon name="google" size={17} color="#EA4335" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.socialBtnText}>
              {isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialBtn, isAnyLoading && { opacity: isFacebookLoading ? 0.9 : 0.6 }]}
            onPress={() => handleSocialLogin('facebook')}
            disabled={isAnyLoading}
            activeOpacity={0.8}
          >
            {isFacebookLoading ? (
              <ActivityIndicator size="small" color="#1877F2" style={{ marginRight: 10 }} />
            ) : (
              <VectorIcon name="facebook" size={18} color="#1877F2" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.socialBtnText}>
              {isFacebookLoading ? 'Connecting with Facebook...' : 'Continue with Facebook'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerDisclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </KeyboardAwareContainer>
    </View>
  );
};

export default AuthScreen;
