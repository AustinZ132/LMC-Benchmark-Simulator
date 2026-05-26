import React, { useState, useCallback } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Download, FileImage, FileText, FileSpreadsheet, Shield } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Turnstile from './Turnstile';

export default function Export() {
  const { lang } = useI18n();
  const { results } = useBenchmark();
  const isZh = lang === 'zh';
  const [isVerified, setIsVerified] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleVerify = useCallback((token) => {
    if (token) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('Turnstile error:', error);
    setIsVerified(false);
  }, []);

  const exportPNG = useCallback(async () => {
    if (!isVerified) return;
    setIsExporting(true);
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
    setIsExporting(false);
  }, [isVerified]);

  const exportCSV = useCallback(() => {
    if (!isVerified || results.length === 0) return;
    setIsExporting(true);
    
    const headers = ['Algorithm', 'InputSize', 'Instructions', 'MemoryAccess', 'Branches', 'Cycles'];
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.algorithmId,
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
    setIsExporting(false);
  }, [results, isVerified]);

  const exportPDF = useCallback(async () => {
    if (!isVerified) return;
    setIsExporting(true);
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
    setIsExporting(false);
  }, [isVerified]);

  return (
    <section id="export" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <Download size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {isZh ? '导出数据' : 'Export Data'}
        </h2>
      </div>
      <div id="export-container" className="export-container">
        {!isVerified && (
          <div className="export-verify">
            <div className="verify-header">
              <Shield size={20} />
              <span>{isZh ? '请先完成验证' : 'Please verify first'}</span>
            </div>
            <Turnstile onVerify={handleVerify} onError={handleError} action="export" />
          </div>
        )}
        <div className="export-options">
          <button 
            onClick={exportPNG} 
            className="button-secondary"
            disabled={!isVerified || isExporting}
          >
            <FileImage size={16} />
            <span>{isZh ? '导出图片' : 'Export Image'}</span>
          </button>
          <button 
            onClick={exportCSV} 
            className="button-secondary"
            disabled={!isVerified || isExporting || results.length === 0}
          >
            <FileSpreadsheet size={16} />
            <span>{isZh ? '导出数据' : 'Export Data'}</span>
          </button>
          <button 
            onClick={exportPDF} 
            className="button-primary"
            disabled={!isVerified || isExporting}
          >
            <FileText size={16} />
            <span>{isZh ? '导出报告' : 'Export Report'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
