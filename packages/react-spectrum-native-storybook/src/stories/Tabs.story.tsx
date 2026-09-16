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
import {Text, View} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {Tab, TabList, TabPanel, Tabs} from '@react-spectrum/native';

const meta: Meta<typeof Tabs> = {
  title: 'Native/Tabs',
  component: Tabs,
  argTypes: {
    density: {control: 'select', options: ['compact', 'regular']},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: args => (
    <Tabs {...args} defaultSelectedKey="details">
      <TabList>
        <Tab id="details">Details</Tab>
        <Tab id="shipping">Shipping</Tab>
        <Tab id="billing">Billing</Tab>
      </TabList>
      <TabPanel id="details">
        <Text>Order details go here.</Text>
      </TabPanel>
      <TabPanel id="shipping">
        <Text>Shipping information goes here.</Text>
      </TabPanel>
      <TabPanel id="billing">
        <Text>Billing information goes here.</Text>
      </TabPanel>
    </Tabs>
  ),
  args: {density: 'regular'}
};

/** Compact vs. regular density. */
export const Density: Story = {
  render: () => (
    <View style={{gap: 24}}>
      <Tabs density="compact" defaultSelectedKey="a">
        <TabList>
          <Tab id="a">Compact A</Tab>
          <Tab id="b">Compact B</Tab>
        </TabList>
        <TabPanel id="a"><Text>Panel A</Text></TabPanel>
        <TabPanel id="b"><Text>Panel B</Text></TabPanel>
      </Tabs>
      <Tabs density="regular" defaultSelectedKey="a">
        <TabList>
          <Tab id="a">Regular A</Tab>
          <Tab id="b">Regular B</Tab>
        </TabList>
        <TabPanel id="a"><Text>Panel A</Text></TabPanel>
        <TabPanel id="b"><Text>Panel B</Text></TabPanel>
      </Tabs>
    </View>
  )
};

/** One tab disabled individually. */
export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultSelectedKey="details">
      <TabList>
        <Tab id="details">Details</Tab>
        <Tab id="shipping" isDisabled>Shipping</Tab>
        <Tab id="billing">Billing</Tab>
      </TabList>
      <TabPanel id="details"><Text>Order details go here.</Text></TabPanel>
      <TabPanel id="shipping"><Text>Shipping information goes here.</Text></TabPanel>
      <TabPanel id="billing"><Text>Billing information goes here.</Text></TabPanel>
    </Tabs>
  )
};

export const AllDisabled: Story = {
  render: args => (
    <Tabs {...args} defaultSelectedKey="details">
      <TabList>
        <Tab id="details">Details</Tab>
        <Tab id="shipping">Shipping</Tab>
      </TabList>
      <TabPanel id="details"><Text>Order details go here.</Text></TabPanel>
      <TabPanel id="shipping"><Text>Shipping information goes here.</Text></TabPanel>
    </Tabs>
  ),
  args: {isDisabled: true}
};
