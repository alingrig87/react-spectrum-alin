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

import {Badge, BadgeVariant} from '@react-spectrum/native';

const meta: Meta<typeof Badge> = {
  title: 'Native/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'accent',
        'informative',
        'neutral',
        'positive',
        'notice',
        'negative',
        'gray',
        'red',
        'orange',
        'yellow',
        'chartreuse',
        'celery',
        'green',
        'seafoam',
        'cyan',
        'blue',
        'indigo',
        'purple',
        'fuchsia',
        'magenta',
        'pink',
        'turquoise',
        'brown',
        'cinnamon',
        'silver'
      ]
    },
    fillStyle: {control: 'select', options: ['bold', 'subtle', 'outline']},
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']}
  }
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'New',
    variant: 'informative',
    fillStyle: 'bold',
    size: 'S'
  }
};

const SEMANTIC_VARIANTS: BadgeVariant[] = ['neutral', 'accent', 'informative', 'positive', 'notice', 'negative'];

/** The 6 semantic variants, one fillStyle at a time. */
export const SemanticVariants: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      {SEMANTIC_VARIANTS.map(variant => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </View>
  ),
  args: {fillStyle: 'bold', size: 'M'}
};

/** All 3 fill styles for the same variant, side by side. */
export const FillStyles: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8}}>
      <Badge {...args} fillStyle="bold">Bold</Badge>
      <Badge {...args} fillStyle="subtle">Subtle</Badge>
      <Badge {...args} fillStyle="outline">Outline</Badge>
    </View>
  ),
  args: {variant: 'positive', size: 'M'}
};

const EXTENDED_VARIANTS: BadgeVariant[] = [
  'gray',
  'red',
  'orange',
  'yellow',
  'chartreuse',
  'celery',
  'green',
  'seafoam',
  'cyan',
  'blue',
  'indigo',
  'purple',
  'fuchsia',
  'magenta',
  'pink',
  'turquoise',
  'brown',
  'cinnamon',
  'silver'
];

/** The extended "fun color" hue variants beyond the 6 semantic ones. */
export const ExtendedColors: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap', maxWidth: 400}}>
      {EXTENDED_VARIANTS.map(variant => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </View>
  ),
  args: {fillStyle: 'bold', size: 'M'}
};

/** All four sizes (S/M/L/XL) side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
      <Badge {...args} size="S">Small</Badge>
      <Badge {...args} size="M">Medium</Badge>
      <Badge {...args} size="L">Large</Badge>
      <Badge {...args} size="XL">Extra large</Badge>
    </View>
  ),
  args: {variant: 'accent', fillStyle: 'bold'}
};
