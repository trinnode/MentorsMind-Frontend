import type { ChartExportOptions } from '../types/charts.types';

export const CHART_COLORS = [
  '#5B3FFF', // stellar
  '#7B61FF', // stellar-light
  '#0ea5e9', // primary-500
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
];

export function formatValue(value: number, prefix = '', suffix = ''): string {
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M${suffix}`;
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(1)}K${suffix}`;
  return `${prefix}${value}${suffix}`;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function exportChart(svgElement: SVGElement | null, options: ChartExportOptions): void {
  if (!svgElement) return;
  const { format, filename = 'chart' } = options;

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgElement);

  if (format === 'svg') {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    downloadBlob(blob, `${filename}.svg`);
    return;
  }

  // PNG export via canvas
  const canvas = document.createElement('canvas');
  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    canvas.width = img.width || 800;
    canvas.height = img.height || 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${filename}.png`);
    });
  };
  img.src = url;
}

function downloadBlob(blob: Blob, filename: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
