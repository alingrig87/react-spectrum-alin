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
import {useState} from 'react';
import {View} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {SearchField} from '@react-spectrum/native';

const meta: Meta<typeof SearchField> = {
  title: 'Native/SearchField',
  component: SearchField,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isDisabled: {control: 'boolean'},
    isInvalid: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof SearchField>;

function Interactive(props: React.ComponentProps<typeof SearchField>) {
  let [value, setValue] = useState(props.value ?? '');
  return <SearchField {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Search', placeholder: 'Search products…', size: 'M'}
};

/** Empty (no clear button) vs. with text (clear button shown). */
export const ClearButton: Story = {
  render: args => (
    <View style={{gap: 16}}>
      <Interactive {...args} value="" label="Empty" />
      <Interactive {...args} value="sneakers" label="With text" />
    </View>
  ),
  args: {size: 'M'}
};

/** All four sizes (S/M/L/XL) stacked. */
export const Sizes: Story = {
  render: args => (
    <View style={{gap: 16}}>
      <Interactive {...args} size="S" label="Small" />
      <Interactive {...args} size="M" label="Medium" />
      <Interactive {...args} size="L" label="Large" />
      <Interactive {...args} size="XL" label="Extra large" />
    </View>
  ),
  args: {value: 'query'}
};

export const Invalid: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Search', value: '???', isInvalid: true, errorMessage: 'Enter a valid search term.', size: 'M'}
};

export const Disabled: Story = {
  args: {label: 'Search', value: 'archived', isDisabled: true, size: 'M'}
};
