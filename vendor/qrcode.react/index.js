import React from 'react';
export function QRCodeSVG({ value, size = 180, bgColor = '#ffffff', fgColor = '#111827', className, style }) {
  const cells = 21;
  const cell = size / cells;
  const chars = Array.from(value).map((symbol) => symbol.charCodeAt(0));
  const isDark = (row, col) => {
    const char = chars[(row * cells + col) % chars.length] ?? 0;
    return (char + row * 7 + col * 11) % 2 === 0;
  };
  const rects = [];
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      if (!isDark(row, col)) continue;
      rects.push(React.createElement('rect', { key: `${row}-${col}`, x: col * cell, y: row * cell, width: cell, height: cell, fill: fgColor }));
    }
  }
  return React.createElement('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size, className, style, role: 'img', 'aria-label': `QR ${value}` }, [
    React.createElement('rect', { key: 'bg', width: size, height: size, rx: 16, fill: bgColor }),
    ...rects,
  ]);
}
