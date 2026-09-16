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

import {ColorField} from '@react-spectrum/native';

const meta: Meta<typeof ColorField> = {
  title: 'Native/Color/ColorField',
  component: ColorField,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ColorField>;

export const Default: Story = {
  args: {value: '#7EF08C', label: 'Fill color', size: 'M'}
};

export const WithDescription: Story = {
  args: {value: '#5AA9FA', label: 'Accent color', description: 'Used for links and primary actions.', size: 'M'}
};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ColorField value="#F5A623" label="Small" size="S" />
      <ColorField value="#F5A623" label="Medium" size="M" />
      <ColorField value="#F5A623" label="Large" size="L" />
      <ColorField value="#F5A623" label="Extra large" size="XL" />
    </View>
  )
};

export const Disabled: Story = {
  args: {value: '#7EF08C', label: 'Fill color', isDisabled: true}
};
