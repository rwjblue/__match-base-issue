module.exports = {
  root: true,
  rules: {
    'no-console': 'error'
  },
  overrides: [
    {
      // node files
      files: ['index.js'],
      rules: {
        'no-console': 'off'
      },
    }
  ]
};
