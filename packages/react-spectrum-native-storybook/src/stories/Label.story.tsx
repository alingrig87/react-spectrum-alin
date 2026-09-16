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

import {Label} from '@react-spectrum/native';

const meta: Meta<typeof Label> = {
  title: 'Native/Label',
  component: Label,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    necessityIndicator: {control: 'select', options: ['icon', 'label']},
    isRequired: {control: 'boolean'},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {children: 'Email address', size: 'M'}
};

export const Required: Story = {
  args: {children: 'Email address', size: 'M', isRequired: true}
};

/** `necessityIndicator="label"` shows a "(required)"/"(optional)" suffix instead of a `*`. */
export const NecessityLabel: Story = {
  render: () => (
    <View style={{gap: 8}}>
      <Label necessityIndicator="label" isRequired>Email address</Label>
      <Label necessityIndicator="label" isRequired={false}>Middle name</Label>
    </View>
  )
};

/** All four sizes (S/M/L/XL) side by side. */
export const Sizes: Story = {
  render: () => (
    <View style={{gap: 8}}>
      <Label size="S">Small</Label>
      <Label size="M">Medium</Label>
      <Label size="L">Large</Label>
      <Label size="XL">Extra large</Label>
    </View>
  )
};

export const Disabled: Story = {
  args: {children: 'Email address', size: 'M', isRequired: true, isDisabled: true}
};
