import React, { useCallback, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import Turnstile from './Turnstile';
import { Download, FileImage, FileSpreadsheet, FileText, ShieldCheck, X } from 'lucide-react';

async function verifyTurnstileToken(token) {
  if (!token) return false;
  const allowUnverifiedFallback = import.meta.env.DEV ||
    import.meta.env.VITE_TURNSTILE_ALLOW_UNVERIFIED === 'true';

  try {
    const response = await fetch('/api/turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'export' })
    });
    const result = await response.json();

    if (result.success) return true;
    if (result.configurationRequired && allowUnverifiedFallback) return true;
    return false;
  } catch (error) {
    return allowUnverifiedFallback;
  }
}

export default function Export() {
  const { t } = useI18n();
  const { results } = useBenchmark();
  const [isExporting, setIsExporting] = useState(false);
  const [isVerified, setIsVerified] = useState(() => {
    try {
      return window.sessionStorage.getItem('lmc-export-verified') === 'true';
    } catch (error) {
      return false;
    }
  });
  const [pendingExport, setPendingExport] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
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

  const runExport = useCallback((type) => {
    if (type === 'png') {
      performPNGExport();
    } else if (type === 'csv') {
      performCSVExport();
    } else if (type === 'pdf') {
      performPDFExport();
    }
  }, [performCSVExport, performPDFExport, performPNGExport]);

  const requestExport = useCallback((type) => {
    if (isVerified) {
      runExport(type);
      return;
    }

    setPendingExport(type);
    setVerificationError('');
  }, [isVerified, runExport]);

  const handleVerify = useCallback(async (token) => {
    if (!token) {
      setVerificationError(t('security.expired'));
      return;
    }

    setIsVerifying(true);
    setVerificationError('');
    const verified = await verifyTurnstileToken(token);
    setIsVerifying(false);

    if (!verified) {
      setVerificationError(t('security.failed'));
      return;
    }

    try {
      window.sessionStorage.setItem('lmc-export-verified', 'true');
    } catch (error) {
      // Session storage is optional; verification still works for this page view.
    }

    setIsVerified(true);
    const exportType = pendingExport;
    setPendingExport(null);
    runExport(exportType);
  }, [pendingExport, runExport, t]);

  const handleVerifyError = useCallback(() => {
    setIsVerifying(false);
    setVerificationError(t('security.failed'));
  }, [t]);

  const closeVerification = useCallback(() => {
    setPendingExport(null);
    setVerificationError('');
  }, []);

  return (
    <section id="export" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <Download size={20} />
          {t('export.title')}
        </h2>
      </div>
      <div className="export-container">
        <div className="export-options">
          <button onClick={() => requestExport('png')} className="button-secondary" disabled={isExporting}>
            <FileImage size={16} />
            <span>{t('export.image')}</span>
          </button>
          <button onClick={() => requestExport('csv')} className="button-secondary" disabled={isExporting || results.length === 0}>
            <FileSpreadsheet size={16} />
            <span>{t('export.data')}</span>
          </button>
          <button onClick={() => requestExport('pdf')} className="button-primary" disabled={isExporting}>
            <FileText size={16} />
            <span>{t('export.report')}</span>
          </button>
        </div>
        {pendingExport && !isVerified && (
          <div className="export-verify">
            <button className="verify-close" onClick={closeVerification} aria-label={t('security.close')}>
              <X size={14} />
            </button>
            <div className="verify-header">
              <ShieldCheck size={16} />
              <span>{t('security.title')}</span>
            </div>
            <p className="verify-desc">{t('security.description')}</p>
            <Turnstile onVerify={handleVerify} onError={handleVerifyError} action="export" />
            {isVerifying && <p className="verify-status">{t('security.checking')}</p>}
            {verificationError && <p className="verify-error">{verificationError}</p>}
            <p className="verify-footer">{t('security.footer')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
