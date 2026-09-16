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

import {InlineAlert} from '@react-spectrum/native';

const meta: Meta<typeof InlineAlert> = {
  title: 'Native/InlineAlert',
  component: InlineAlert,
  argTypes: {
    variant: {control: 'select', options: ['informative', 'positive', 'notice', 'negative', 'neutral']},
    fillStyle: {control: 'select', options: ['border', 'subtleFill', 'boldFill']}
  }
};

export default meta;

type Story = StoryObj<typeof InlineAlert>;

export const Default: Story = {
  args: {
    variant: 'informative',
    fillStyle: 'border',
    title: 'Payment method updated',
    children: 'The card on file will be used for all future purchases.'
  }
};

/** All 5 variants at the default `border` fillStyle. */
export const Variants: Story = {
  render: () => (
    <View style={{gap: 12, width: 320}}>
      <InlineAlert variant="informative" title="Informative">A new version is available.</InlineAlert>
      <InlineAlert variant="positive" title="Positive">Your changes have been saved.</InlineAlert>
      <InlineAlert variant="notice" title="Notice">Your trial ends in 3 days.</InlineAlert>
      <InlineAlert variant="negative" title="Negative">Unable to save your changes.</InlineAlert>
      <InlineAlert variant="neutral" title="Neutral">This feature is in beta.</InlineAlert>
    </View>
  )
};

/** All 3 fill styles for the same variant. */
export const FillStyles: Story = {
  render: args => (
    <View style={{gap: 12, width: 320}}>
      <InlineAlert {...args} fillStyle="border" />
      <InlineAlert {...args} fillStyle="subtleFill" />
      <InlineAlert {...args} fillStyle="boldFill" />
    </View>
  ),
  args: {variant: 'negative', title: 'Unable to save', children: 'Check your connection and try again.'}
};

/** Body text only, no title. */
export const NoTitle: Story = {
  args: {variant: 'informative', children: 'A new version of this app is available.'}
};
