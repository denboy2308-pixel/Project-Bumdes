import logoOptionA from '../assets/images/logo_option_a_1784659325324.jpg';
import logoOptionB from '../assets/images/logo_option_b_1784659338975.jpg';
import logoOptionC from '../assets/images/logo_option_c_1784659350444.jpg';

export interface LogoOption {
  id: string;
  name: string;
  tagline: string;
  src: string;
  description: string;
  badge: string;
  colorTheme: string;
}

export const LOGO_OPTIONS: LogoOption[] = [
  {
    id: 'option-a',
    name: 'Opsi 1: Eco-Green Minimalist',
    tagline: 'Daun Hijau & Monogram W Modern',
    src: logoOptionA,
    description: 'Konsep hijau ramah lingkungan dengan simbol tunas daun dan huruf W geometris. Sangat cocok untuk memperkuat citra Bank Sampah & Ekonomi Hijau Desa.',
    badge: 'Populer & Fresh',
    colorTheme: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'option-b',
    name: 'Opsi 2: 3D Metallic Corporate',
    tagline: 'Emblem Logam BUMDes Waskita Wijaya',
    src: logoOptionB,
    description: 'Desain emblem 3D elegan dengan kombinasi pita hijau lime, biru cyan, dan lingkaran hitam metallic. Memberikan kesan modern, kokoh, dan terpercaya.',
    badge: 'Eksklusif & Futuristik',
    colorTheme: 'from-cyan-500 to-emerald-600'
  },
  {
    id: 'option-c',
    name: 'Opsi 3: Perisai Kemakmuran Desa',
    tagline: 'Perisai Emas & Padi Hijau Waru',
    src: logoOptionC,
    description: 'Simbol perisai perlindungan dengan aksen emas dan padi hijau yang melambangkan kemakmuran, kemandirian, dan kearifan lokal Desa Waru Sukoharjo.',
    badge: 'Tradisi & Wibawa',
    colorTheme: 'from-amber-500 to-emerald-600'
  }
];
