/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // custom css for font
      fontSize: {
        'course-details-heading-small': ['26px', { lineHeight: '36px' }],
        'course-details-heading-large': ['36px', { lineHeight: '44px' }],
        'home-heading-small': ['28px', { lineHeight: '34px' }],
        'home-heading-large': ['48px', { lineHeight: '56px' }],
        'default': ['15px', { lineHeight: '21px' }],
      },
      // custom classes for grid template
      gridTemplateColumns:{
        'auto':'repeat(auto-fit,minmax(200px,1fr))'
      },
      spacing:{
        'section-height':'500px',
      }
    },
  },
  plugins: [],
}
