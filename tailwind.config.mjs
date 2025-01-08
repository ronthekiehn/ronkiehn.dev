/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		fontFamily: {
		  sans: ['JetBrains Mono', 'monospace', 'sans-serif'],
		  
		},
		backgroundImage: {
			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
		  },
		borderRadius: {
		xl: "0.75rem",
		lg: "calc(0.75rem - 2px)",
		md: "calc(0.75rem - 4px)",
		},
	  },
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwindcss-motion')
	],
  }