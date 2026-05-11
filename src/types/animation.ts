// Animation-specific types

export type AnimationEase =
  | 'power1.out' | 'power2.out' | 'power3.out' | 'power4.out'
  | 'power1.in' | 'power2.in' | 'power3.in' | 'power4.in'
  | 'power1.inOut' | 'power2.inOut' | 'power3.inOut' | 'power4.inOut'
  | 'back.out' | 'back.in' | 'back.inOut'
  | 'elastic.out' | 'elastic.in' | 'elastic.inOut'
  | 'bounce.out' | 'bounce.in' | 'bounce.inOut'
  | 'circ.out' | 'circ.in' | 'circ.inOut'
  | 'expo.out' | 'expo.in' | 'expo.inOut'
  | 'sine.out' | 'sine.in' | 'sine.inOut'
  | 'none';

export const GSAP_EASES: AnimationEase[] = [
  'power1.out', 'power2.out', 'power3.out', 'power4.out',
  'power1.inOut', 'power2.inOut', 'power3.inOut', 'power4.inOut',
  'back.out', 'back.inOut',
  'circ.out', 'circ.inOut',
  'expo.out', 'expo.inOut',
  'sine.out', 'sine.inOut',
  'none',
];

export interface AnimationOptions {
  duration: number;
  stagger?: number;
  delay?: number;
  ease?: string;
}
