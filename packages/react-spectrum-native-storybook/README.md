# react-spectrum-native-storybook

An on-device [Storybook](https://github.com/storybookjs/react-native) (Expo) app for
[`@react-spectrum/native`](../@react-spectrum/native) — lets you view the `Button`, `Checkbox`
and `TextField` stories on a simulator or physical device.

## Usage

```
yarn ios      # or: yarn android / yarn web
```

Each of those first regenerates `.storybook/storybook.requires.ts` (via `sb-rn-get-stories`,
since Metro can't do webpack-style dynamic `require`) from every `*.story.tsx` file under
`src/stories/`, then starts Expo. Re-run `yarn storybook-generate` after adding or removing a
story file if you're not going through one of the `start`/`ios`/`android`/`web` scripts.
