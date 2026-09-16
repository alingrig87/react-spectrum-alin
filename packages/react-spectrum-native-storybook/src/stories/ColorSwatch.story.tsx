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

import {ColorSwatch} from '@react-spectrum/native';

const meta: Meta<typeof ColorSwatch> = {
  title: 'Native/Color/ColorSwatch',
  component: ColorSwatch,
  argTypes: {
    size: {control: 'select', options: ['XS', 'S', 'M', 'L']},
    rounding: {control: 'select', options: ['default', 'none', 'full']}
  }
};

export default meta;

type Story = StoryObj<typeof ColorSwatch>;

export const Default: Story = {
  args: {color: '#7EF08C', size: 'M', rounding: 'default'}
};

export const Sizes: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
      <ColorSwatch color="#5AA9FA" size="XS" />
      <ColorSwatch color="#5AA9FA" size="S" />
      <ColorSwatch color="#5AA9FA" size="M" />
      <ColorSwatch color="#5AA9FA" size="L" />
    </View>
  )
};

export const Rounding: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 8}}>
      <ColorSwatch color="#F5A623" rounding="none" />
      <ColorSwatch color="#F5A623" rounding="default" />
      <ColorSwatch color="#F5A623" rounding="full" />
    </View>
  )
};

export const AlphaAndTransparent: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 8}}>
      <ColorSwatch color="rgba(233, 30, 99, 0.5)" />
      <ColorSwatch color="rgba(0, 0, 0, 0)" />
    </View>
  )
};
