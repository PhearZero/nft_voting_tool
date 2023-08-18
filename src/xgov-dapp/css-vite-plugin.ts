export default ()=>({
  enforce: 'post',
  apply: 'serve',
  transform (code, id, ssr) {
    if (ssr && id.endsWith('.css')) {
      return `global.css = (global.css || []).concat("${code.trim().slice(16, -1)}")`;
    }
  },
})
