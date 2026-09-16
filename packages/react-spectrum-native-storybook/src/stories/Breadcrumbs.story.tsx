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

import {Breadcrumb, Breadcrumbs} from '@react-spectrum/native';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Native/Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {
    size: {control: 'select', options: ['M', 'L']},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: args => (
    <Breadcrumbs {...args}>
      <Breadcrumb onPress={() => {}}>Home</Breadcrumb>
      <Breadcrumb onPress={() => {}}>Trends</Breadcrumb>
      <Breadcrumb onPress={() => {}}>React Spectrum</Breadcrumb>
    </Breadcrumbs>
  ),
  args: {size: 'M'}
};

/** Both sizes (M/L) side by side. */
export const Sizes: Story = {
  render: () => (
    <View style={{gap: 16}}>
      <Breadcrumbs size="M">
        <Breadcrumb onPress={() => {}}>Home</Breadcrumb>
        <Breadcrumb onPress={() => {}}>Folder</Breadcrumb>
        <Breadcrumb onPress={() => {}}>File</Breadcrumb>
      </Breadcrumbs>
      <Breadcrumbs size="L">
        <Breadcrumb onPress={() => {}}>Home</Breadcrumb>
        <Breadcrumb onPress={() => {}}>Folder</Breadcrumb>
        <Breadcrumb onPress={() => {}}>File</Breadcrumb>
      </Breadcrumbs>
    </View>
  )
};

/** A single root item (no chevron, always current). */
export const SingleItem: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb>Home</Breadcrumb>
    </Breadcrumbs>
  )
};

export const Disabled: Story = {
  render: args => (
    <Breadcrumbs {...args}>
      <Breadcrumb onPress={() => {}}>Home</Breadcrumb>
      <Breadcrumb onPress={() => {}}>Trends</Breadcrumb>
      <Breadcrumb onPress={() => {}}>React Spectrum</Breadcrumb>
    </Breadcrumbs>
  ),
  args: {size: 'M', isDisabled: true}
};
