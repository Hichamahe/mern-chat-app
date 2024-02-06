/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    backgroundColor:{
     principale:'rgb(121,113,208)'
    },
    textColor:{
     primary:'rgb(121,113,208)'
    },
     boxShadow :{
    "-tw-shadow": "0px 0px 100px 30px rgb(0 0 0 / 0.25)",
    "-tw-shadow-colored": "0 25px 50px -12px",
    "box-shadow": "var(--tw-ring-offset-shadow, 0 0 #0000), var(-tw-ring-shadow, 0 0 #0000), var(-tw-shadow)"
    },
      screens: {  
      'xxs': {'min' :'0px', 'max' :'200px'}, 
      'xs': {'min' :'200px', 'max' :'600px'},  
      // => @media (max-width: 484px)  
      'sm': {'min': '600px', 'max': '768px'},
      // => @media (min-width: 640px and max-width: 767px)
      'md': {'min': '768px', 'max': '992px'},
      // => @media (min-width: 768px and max-width: 1023px)
      'lg': {'min': '992px', 'max': '1200px'},
      // => @media (min-width: 1024px and max-width: 1279px)
      'xl': {'min': '1280px', 'max': '1535px'},
      // => @media (min-width: 1280px and max-width: 1535px)
      '2xl': {'min': '1536px'},
      // => @media (min-width: 1536px)
    },
    }


  },
  plugins: [],
}

