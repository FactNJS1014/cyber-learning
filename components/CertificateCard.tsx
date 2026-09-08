'use client';

import React from 'react';
import { Shield, Award, CheckCircle2, Download, Printer, ExternalLink, QrCode } from 'lucide-react';
import { Certificate } from '@/types';

interface CertificateCardProps {
  certificate: Certificate;
  studentName: string;
}

export default function CertificateCard({ certificate, studentName }: CertificateCardProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Certificate Official Printable Container */}
      <div
        id="certificate-print-area"
        className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 h-12 w-12 border-t-2 border-l-2 border-cyan-400/60" />
        <div className="absolute top-4 right-4 h-12 w-12 border-t-2 border-r-2 border-cyan-400/60" />
        <div className="absolute bottom-4 left-4 h-12 w-12 border-b-2 border-l-2 border-cyan-400/60" />
        <div className="absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-cyan-400/60" />

        {/* Security Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Shield className="w-96 h-96 text-cyan-400" />
        </div>

        {/* Header Branding */}
        <div className="relative z-10 flex flex-col items-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Award className="h-9 w-9" />
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-cyan-400">
              CYBER SECURITY ACADEMY OF ADVANCED DEFENSE
            </h4>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-xs font-mono text-slate-400">
              OFFICIAL CREDENTIAL OF MASTERY & ETHICAL SECURITY
            </p>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="relative z-10 my-8 space-y-4">
          <p className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-widest">
            This is to officially certify that
          </p>

          <div className="inline-block border-b-2 border-cyan-500/60 pb-2 px-6 sm:px-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
              {studentName}
            </h2>
          </div>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            has successfully fulfilled all rigorous practical and theoretical requirements of the{' '}
            <strong className="text-cyan-300 font-semibold">{certificate.programName}</strong> spanning{' '}
            <span className="text-emerald-400 font-mono font-semibold">Basic, Intermediate, and Advanced</span> curriculum, passing all 20-question evaluation benchmarks and submitting an approved Final Security Capstone Project.
          </p>
        </div>

        {/* Signatures & Security Validation Meta */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 items-center text-xs">
          {/* Issue Date */}
          <div className="space-y-1 sm:text-left font-mono">
            <span className="text-slate-500 text-[10px] uppercase">Date of Issuance</span>
            <p className="font-semibold text-slate-200">{formattedDate}</p>
          </div>

          {/* Verification Badge */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              VERIFIED AUTHENTIC
            </div>
            <span className="text-[10px] text-slate-400 mt-1">ID: {certificate.certificateNo}</span>
          </div>

          {/* Verification Code */}
          <div className="space-y-1 sm:text-right font-mono">
            <span className="text-slate-500 text-[10px] uppercase">Security Hash Code</span>
            <p className="font-bold text-cyan-400">{certificate.verificationCode}</p>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <QrCode className="h-4 w-4 text-cyan-400" />
          <span>
            Public Verification URL:{' '}
            <strong className="text-cyan-300">/verify/{certificate.certificateNo}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/verify/${certificate.certificateNo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Public Verification Page
          </a>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
