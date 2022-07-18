const { vanillaExtractPlugin } = require('@vanilla-extract/vite-plugin');

const { resolve } = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite',
  },

  async viteFinal(config, { configType }) {
    return {
      ...config,
      plugins: [...config.plugins, vanillaExtractPlugin()],
      resolve: { ...config.resolve, alias: {} },
    };
  },

  staticDirs: ['../public'],
};
