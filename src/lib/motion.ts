import type { Variants } from 'framer-motion';

/**
 * 모션 단일 소스. 등장·전환의 곡선과 거리를 여기서만 정의해
 * 섹션마다 제각각인 easing이 생기지 않게 한다.
 * 곡선은 expo-out — 빠르게 나와서 길게 감속(tailwind의 ease-out-expo와 동일 값).
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/** 자식들을 순차 등장시키는 컨테이너. 자식에 fadeUp을 물린다. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
