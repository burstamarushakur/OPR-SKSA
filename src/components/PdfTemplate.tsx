import React, { forwardRef } from 'react';
import { OprData } from '../types';

interface Props {
  data: OprData | null;
}

export const PdfTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  if (!data) return null;

  return (
    <div
      ref={ref}
      style={{
        width: '210mm',
        height: '297mm',
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        backgroundColor: 'white',
        backgroundImage: 'url(https://i.postimg.cc/QCns7Pyq/White_Blue_Modern_Geometric_Annual_Report.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '0.5pt solid black',
        boxSizing: 'border-box',
        padding: '12mm 15mm',
        fontFamily: 'Arial, sans-serif',
        color: 'black',
        zIndex: -1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '4mm', width: '100%' }}>
        <img 
          src="https://i.postimg.cc/3RF9M05N/Logo_SKSA.png" 
          alt="Logo SKSA" 
          style={{ height: '20mm', width: 'auto', objectFit: 'contain', marginBottom: '2mm', display: 'block' }} 
          crossOrigin="anonymous"
        />
        <h1 style={{ fontSize: '14pt', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', textAlign: 'center' }}>
          SEKOLAH KEBANGSAAN SUNGAI ABONG
        </h1>
        <h2 style={{ fontSize: '12pt', fontWeight: 'bold', margin: '1mm 0 0 0', textTransform: 'uppercase', textAlign: 'center' }}>
          ONE PAGE REPORT (OPR)
        </h2>
      </div>

      {/* Content */}
      <div style={{ fontSize: '10pt', lineHeight: '1.4', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Table-like layout for items 1-7 */}
        <div style={{ display: 'grid', gridTemplateColumns: '45mm 1fr', gap: '1.5mm', marginBottom: '3mm' }}>
          <div style={{ fontWeight: 'bold' }}>1. NAMA PROGRAM:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.namaProgram}</div>
          
          <div style={{ fontWeight: 'bold' }}>2. KATEGORI:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.kategori}</div>
          
          <div style={{ fontWeight: 'bold' }}>3. TARIKH MULA:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.tarikhMula ? data.tarikhMula.split('-').reverse().join('/') : ''}</div>
          
          <div style={{ fontWeight: 'bold' }}>4. TARIKH AKHIR:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.tarikhAkhir ? data.tarikhAkhir.split('-').reverse().join('/') : ''}</div>
          
          <div style={{ fontWeight: 'bold' }}>5. TEMPAT:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.tempat}</div>
          
          <div style={{ fontWeight: 'bold' }}>6. ANJURAN:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.anjuran}</div>
          
          <div style={{ fontWeight: 'bold' }}>7. KEHADIRAN:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.kehadiran}</div>
        </div>

        {/* Block layout for items 8-10 */}
        <div style={{ marginBottom: '3mm' }}>
          <div style={{ fontWeight: 'bold' }}>8. KEKUATAN PROGRAM:</div>
          <div style={{ textTransform: 'uppercase', whiteSpace: 'pre-wrap' }}>{data.kekuatanProgram}</div>
        </div>

        <div style={{ marginBottom: '3mm' }}>
          <div style={{ fontWeight: 'bold' }}>9. KELEMAHAN PROGRAM:</div>
          <div style={{ textTransform: 'uppercase', whiteSpace: 'pre-wrap' }}>{data.kelemahanProgram}</div>
        </div>

        <div style={{ display: 'flex', gap: '2mm', marginBottom: '3mm' }}>
          <div style={{ fontWeight: 'bold' }}>10. SUMBER KEWANGAN:</div>
          <div style={{ textTransform: 'uppercase' }}>{data.sumberKewangan}</div>
        </div>

        {/* Images */}
        <div style={{ marginBottom: '3mm', flexGrow: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2mm' }}>11. GAMBAR PROGRAM:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm' }}>
            {data.gambar.map((img, index) => (
              <div key={index} style={{ height: '48mm', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
                <img src={img} alt={`Gambar ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', fontSize: '10pt', paddingTop: '2mm' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '1mm' }}>DISEDIAKAN OLEH:</div>
        <div style={{ height: '18mm', marginBottom: '1mm' }}>
          {data.tandatangan && (
            <img src={data.tandatangan} alt="Tandatangan" style={{ height: '100%', objectFit: 'contain' }} />
          )}
        </div>
        <div style={{ textTransform: 'uppercase' }}>{data.disediakanOleh}</div>
        <div style={{ textTransform: 'uppercase' }}>{data.jawatan}</div>
      </div>
    </div>
  );
});
