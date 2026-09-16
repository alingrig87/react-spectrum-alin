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

import {ActionButton} from '@react-spectrum/native';

const meta: Meta<typeof ActionButton> = {
  title: 'Native/ActionButton',
  component: ActionButton,
  argTypes: {
    size: {control: 'select', options: ['XS', 'S', 'M', 'L', 'XL']},
    isQuiet: {control: 'boolean'},
    isDisabled: {control: 'boolean'},
    isPending: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ActionButton>;

export const Default: Story = {
  args: {children: 'Edit', size: 'M', isQuiet: false, isDisabled: false, isPending: false}
};

/** Default (subtle gray fill) vs. quiet (transparent at rest). */
export const QuietVsDefault: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8}}>
      <ActionButton {...args} isQuiet={false}>Default</ActionButton>
      <ActionButton {...args} isQuiet>Quiet</ActionButton>
    </View>
  ),
  args: {size: 'M'}
};

/** All five sizes (XS/S/M/L/XL) side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
      <ActionButton {...args} size="XS">Extra small</ActionButton>
      <ActionButton {...args} size="S">Small</ActionButton>
      <ActionButton {...args} size="M">Medium</ActionButton>
      <ActionButton {...args} size="L">Large</ActionButton>
      <ActionButton {...args} size="XL">Extra large</ActionButton>
    </View>
  ),
  args: {}
};

export const Disabled: Story = {
  args: {children: 'Edit', size: 'M', isDisabled: true}
};

export const Pending: Story = {
  args: {children: 'Saving…', size: 'M', isPending: true}
};
