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

import {Tag} from '@react-spectrum/native';

const meta: Meta<typeof Tag> = {
  title: 'Native/Tag',
  component: Tag,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L']},
    isEmphasized: {control: 'boolean'},
    isSelected: {control: 'boolean'},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {children: 'Marketing', size: 'M'}
};

/** A removable tag — pressing the x calls `onRemove`. */
function RemovableExample(props: React.ComponentProps<typeof Tag>) {
  let [removed, setRemoved] = useState(false);
  if (removed) {
    return <Tag {...props} isDisabled>Removed</Tag>;
  }
  return <Tag {...props} onRemove={() => setRemoved(true)} />;
}

export const Removable: Story = {
  render: args => <RemovableExample {...args} />,
  args: {children: 'Removable tag', size: 'M'}
};

/** Selected, as a filter chip — default neutral fill vs. emphasized accent fill. */
export const Selected: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      <Tag {...args} isSelected={false}>Unselected</Tag>
      <Tag {...args} isSelected isEmphasized={false}>Selected</Tag>
      <Tag {...args} isSelected isEmphasized>Selected, emphasized</Tag>
    </View>
  ),
  args: {size: 'M'}
};

/** All three sizes (S/M/L) side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
      <Tag {...args} size="S">Small</Tag>
      <Tag {...args} size="M">Medium</Tag>
      <Tag {...args} size="L">Large</Tag>
    </View>
  ),
  args: {}
};

/** A group of tags wrapping, as they would inside a TagGroup. */
export const TagList: Story = {
  render: args => (
    <View style={{flexDirection: 'row', flexWrap: 'wrap', maxWidth: 260}}>
      <Tag {...args}>Marketing</Tag>
      <Tag {...args}>Sales</Tag>
      <Tag {...args}>Engineering</Tag>
      <Tag {...args}>Design</Tag>
      <Tag {...args}>Product</Tag>
    </View>
  ),
  args: {size: 'M'}
};

export const Disabled: Story = {
  args: {children: 'Disabled tag', size: 'M', isDisabled: true}
};
