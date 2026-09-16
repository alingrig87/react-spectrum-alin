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

import {Heading, Text} from '@react-spectrum/native';

const meta: Meta<typeof Text> = {
  title: 'Native/Text',
  component: Text,
  argTypes: {
    variant: {control: 'select', options: ['body', 'detail']},
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']}
  }
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {children: 'The quick brown fox jumps over the lazy dog.', variant: 'body', size: 'M'}
};

/** Body vs. detail variants, at their default size. */
export const Variants: Story = {
  render: () => (
    <View style={{gap: 8}}>
      <Text variant="body">Body text — Spectrum's default running text.</Text>
      <Text variant="detail">Detail text — smaller, medium-weight, for metadata.</Text>
    </View>
  )
};

/** All four sizes (S/M/L/XL) for both variants. */
export const Sizes: Story = {
  render: () => (
    <View style={{gap: 16}}>
      <View style={{gap: 4}}>
        <Text variant="body" size="S">Body S</Text>
        <Text variant="body" size="M">Body M</Text>
        <Text variant="body" size="L">Body L</Text>
        <Text variant="body" size="XL">Body XL</Text>
      </View>
      <View style={{gap: 4}}>
        <Text variant="detail" size="S">Detail S</Text>
        <Text variant="detail" size="M">Detail M</Text>
        <Text variant="detail" size="L">Detail L</Text>
        <Text variant="detail" size="XL">Detail XL</Text>
      </View>
    </View>
  )
};

/** `Heading`, at each of its four sizes. */
export const Headings: Story = {
  render: () => (
    <View style={{gap: 8}}>
      <Heading size="S">Heading S</Heading>
      <Heading size="M">Heading M</Heading>
      <Heading size="L">Heading L</Heading>
      <Heading size="XL">Heading XL</Heading>
    </View>
  )
};

/** A typical Heading + Text pairing, as in a card or section. */
export const HeadingWithBody: Story = {
  render: () => (
    <View style={{gap: 8, maxWidth: 320}}>
      <Heading size="M">Section title</Heading>
      <Text>
        Supporting body copy that explains the section in a bit more detail, wrapping across
        multiple lines as needed.
      </Text>
    </View>
  )
};
