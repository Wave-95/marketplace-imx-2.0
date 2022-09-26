/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './providers/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        accent: 'var(--colors-bg-accent)',
        badge: {
          neutral: 'var(--colors-bg-badge-neutral)',
        },
        button: {
          primary: {
            normal: 'var(--colors-bg-button-primary-normal)',
            hover: 'var(--colors-bg-button-primary-hover)',
            active: 'var(--colors-bg-button-primary-active)',
            disabled: 'var(--colors-bg-button-primary-disabled)',
          },
          secondary: {
            normal: 'var(--colors-bg-button-secondary-normal)',
            hover: 'var(--colors-bg-button-secondary-hover)',
            active: 'var(--colors-bg-button-secondary-active)',
            disabled: 'var(--colors-bg-button-secondary-disabled)',
          },
          tertiary: {
            normal: 'var(--colors-bg-button-tertiary-normal)',
            hover: 'var(--colors-bg-button-tertiary-hover)',
            active: 'var(--colors-bg-button-tertiary-active)',
            disabled: 'var(--colors-bg-button-tertiary-disabled)',
          },
          quaternary: {
            normal: 'var(--colors-bg-button-quaternary-normal)',
            hover: 'var(--colors-bg-button-quaternary-hover)',
            active: 'var(--colors-bg-button-quaternary-active)',
            disabled: 'var(--colors-bg-button-quaternary-disabled)',
          },
        },
        card: {
          primary: {
            normal: 'var(--colors-bg-card-primary-normal)',
            hover: 'var(--colors-bg-card-primary-hover)',
            active: 'var(--colors-bg-card-primary-active)',
            disabled: 'var(--colors-bg-card-primary-disabled)',
          },
          secondary: {
            normal: 'var(--colors-bg-card-secondary-normal)',
            hover: 'var(--colors-bg-card-secondary-hover)',
            active: 'var(--colors-bg-card-secondary-active)',
            disabled: 'var(--colors-bg-card-secondary-disabled)',
          },
        },
        dialog: 'var(--colors-bg-dialog)',
        header: 'var(--colors-bg-header)',
        page: 'var(--colors-bg-page)',
        popover: 'var(--colors-bg-popover)',
      },
      borderColor: {
        accent: 'var(--colors-border-accent)',
        normal: 'var(--colors-border-normal)',
        button: {
          primary: {
            normal: 'var(--colors-border-button-primary-normal)',
            hover: 'var(--colors-border-button-primary-hover)',
            active: 'var(--colors-border-button-primary-active)',
            disabled: 'var(--colors-border-button-primary-disabled)',
          },
          secondary: {
            normal: 'var(--colors-border-button-secondary-normal)',
            hover: 'var(--colors-border-button-secondary-hover)',
            active: 'var(--colors-border-button-secondary-active)',
            disabled: 'var(--colors-border-button-secondary-disabled)',
          },
          tertiary: {
            normal: 'var(--colors-border-button-tertiary-normal)',
            hover: 'var(--colors-border-button-tertiary-hover)',
            active: 'var(--colors-border-button-tertiary-active)',
            disabled: 'var(--colors-border-button-tertiary-disabled)',
          },
          quaternary: {
            normal: 'var(--colors-border-button-quaternary-normal)',
            hover: 'var(--colors-border-button-quaternary-hover)',
            active: 'var(--colors-border-button-quaternary-active)',
            disabled: 'var(--colors-border-button-quaternary-disabled)',
          },
        },
        card: {
          primary: {
            normal: 'var(--colors-border-card-primary-normal)',
            hover: 'var(--colors-border-card-primary-hover)',
            active: 'var(--colors-border-card-primary-active)',
            disabled: 'var(--colors-border-card-primary-disabled)',
          },
          secondary: {
            normal: 'var(--colors-border-card-secondary-normal)',
            hover: 'var(--colors-border-card-secondary-hover)',
            active: 'var(--colors-border-card-secondary-active)',
            disabled: 'var(--colors-border-card-secondary-disabled)',
          },
        },
        popover: 'var(--colors-border-popover)',
        tab: {
          active: 'var(--colors-border-tab-active)',
        },
      },
      textColor: {
        accent: 'var(--colors-text-accent)',
        badge: {
          neutral: 'var(--colors-text-badge-neutral)',
        },
        on: {
          accent: 'var(--colors-text-on-accent)',
        },
        page: 'var(--colors-text-page)',
        primary: 'var(--colors-text-primary)',
        secondary: 'var(--colors-text-secondary)',
        tertiary: 'var(--colors-text-tertiary)',
        quaternary: 'var(--colors-text-quaternary)',
        button: {
          primary: { normal: 'var(--colors-text-button-primary-normal)' },
          secondary: {
            normal: 'var(--colors-text-button-secondary-normal)',
            hover: 'var(--colors-text-button-secondary-hover)',
            active: 'var(--colors-text-button-secondary-active)',
            disabled: 'var(--colors-text-button-secondary-disabled)',
          },
          tertiary: {
            normal: 'var(--colors-text-button-tertiary-normal)',
            hover: 'var(--colors-text-button-tertiary-hover)',
            active: 'var(--colors-text-button-tertiary-active)',
            disabled: 'var(--colors-text-button-tertiary-disabled)',
          },
          quaternary: {
            normal: 'var(--colors-text-button-quaternary-normal)',
            hover: 'var(--colors-text-button-quaternary-hover)',
            active: 'var(--colors-text-button-quaternary-active)',
            disabled: 'var(--colors-text-button-quaternary-disabled)',
          },
        },
      },
      ringColor: {
        accent: 'var(--colors-ring-accent)',
      },
      borderRadius: {
        button: '10px',
        card: '16px',
        dialog: '16px',
        popover: '14px',
      },
      animation: {
        spin: 'spin 1.5s linear infinite',
      },
      colors: { current: 'currentColor' },
      dropShadow: { popover: 'rgba(0, 0, 0, 0.1) 0px 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 4px 10px 0px' },
      maxWidth: { '8xl': '1440px' },
      width: { full: '100%' },
    },
    width: { sidebar: '256px' },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
  darkMode: 'class',
};
