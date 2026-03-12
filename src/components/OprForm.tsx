import React, { useState, useRef } from 'react';
import { OprData } from '../types';
import { KATEGORI_PILIHAN, SENARAI_GURU } from '../constants';
import { SignaturePad, SignaturePadRef } from './SignaturePad';
import { Upload, X, FileText } from 'lucide-react';

interface Props {
  onSubmit: (data: OprData) => void;
  isGenerating: boolean;
}

export const OprForm: React.FC<Props> = ({ onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<Partial<OprData>>({
    gambar: [],
    kategori: '',
    disediakanOleh: '',
    anjuran: '',
    jawatan: '',
  });
  
  const sigPadRef = useRef<SignaturePadRef>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => {
        const newGambar = [...(prev.gambar || [])];
        // Ensure array has enough elements
        while (newGambar.length <= index) {
          newGambar.push('');
        }
        newGambar[index] = reader.result as string;
        return { ...prev, gambar: newGambar };
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newGambar = [...(prev.gambar || [])];
      newGambar[index] = '';
      return { ...prev, gambar: newGambar };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.namaProgram || !formData.tarikhMula || !formData.tarikhAkhir || !formData.tempat || !formData.kehadiran || !formData.kekuatanProgram || !formData.kelemahanProgram || !formData.sumberKewangan || !formData.kategori || !formData.disediakanOleh || !formData.anjuran || !formData.jawatan) {
      alert('Sila isi semua ruangan yang wajib.');
      return;
    }

    const validImages = (formData.gambar || []).filter(img => img !== '');
    if (validImages.length !== 4) {
      alert('Sila muat naik tepat 4 gambar.');
      return;
    }

    const signature = sigPadRef.current?.getSignature();
    if (!signature) {
      alert('Sila masukkan tandatangan digital.');
      return;
    }

    onSubmit({
      ...formData,
      gambar: validImages,
      tandatangan: signature,
    } as OprData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">1. Nama Program</label>
          <input required type="text" name="namaProgram" value={formData.namaProgram || ''} onChange={handleChange} placeholder="CONTOH: HARI ANUGERAH CEMERLANG" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-gray-400" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">2. Kategori</label>
          <select required name="kategori" value={formData.kategori || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase">
            <option value="" disabled>PILIH KATEGORI</option>
            {KATEGORI_PILIHAN.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase">3. Tarikh Mula</label>
            <input required type="date" name="tarikhMula" value={formData.tarikhMula || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase">4. Tarikh Akhir</label>
            <input required type="date" name="tarikhAkhir" value={formData.tarikhAkhir || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">5. Tempat</label>
          <input required type="text" name="tempat" value={formData.tempat || ''} onChange={handleChange} placeholder="CONTOH: STOR SUKAN SK SG ABONG" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-gray-400" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">6. Anjuran</label>
          <input required type="text" name="anjuran" value={formData.anjuran || ''} onChange={handleChange} placeholder="CONTOH: PANITIA BAHASA INGGERIS/UNIT BIMBINGAN DAN KAUNSELING" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-gray-400" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">7. Kehadiran</label>
          <input required type="text" name="kehadiran" value={formData.kehadiran || ''} onChange={handleChange} placeholder="CONTOH: 200 MURID & 54 GURU" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-gray-400" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">8. Kekuatan Program</label>
          <textarea required name="kekuatanProgram" value={formData.kekuatanProgram || ''} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase resize-none" maxLength={300} placeholder="" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">9. Kelemahan Program</label>
          <textarea required name="kelemahanProgram" value={formData.kelemahanProgram || ''} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase resize-none" maxLength={300} placeholder="" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">10. Sumber Kewangan</label>
          <input required type="text" name="sumberKewangan" value={formData.sumberKewangan || ''} onChange={handleChange} placeholder="CONTOH: SUMBANGAN PIBG/ TIADA" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700 uppercase">11. Gambar Program (Tepat 4 Gambar)</label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((index) => {
            const img = formData.gambar?.[index];
            return (
              <div key={index} className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-600 text-center uppercase">GAMBAR {index + 1}</span>
                {img ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={img} alt={`Gambar ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Padam Gambar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium text-center px-2">Muat Naik</span>
                    <input type="file" accept="image/*" onChange={(e) => handleSingleImageUpload(e, index)} className="hidden" />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">12. Disediakan Oleh</label>
          <select required name="disediakanOleh" value={formData.disediakanOleh || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase">
            <option value="" disabled>PILIH NAMA GURU</option>
            {SENARAI_GURU.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">13. Jawatan</label>
          <input required type="text" name="jawatan" value={formData.jawatan || ''} onChange={handleChange} placeholder="CONTOH: PENYELARAS KRMJ" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-gray-400" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 uppercase">14. Tandatangan Digital</label>
          <SignaturePad ref={sigPadRef} />
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              MENJANA PDF & MENYIMPAN...
            </>
          ) : (
            <>
              <FileText />
              JANA PDF
            </>
          )}
        </button>
      </div>
    </form>
  );
};
