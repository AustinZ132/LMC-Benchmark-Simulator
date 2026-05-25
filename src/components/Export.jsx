import React, { useCallback } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Download, FileImage, FileText, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Export() {
  const { t } = useI18n();
  const { results } = useBenchmark();

  const exportPNG = useCallback(async () => {
    try {
      const element = document.getElementById('export-container');
      if (!element) return;
      const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = 'lmc-benchmark.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export PNG failed:', error);
    }
  }, []);

  const exportCSV = useCallback(() => {
    if (results.length === 0) return;

    const headers = ['InputSize', 'Instructions', 'MemoryAccess', 'Branches', 'Cycles'];
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.inputSize,
        r.instructionCount,
        r.memoryAccess,
        r.branchCount,
        r.cycles
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.download = 'lmc-benchmark-data.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [results]);

  const exportPDF = useCallback(async () => {
    try {
      const element = document.getElementById('export-container');
      if (!element) return;
      const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('lmc-benchmark-report.pdf');
    } catch (error) {
      console.error('Export PDF failed:', error);
    }
  }, []);

  return (
    <section id="export" className="section">
      <div className="section-header">
        <h2 className="section-title">{t('export.title')}</h2>
      </div>
      <div id="export-container" className="export-container">
        <div className="export-options">
          <button onClick={exportPNG} className="button-secondary">
            <FileImage size={16} />
            <span>{t('export.image')}</span>
          </button>
          <button onClick={exportCSV} className="button-secondary">
            <FileSpreadsheet size={16} />
            <span>{t('export.data')}</span>
          </button>
          <button onClick={exportPDF} className="button-primary">
            <FileText size={16} />
            <span>{t('export.report')}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
