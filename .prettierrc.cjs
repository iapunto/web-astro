module.exports = {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  ignore: ['src/components/sections/home/zoho-form.html'],
};
