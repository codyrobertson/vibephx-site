const path = require('path')
function tokenExtend(){
  try { return require('./styles/tailwind.tokens.config.js').theme.extend || {} } catch { return {} }
}
module.exports = {
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  theme: { extend: tokenExtend() },
  plugins: [],
}
