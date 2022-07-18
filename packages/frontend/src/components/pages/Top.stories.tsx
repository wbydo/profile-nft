import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Top } from './Top';

export default {
  title: 'pages/Top',
  component: Top,
} as ComponentMeta<typeof Top>;

const Template: ComponentStory<typeof Top> = (args) => <Top />;

export const Primary = Template.bind({});
