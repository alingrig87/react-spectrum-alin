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

import {Menu, MenuItem} from '@react-spectrum/native';

const meta: Meta<typeof Menu> = {
  title: 'Native/Menu',
  component: Menu,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']}
  }
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: args => (
    <View style={{width: 240, borderWidth: 1, borderColor: '#E1E1E1', borderRadius: 8}}>
      <Menu {...args}>
        <MenuItem shortcut="⌘C">Copy</MenuItem>
        <MenuItem shortcut="⌘V">Paste</MenuItem>
        <MenuItem isSelected>Show grid</MenuItem>
        <MenuItem isDisabled>Delete</MenuItem>
      </Menu>
    </View>
  ),
  args: {size: 'M'}
};

export const Sizes: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 16}}>
      {(['S', 'M', 'L', 'XL'] as const).map(size => (
        <View key={size} style={{width: 160, borderWidth: 1, borderColor: '#E1E1E1', borderRadius: 8}}>
          <Menu size={size}>
            <MenuItem>{size} item</MenuItem>
            <MenuItem isSelected>Selected</MenuItem>
          </Menu>
        </View>
      ))}
    </View>
  )
};
