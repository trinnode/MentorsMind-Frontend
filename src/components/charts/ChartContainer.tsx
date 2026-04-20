import React, { useRef } from 'react';
import { exportChart } from '../../utils/chart.utils';
import type { ChartExportOptions } from '../../types/charts.types';

interface ChartContainerProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
  exportable?: boolean;
  exportFilename?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  isLoading = false,
  error = null,
  exportable = false,
  exportFilename = 'chart',
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = (format: ChartExportOptions['format']) => {
    const svg = containerRef.current?.querySelector('svg');
    exportChart(svg ?? null, { format, filename: exportFilename });
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}
      role="region"
      aria-label={title ?? 'Chart'}
    >
      {(title || exportable) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
          </div>
          {exportable && !isLoading && !error && (
            <div className="flex gap-1">
              <button
                onClick={() => handleExport('png')}
                className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Export chart as PNG"
              >
                PNG
              </button>
              <button
                onClick={() => handleExport('svg')}
                className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Export chart as SVG"
              >
                SVG
              </button>
            </div>
          )}
        </div>
      )}

      <div ref={containerRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-48" role="status" aria-label="Loading chart">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-stellar border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Loading data...</span>
            </div>
          </div>
        ) : error ? (
          <div
            className="flex items-center justify-center h-48 text-center"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl" aria-hidden="true">⚠️</span>
              <p className="text-sm text-red-500 font-medium">Failed to load chart</p>
              <p className="text-xs text-gray-400">{error}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartContainer;
