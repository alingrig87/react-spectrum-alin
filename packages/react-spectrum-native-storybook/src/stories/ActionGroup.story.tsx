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

import {ActionGroup, ActionGroupItem} from '@react-spectrum/native';

const alignItems: ActionGroupItem[] = [
  {key: 'left', label: 'Left'},
  {key: 'center', label: 'Center'},
  {key: 'right', label: 'Right'}
];

const meta: Meta<typeof ActionGroup> = {
  title: 'Native/ActionGroup',
  component: ActionGroup,
  argTypes: {
    selectionMode: {control: 'select', options: ['none', 'single', 'multiple']},
    size: {control: 'select', options: ['XS', 'S', 'M', 'L', 'XL']},
    density: {control: 'select', options: ['compact', 'regular']},
    orientation: {control: 'select', options: ['horizontal', 'vertical']},
    isEmphasized: {control: 'boolean'},
    isQuiet: {control: 'boolean'},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ActionGroup>;

function Interactive(props: React.ComponentProps<typeof ActionGroup>) {
  let [selectedKeys, setSelectedKeys] = useState<string[]>(props.selectedKeys ?? []);
  return <ActionGroup {...props} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />;
}

/** Single selection, like a segmented control (e.g. text alignment). */
export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {items: alignItems, selectionMode: 'single', selectedKeys: ['left'], isEmphasized: true}
};

/** Multiple selection — any number of items may be selected at once. */
export const MultipleSelection: Story = {
  render: args => <Interactive {...args} />,
  args: {
    items: [
      {key: 'bold', label: 'Bold'},
      {key: 'italic', label: 'Italic'},
      {key: 'underline', label: 'Underline'}
    ],
    selectionMode: 'multiple',
    selectedKeys: ['bold']
  }
};

/** `selectionMode="none"` — a plain, non-toggling group of action items. */
export const NoSelection: Story = {
  args: {
    items: [
      {key: 'cut', label: 'Cut'},
      {key: 'copy', label: 'Copy'},
      {key: 'paste', label: 'Paste'}
    ],
    selectionMode: 'none'
  }
};

/** Compact (edge-to-edge) vs. regular density. */
export const Density: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <ActionGroup {...args} density="regular" />
      <ActionGroup {...args} density="compact" />
    </View>
  ),
  args: {items: alignItems, selectionMode: 'single', selectedKeys: ['center'], isEmphasized: true}
};

/** Vertical orientation. */
export const Vertical: Story = {
  args: {
    items: alignItems,
    selectionMode: 'single',
    selectedKeys: ['left'],
    orientation: 'vertical',
    isEmphasized: true
  }
};

export const Disabled: Story = {
  args: {items: alignItems, selectionMode: 'single', selectedKeys: ['left'], isDisabled: true}
};
