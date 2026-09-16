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

import {Button, Card} from '@react-spectrum/native';

const meta: Meta<typeof Card> = {
  title: 'Native/Card',
  component: Card,
  argTypes: {
    size: {control: 'select', options: ['XS', 'S', 'M', 'L', 'XL']},
    variant: {control: 'select', options: ['primary', 'secondary', 'tertiary', 'quiet']},
    isSelected: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    size: 'M',
    variant: 'primary',
    title: 'Mountain sunrise',
    description: 'A collection of landscape photography from the Pacific Northwest.'
  }
};

export const WithImage: Story = {
  args: {
    size: 'M',
    variant: 'primary',
    image: <View style={{width: '100%', height: '100%', backgroundColor: 'rgb(203, 226, 254)'}} />,
    title: 'Mountain sunrise',
    description: 'A collection of landscape photography from the Pacific Northwest.'
  }
};

export const WithFooter: Story = {
  args: {
    size: 'M',
    variant: 'primary',
    image: <View style={{width: '100%', height: '100%', backgroundColor: 'rgb(203, 226, 254)'}} />,
    title: 'Mountain sunrise',
    description: 'A collection of landscape photography.',
    footer: (
      <>
        <Button variant="secondary" fillStyle="outline" size="S">Share</Button>
        <Button variant="accent" size="S">View</Button>
      </>
    )
  }
};

/** Every visual variant side by side. */
export const Variants: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 16, flexWrap: 'wrap'}}>
      <Card {...args} variant="primary" title="Primary" description="Elevated filled surface." />
      <Card {...args} variant="secondary" title="Secondary" description="Flat filled surface." />
      <Card {...args} variant="tertiary" title="Tertiary" description="Outlined surface." />
      <Card {...args} variant="quiet" title="Quiet" description="No background or border." />
    </View>
  ),
  args: {size: 'S'}
};

/** All five sizes (XS-XL) side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap'}}>
      {(['XS', 'S', 'M', 'L', 'XL'] as const).map(size => (
        <Card key={size} {...args} size={size} title={size} description={`Size ${size} card.`} />
      ))}
    </View>
  ),
  args: {variant: 'primary'}
};

export const Selected: Story = {
  args: {
    size: 'M',
    variant: 'primary',
    isSelected: true,
    title: 'Selected card',
    description: 'Shows the selection ring border.'
  }
};

export const Pressable: Story = {
  args: {
    size: 'M',
    variant: 'primary',
    title: 'Tap me',
    description: 'This card has an onPress handler.',
    onPress: () => {}
  }
};
