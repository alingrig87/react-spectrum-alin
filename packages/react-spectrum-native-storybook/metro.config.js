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

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const {getDefaultConfig} = require('expo/metro-config');

// This package lives in a yarn workspace, so Metro needs to look past its own node_modules
// into the monorepo root to resolve the @react-spectrum/native workspace package.
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
];
// Left at its default (false), not disabled: some of this package's own
// transitive deps get nested under node_modules/<pkg>/node_modules/ rather
// than hoisted (e.g. @storybook/react-native's pinned react/storybook-core
// versions, via this repo's root "resolutions"), and only hierarchical
// lookup lets Metro find those nested copies.

// The root pins react@^19.2.0 (unrelated desktop packages), but this app
// needs react@18.2.0 (Expo 51/RN 0.74). With hierarchical lookup on, Metro
// can resolve two different `react` installs for different requirers in
// the same bundle, which React refuses to render ("Minified React error
// #525: ... Multiple copies of the react package is used" — the exact
// failure hit and fixed on the sibling react-spectrum-charts-alin repo's
// own on-device Storybook). `resolver.extraNodeModules` does NOT fix this
// (it's only a fallback for otherwise-unresolvable modules); a custom
// resolveRequest is the one hook that overrides resolution unconditionally.
// Deliberately NOT including react-native here: on the web platform,
// Metro/Expo's own default config aliases the bare "react-native"
// specifier to react-native-web, and forcing it to the real native package
// breaks that.
// Resolved dynamically via require.resolve (not a hardcoded
// `node_modules/react` path) — Yarn's node-modules linker doesn't
// necessarily nest a local copy inside this package's own node_modules
// even when the version conflicts with the root's; require.resolve finds
// wherever it actually landed. A hardcoded path here previously broke
// "Unable to resolve module react/jsx-runtime" once react wasn't nested
// locally.
const forcedModuleRoots = {
  react: path.dirname(require.resolve('react/package.json', {paths: [projectRoot]})),
  'react-dom': path.dirname(require.resolve('react-dom/package.json', {paths: [projectRoot]}))
};
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [name, root] of Object.entries(forcedModuleRoots)) {
    if (moduleName === name || moduleName.startsWith(`${name}/`)) {
      const rewritten = moduleName === name ? root : path.join(root, moduleName.slice(name.length));
      return context.resolveRequest(context, rewritten, platform);
    }
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
