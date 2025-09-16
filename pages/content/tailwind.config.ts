import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  theme: {
    extend: {
      spacing: {
        // Convert rem values to px (assuming 1rem = 16px)
        px: '1px',
        '0': '0px',
        '0.5': '2px', // 0.125rem * 16
        '1': '4px', // 0.25rem * 16
        '1.5': '6px', // 0.375rem * 16
        '2': '8px', // 0.5rem * 16
        '2.5': '10px', // 0.625rem * 16
        '3': '12px', // 0.75rem * 16
        '3.5': '14px', // 0.875rem * 16
        '4': '16px', // 1rem * 16
        '5': '20px', // 1.25rem * 16
        '6': '24px', // 1.5rem * 16
        '7': '28px', // 1.75rem * 16
        '8': '32px', // 2rem * 16
        '9': '36px', // 2.25rem * 16
        '10': '40px', // 2.5rem * 16
        '11': '44px', // 2.75rem * 16
        '12': '48px', // 3rem * 16
        '14': '56px', // 3.5rem * 16
        '16': '64px', // 4rem * 16
        '20': '80px', // 5rem * 16
        '24': '96px', // 6rem * 16
        '28': '112px', // 7rem * 16
        '32': '128px', // 8rem * 16
        '36': '144px', // 9rem * 16
        '40': '160px', // 10rem * 16
        '44': '176px', // 11rem * 16
        '48': '192px', // 12rem * 16
        '52': '208px', // 13rem * 16
        '56': '224px', // 14rem * 16
        '60': '240px', // 15rem * 16
        '64': '256px', // 16rem * 16
        '72': '288px', // 18rem * 16
        '80': '320px', // 20rem * 16
        '96': '384px', // 24rem * 16
      },
      fontSize: {
        // Convert rem font sizes to px (assuming 1rem = 16px)
        xs: '12px', // 0.75rem * 16
        sm: '14px', // 0.875rem * 16
        base: '16px', // 1rem * 16
        lg: '18px', // 1.125rem * 16
        xl: '20px', // 1.25rem * 16
        '2xl': '24px', // 1.5rem * 16
        '3xl': '30px', // 1.875rem * 16
        '4xl': '36px', // 2.25rem * 16
        '5xl': '48px', // 3rem * 16
        '6xl': '60px', // 3.75rem * 16
        '7xl': '72px', // 4.5rem * 16
        '8xl': '96px', // 6rem * 16
        '9xl': '128px', // 8rem * 16
      },
    },
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
});
