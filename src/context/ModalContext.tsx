import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Animated, Modal } from 'react-native';
import { CustomModalView } from '../components/CustomModal';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

export interface ModalConfig {
  title: string;
  message: string;
  type?: ModalType;
  icon?: string;
  primaryText?: string;
  onPrimaryPress?: () => void;
  secondaryText?: string;
  onSecondaryPress?: () => void;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const showModal = (config: ModalConfig) => {
    setModalConfig(config);
    setVisible(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setModalConfig(null);
      scaleAnim.setValue(0.9);
    });
  };

  const handlePrimaryPress = () => {
    if (modalConfig?.onPrimaryPress) {
      modalConfig.onPrimaryPress();
    }
    hideModal();
  };

  const handleSecondaryPress = () => {
    if (modalConfig?.onSecondaryPress) {
      modalConfig.onSecondaryPress();
    }
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {visible && modalConfig && (
        <Modal transparent visible={visible} animationType="none" onRequestClose={hideModal}>
          <CustomModalView
            config={modalConfig}
            fadeAnim={fadeAnim}
            scaleAnim={scaleAnim}
            onPrimaryPress={handlePrimaryPress}
            onSecondaryPress={handleSecondaryPress}
            onBackdropPress={hideModal}
          />
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
