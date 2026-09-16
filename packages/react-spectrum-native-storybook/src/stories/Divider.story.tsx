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
import {Text, View} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {Divider} from '@react-spectrum/native';

const meta: Meta<typeof Divider> = {
  title: 'Native/Divider',
  component: Divider,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L']},
    orientation: {control: 'select', options: ['horizontal', 'vertical']}
  }
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: args => (
    <View style={{width: 240, gap: 12}}>
      <Text>Above</Text>
      <Divider {...args} />
      <Text>Below</Text>
    </View>
  ),
  args: {size: 'M', orientation: 'horizontal'}
};

/** All three thicknesses (S/M/L) stacked. */
export const Sizes: Story = {
  render: () => (
    <View style={{width: 240, gap: 16}}>
      <Divider size="S" />
      <Divider size="M" />
      <Divider size="L" />
    </View>
  )
};

/** Vertical orientation, used to separate items in a row. */
export const Vertical: Story = {
  render: () => (
    <View style={{flexDirection: 'row', height: 40, alignItems: 'center', gap: 12}}>
      <Text>Left</Text>
      <Divider orientation="vertical" size="S" />
      <Text>Middle</Text>
      <Divider orientation="vertical" size="M" />
      <Text>Right</Text>
    </View>
  )
};
