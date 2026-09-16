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

/**
 * Plain, self-contained HSB(HSV)/RGB/hex color-space conversions shared by the color-picking
 * component family (ColorSwatch, ColorSlider, ColorArea, ColorWheel, ColorField, ColorPicker).
 * This is standard color math, not a port of react-stately's `Color` class/`useColorPickerState`
 * — the components only need correct conversions to drive gradients and thumb positions, not
 * react-stately's exact internal color representation or channel-formatting behavior.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  /** 0-1. */
  a: number;
}

export interface HSB {
  /** 0-360. */
  h: number;
  /** 0-100. */
  s: number;
  /** 0-100. */
  b: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Converts HSB (h: 0-360, s/b: 0-100) to RGB (0-255 each). Standard HSV->RGB conversion. */
export function hsbToRgb(h: number, s: number, bright: number): RGB {
  let hue = ((h % 360) + 360) % 360;
  let sat = clamp(s, 0, 100) / 100;
  let val = clamp(bright, 0, 100) / 100;
  let c = val * sat;
  let x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  let m = val - c;
  let [r1, g1, b1] =
    hue < 60 ? [c, x, 0] :
    hue < 120 ? [x, c, 0] :
    hue < 180 ? [0, c, x] :
    hue < 240 ? [0, x, c] :
    hue < 300 ? [x, 0, c] :
    [c, 0, x];
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255)
  };
}

/** Converts RGB (0-255 each) to HSB (h: 0-360, s/b: 0-100). Standard RGB->HSV conversion. */
export function rgbToHsb(r: number, g: number, b: number): HSB {
  let rn = clamp(r, 0, 255) / 255;
  let gn = clamp(g, 0, 255) / 255;
  let bn = clamp(b, 0, 255) / 255;
  let max = Math.max(rn, gn, bn);
  let min = Math.min(rn, gn, bn);
  let delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = 60 * (((gn - bn) / delta) % 6);
    } else if (max === gn) {
      h = 60 * ((bn - rn) / delta + 2);
    } else {
      h = 60 * ((rn - gn) / delta + 4);
    }
  }
  if (h < 0) {
    h += 360;
  }
  let s = max === 0 ? 0 : delta / max;
  return {h, s: s * 100, b: max * 100};
}

function toHexByte(n: number): string {
  return clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
}

/** Formats RGB as `#RRGGBB`. */
export function rgbToHex(color: RGB): string {
  return `#${toHexByte(color.r)}${toHexByte(color.g)}${toHexByte(color.b)}`.toUpperCase();
}

/** Formats RGBA as `#RRGGBB` (alpha === 1) or `#RRGGBBAA` (alpha < 1). */
export function rgbaToHex(color: RGBA): string {
  let base = rgbToHex(color);
  if (color.a >= 1) {
    return base;
  }
  return `${base}${toHexByte(color.a * 255)}`;
}

/**
 * Parses a `#RGB` / `#RRGGBB` / `#RRGGBBAA` hex string or an `rgb()`/`rgba()` string into RGBA
 * (alpha 0-1). Returns `null` for anything it can't parse — callers use that to drive
 * `isInvalid` states (ColorField) instead of throwing.
 */
export function parseColor(input: string | null | undefined): RGBA | null {
  if (input == null) {
    return null;
  }
  let str = input.trim();

  let hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(str);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map(c => c + c).join('');
    }
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    let a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return {r, g, b, a};
  }

  let rgbMatch = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(str);
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : 1
    };
  }

  return null;
}

/** Formats RGBA as a CSS-style `rgba(r, g, b, a)` string, for use directly in RN `style` color props. */
export function toRgbaString(color: RGBA): string {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${color.a})`;
}

/** The pure, fully-saturated/bright hue color at a given angle, as `#RRGGBB` — the building block
 * for hue gradient stops (ColorSlider's hue channel, ColorWheel's wedges). */
export function hueToHex(h: number): string {
  return rgbToHex(hsbToRgb(h, 100, 100));
}

/**
 * Approximates Spectrum's `gray-1000/NN` opacity-modified color tokens (e.g. the `gray-1000/42`
 * ColorSwatch border, `gray-1000/10` ColorArea/ColorSlider/ColorWheel outline) used throughout the
 * S2 color-picking components. RN has no CSS `color-mix()`/alpha-suffixed token support, and
 * `gray-1000` itself is pure black in light mode / pure white in dark mode (see `tokens.ts`), so
 * this just re-expresses "gray-1000 at N% opacity" directly as an `rgba()` string.
 */
export function grayAlpha(percent: number, mode: 'light' | 'dark'): string {
  let base = mode === 'dark' ? '255, 255, 255' : '0, 0, 0';
  return `rgba(${base}, ${clamp(percent, 0, 100) / 100})`;
}
