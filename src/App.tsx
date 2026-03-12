/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { OprForm } from './components/OprForm';
import { OprList } from './components/OprList';
import { PdfTemplate } from './components/PdfTemplate';
import { OprData } from './types';
import { GAS_WEBAPP_URL } from './constants';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FileText, List, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [pdfData, setPdfData] = useState<OprData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = async (data: OprData) => {
    setIsGenerating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setPdfData(data);

    // Wait for state to update and component to render
    setTimeout(async () => {
      try {
        if (!pdfRef.current) throw new Error("PDF Template not found");

        // Generate PDF
        const canvas = await html2canvas(pdfRef.current, {
          scale: 2, // Higher quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        // 1. Auto-download
        const safeTarikh = data.tarikhMula ? data.tarikhMula.split('-').reverse().join('') : '';
        const fileName = `OPR_${data.namaProgram.replace(/[^a-z0-9]/gi, '_').toUpperCase()}_${safeTarikh}.pdf`;
        pdf.save(fileName);

        // 2. Convert to base64 for GAS
        const pdfBase64 = pdf.output('datauristring').split(',')[1];

        // 3. Send to GAS
        if (GAS_WEBAPP_URL !== "PASTE_GAS_WEB_APP_URL_HERE") {
          const payload = {
            action: 'saveOpr',
            ...data,
            fileName,
            pdfBase64,
          };

          const response = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          if (result.success) {
            setSuccessMessage("PDF BERJAYA DIMUAT TURUN DAN DISIMPAN KE GOOGLE DRIVE.");
            setTimeout(() => {
              setActiveTab('list');
              setSuccessMessage(null);
            }, 3000);
          } else {
            setErrorMessage("Ralat menyimpan ke pelayan: " + (result.message || "Ralat tidak diketahui"));
          }
        } else {
          setSuccessMessage("PDF BERJAYA DIMUAT TURUN. (Simpanan pelayan diabaikan kerana GAS_WEBAPP_URL belum ditetapkan)");
          setTimeout(() => setSuccessMessage(null), 3000);
        }

      } catch (error) {
        console.error("Error generating PDF:", error);
        setErrorMessage("Ralat semasa menjana PDF. Sila cuba lagi.");
      } finally {
        setIsGenerating(false);
        setPdfData(null);
      }
    }, 800); // 800ms delay to ensure images and fonts are loaded
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://i.postimg.cc/3RF9M05N/Logo_SKSA.png" 
              alt="Logo SKSA" 
              className="h-12 w-auto"
              crossOrigin="anonymous"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight uppercase">ONE PAGE REPORT (OPR)</h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Sekolah Kebangsaan Sungai Abong</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-gray-200/50 p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
              activeTab === 'form' 
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <FileText size={18} />
            Borang OPR
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
              activeTab === 'list' 
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <List size={18} />
            Senarai OPR
          </button>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="text-green-600 shrink-0" />
            <p className="font-medium text-sm uppercase tracking-wide">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-red-600 shrink-0" />
            <p className="font-medium text-sm uppercase tracking-wide">{errorMessage}</p>
          </div>
        )}

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'form' ? (
            <OprForm onSubmit={handleGeneratePdf} isGenerating={isGenerating} />
          ) : (
            <OprList />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-widest border-t border-gray-200 mt-auto">
        <p>@ Hak Milik SK Sungai Abong</p>
        <p className="mt-1 text-gray-400">MODERATOR: ACAP GARANG</p>
      </footer>

      {/* Hidden PDF Template */}
      <PdfTemplate ref={pdfRef} data={pdfData} />
      
    </div>
  );
}
