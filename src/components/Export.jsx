import React, { useCallback, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import Turnstile from './Turnstile';
import { Download, FileImage, FileSpreadsheet, FileText, ShieldCheck } from 'lucide-react';

export default function Export() {
  const { t } = useI18n();
  const { results } = useBenchmark();
  const [isExporting, setIsExporting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const getExportTarget = () => document.getElementById('benchmark-report');

  const performPNGExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const element = getExportTarget();
      if (!element) return;
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = 'lmc-benchmark-report.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsExporting(false);
    }
  }, []);

  const performCSVExport = useCallback(() => {
    if (results.length === 0) return;
    setIsExporting(true);

    const headers = [
      'Algorithm',
      'InputSize',
      'Input',
      'Output',
      'Instructions',
      'MemoryAccess',
      'Branches',
      'Cycles'
    ];
    const csvContent = [
      headers.join(','),
      ...results.map((result) => [
        result.algorithmId,
        result.inputSize,
        `"${result.input.join(' ')}"`,
        `"${result.output.join(' ')}"`,
        result.instructionCount,
        result.memoryAccess,
        result.branchCount,
        result.cycles
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.download = 'lmc-benchmark-data.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    setIsExporting(false);
  }, [results]);

  const performPDFExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const element = getExportTarget();
      if (!element) return;
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;
      let remainingHeight = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      remainingHeight -= 297;

      while (remainingHeight > 0) {
        position = remainingHeight - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        remainingHeight -= 297;
      }

      pdf.save('lmc-benchmark-report.pdf');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleVerify = useCallback((token) => {
    if (!token) {
      setVerificationError(t('security.expired'));
      return;
    }

    setVerificationError('');
    setIsVerified(true);
  }, [t]);

  const handleVerifyError = useCallback(() => {
    setVerificationError(t('security.failed'));
  }, [t]);

  return (
    <section id="export" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <Download size={20} />
          {t('export.title')}
        </h2>
      </div>
      <div className="export-container">
        {!isVerified ? (
          <div className="export-verify">
            <div className="verify-header">
              <ShieldCheck size={16} />
              <span>{t('security.title')}</span>
            </div>
            <p className="verify-desc">{t('security.description')}</p>
            <Turnstile onVerify={handleVerify} onError={handleVerifyError} action="export" />
            {verificationError && <p className="verify-error">{verificationError}</p>}
            <p className="verify-footer">{t('security.footer')}</p>
          </div>
        ) : (
          <div className="export-options">
            <button onClick={performPNGExport} className="button-secondary" disabled={isExporting}>
              <FileImage size={16} />
              <span>{t('export.image')}</span>
            </button>
            <button onClick={performCSVExport} className="button-secondary" disabled={isExporting || results.length === 0}>
              <FileSpreadsheet size={16} />
              <span>{t('export.data')}</span>
            </button>
            <button onClick={performPDFExport} className="button-primary" disabled={isExporting}>
              <FileText size={16} />
              <span>{t('export.report')}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
