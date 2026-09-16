/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import {View} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {StatusLight, StatusLightVariant} from '@react-spectrum/native';

const meta: Meta<typeof StatusLight> = {
  title: 'Native/StatusLight',
  component: StatusLight,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'informative',
        'neutral',
        'positive',
        'notice',
        'negative',
        'celery',
        'chartreuse',
        'cyan',
        'fuchsia',
        'purple',
        'magenta',
        'indigo',
        'seafoam',
        'yellow',
        'pink',
        'turquoise',
        'cinnamon',
        'brown',
        'silver'
      ]
    },
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']}
  }
};

export default meta;

type Story = StoryObj<typeof StatusLight>;

export const Default: Story = {
  args: {
    children: 'Online',
    variant: 'positive',
    size: 'M'
  }
};

const SEMANTIC_VARIANTS: StatusLightVariant[] = ['neutral', 'informative', 'positive', 'notice', 'negative'];

/** The 5 semantic variants. */
export const SemanticVariants: Story = {
  render: args => (
    <View style={{gap: 8}}>
      <StatusLight {...args} variant="neutral">Neutral</StatusLight>
      <StatusLight {...args} variant="informative">Informative</StatusLight>
      <StatusLight {...args} variant="positive">Positive</StatusLight>
      <StatusLight {...args} variant="notice">Notice</StatusLight>
      <StatusLight {...args} variant="negative">Negative</StatusLight>
    </View>
  ),
  args: {size: 'M'}
};

const EXTENDED_VARIANTS: StatusLightVariant[] = [
  'celery',
  'chartreuse',
  'cyan',
  'fuchsia',
  'purple',
  'magenta',
  'indigo',
  'seafoam',
  'yellow',
  'pink',
  'turquoise',
  'cinnamon',
  'brown',
  'silver'
];

/** The extended "fun color" hue variants. */
export const ExtendedColors: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 12, flexWrap: 'wrap', maxWidth: 360}}>
      {EXTENDED_VARIANTS.map(variant => (
        <StatusLight key={variant} {...args} variant={variant}>
          {variant}
        </StatusLight>
      ))}
    </View>
  ),
  args: {size: 'M'}
};

/** All four sizes (S/M/L/XL) side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{gap: 8}}>
      <StatusLight {...args} size="S">Small</StatusLight>
      <StatusLight {...args} size="M">Medium</StatusLight>
      <StatusLight {...args} size="L">Large</StatusLight>
      <StatusLight {...args} size="XL">Extra large</StatusLight>
    </View>
  ),
  args: {variant: 'positive'}
};

/** Without a label — just the dot (still needs an accessibility label in a real app). */
export const NoLabel: Story = {
  args: {variant: 'positive', size: 'M'}
};
