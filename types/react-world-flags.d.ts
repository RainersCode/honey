declare module 'react-world-flags' {
  import { CSSProperties } from 'react';

  interface FlagProps {
    code: string;
    fallback?: React.ReactNode;
    height?: string | number;
    width?: string | number;
    className?: string;
    style?: CSSProperties;
    alt?: string;
  }

  const Flag: React.ComponentType<FlagProps>;
  export default Flag;
} 