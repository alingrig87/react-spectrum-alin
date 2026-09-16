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

import {ColorSlider} from '@react-spectrum/native';

const meta: Meta<typeof ColorSlider> = {
  title: 'Native/Color/ColorSlider',
  component: ColorSlider,
  argTypes: {
    channel: {control: 'select', options: ['hue', 'saturation', 'brightness', 'alpha']},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ColorSlider>;

export const Hue: Story = {
  args: {channel: 'hue', value: 210, label: 'Hue'}
};

export const AllChannels: Story = {
  render: () => (
    <View style={{gap: 16}}>
      <ColorSlider channel="hue" value={210} hue={210} saturation={80} brightness={90} label="Hue" />
      <ColorSlider channel="saturation" value={80} hue={210} saturation={80} brightness={90} label="Saturation" />
      <ColorSlider channel="brightness" value={90} hue={210} saturation={80} brightness={90} label="Brightness" />
      <ColorSlider channel="alpha" value={60} hue={210} saturation={80} brightness={90} label="Alpha" />
    </View>
  )
};

export const Disabled: Story = {
  args: {channel: 'hue', value: 210, label: 'Hue', isDisabled: true}
};
