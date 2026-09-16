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

import {Avatar} from '@react-spectrum/native';

const AVATAR_URL = 'https://i.imgur.com/kJOwAdv.png';

const meta: Meta<typeof Avatar> = {
  title: 'Native/Avatar',
  component: Avatar,
  argTypes: {
    size: {control: 'number'},
    isOverBackground: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: AVATAR_URL,
    alt: 'Devon Govett',
    size: 32
  }
};

/** No `src` — falls back to an initials placeholder derived from `alt`. */
export const InitialsPlaceholder: Story = {
  args: {
    alt: 'Devon Govett',
    size: 32
  }
};

/** The full real-component size scale, image and placeholder side by side. */
export const Sizes: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
      {[16, 20, 24, 28, 32, 36, 40, 48, 64, 96].map(size => (
        <Avatar key={size} src={AVATAR_URL} alt="Devon Govett" size={size} />
      ))}
    </View>
  )
};

/** Initials placeholders at a few sizes, for single- and multi-word names. */
export const PlaceholderSizes: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
      <Avatar alt="Ada" size={24} />
      <Avatar alt="Ada Lovelace" size={32} />
      <Avatar alt="Ada Lovelace" size={48} />
      <Avatar alt="Ada Lovelace" size={64} />
    </View>
  )
};

/** `isOverBackground` draws a light outline — most visible on a color background. */
export const OverBackground: Story = {
  render: () => (
    <View style={{backgroundColor: '#3b63fb', padding: 16, borderRadius: 8, flexDirection: 'row', gap: 12}}>
      <Avatar src={AVATAR_URL} alt="Devon Govett" size={40} isOverBackground />
      <Avatar alt="Ada Lovelace" size={40} isOverBackground />
      <Avatar src={AVATAR_URL} alt="Devon Govett" size={80} isOverBackground />
    </View>
  )
};
