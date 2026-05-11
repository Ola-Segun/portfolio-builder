import { useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { bundleExport, downloadBlob } from '../export/bundleZip';

export function ExportButton() {
  const [exporting, setExporting] = useState(false);
  const store = usePortfolioStore();

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await bundleExport(store);
      const filename = `${store.meta.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.zip`;
      downloadBlob(blob, filename);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Check console for details.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded font-medium text-sm hover:bg-white/90 disabled:opacity-50"
    >
      {exporting ? (
        <>
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Exporting…
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </>
      )}
    </button>
  );
}
