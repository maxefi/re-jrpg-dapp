module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
          alias: {
            '@graphql': './src/graphql',
            '@components': './src/components',
            '@icons': './src/icons',
            '@ui-kit': './src/ui-kit',
            '@constants': './src/constants',
            '@interfaces': './src/interfaces',
            '@screens': './src/screens',
            '@stores': './src/stores',
            '@utils': './src/utils',
            '@native': './src/native',
            '@testing': './src/testing',
            '@hooks': './src/hooks',
            '@assets': './assets'
          }
        },
      ],
      "inline-dotenv"
    ]
  };
};
