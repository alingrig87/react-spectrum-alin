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

import {Button} from '@react-spectrum/native';

const meta: Meta<typeof Button> = {
  title: 'Native/Button',
  component: Button,
  argTypes: {
    variant: {control: 'select', options: ['primary', 'secondary', 'accent', 'negative']},
    fillStyle: {control: 'select', options: ['fill', 'outline']},
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isDisabled: {control: 'boolean'},
    isPending: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Save',
    variant: 'primary',
    fillStyle: 'fill',
    size: 'M',
    isDisabled: false,
    isPending: false
  }
};

/** Every variant, fill style. */
export const Variants: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button {...args} variant="primary">Primary</Button>
        <Button {...args} variant="secondary">Secondary</Button>
      </View>
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button {...args} variant="accent">Accent</Button>
        <Button {...args} variant="negative">Negative</Button>
      </View>
    </View>
  ),
  args: {fillStyle: 'fill', size: 'M', children: 'Button'}
};

/** Outline fillStyle across variants. */
export const Outline: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="accent">Accent</Button>
      <Button {...args} variant="negative">Negative</Button>
    </View>
  ),
  args: {fillStyle: 'outline', size: 'M', children: 'Button'}
};

/** All four sizes (S/M/L/XL) side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
      <Button {...args} size="S">Small</Button>
      <Button {...args} size="M">Medium</Button>
      <Button {...args} size="L">Large</Button>
      <Button {...args} size="XL">Extra large</Button>
    </View>
  ),
  args: {variant: 'accent', fillStyle: 'fill', children: 'Button'}
};

export const Disabled: Story = {
  args: {children: 'Save', variant: 'accent', fillStyle: 'fill', size: 'M', isDisabled: true}
};

export const Pending: Story = {
  args: {children: 'Saving…', variant: 'accent', fillStyle: 'fill', size: 'M', isPending: true}
};
