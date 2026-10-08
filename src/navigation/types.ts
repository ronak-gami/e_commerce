import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CosmeticProduct } from '../apis';

export interface BrandInfo {
  id: string; // e.g. 'annabelle', 'covergirl', 'dior', 'glossier', 'l\'oreal', 'maybelline', 'revlon'
  name: string; // e.g. 'Annabelle'
  tagline: string;
  origin: string;
  accentColor: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Brand: {
    brandId: string;
    brandName: string;
    accentColor?: string;
  };
  ProductDetails: {
    product: CosmeticProduct;
  };
  Auth?: {
    promptTitle?: string;
    onSuccess?: () => void;
  };
  Cart: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type BrandScreenProps = NativeStackScreenProps<RootStackParamList, 'Brand'>;
export type ProductDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;
export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;
export type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
