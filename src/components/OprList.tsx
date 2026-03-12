import React, { useState, useEffect } from 'react';
import { OprData } from '../types';
import { GAS_WEBAPP_URL } from '../constants';
import { Download, Eye, RefreshCw, Search, AlertCircle, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export const OprList: React.FC = () => {
  const [data, setData] = useState<OprData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<OprData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          const d = String(date.getDate()).padStart(2, '0');
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const y = date.getFullYear();
          return `${d}/${m}/${y}`;
        }
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [y, m, d] = dateString.split('-');
        return `${d}/${m}/${y}`;
      }
      return dateString.split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  const handleDelete = (item: OprData) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const item = itemToDelete;
    
    console.log("DELETE CLICKED", item);

    // Extract fileId if not explicitly provided
    let fileId = item.fileId || '';
    if (!fileId && item.viewUrl) {
      const match = item.viewUrl.match(/[-\w]{25,}/);
      if (match) fileId = match[0];
    }
    if (!fileId && item.downloadUrl) {
      const match = item.downloadUrl.match(/id=([-\w]{25,})/);
      if (match) fileId = match[1];
    }
    if (!fileId && item.pdfUrl) {
      const match = item.pdfUrl.match(/id=([-\w]{25,})/);
      if (match) fileId = match[1];
    }

    console.log("DELETE PAYLOAD", { action: "deleteOpr", oprId: item.oprId, fileId });

    try {
      setIsDeleteModalOpen(false); // Close modal immediately
      setLoading(true);
      setError(null);
      setSuccessMsg(null);
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ 
          action: 'deleteOpr',
          oprId: item.oprId,
          fileId: fileId
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setSuccessMsg("Rekod berjaya dipadam.");
        fetchData();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(result.message || "Gagal memadam rekod.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setError("Ralat semasa memadam rekod.");
      setLoading(false);
    } finally {
      setItemToDelete(null);
    }
  };

  const fetchData = async () => {
    if (GAS_WEBAPP_URL === "PASTE_GAS_WEB_APP_URL_HERE") {
      setError("Sila kemaskini GAS_WEBAPP_URL di dalam fail constants.ts");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'listOpr' }),
      });
      
      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || "Gagal memuat turun data.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError("Ralat sambungan ke pelayan GAS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(item => 
    item.namaProgram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.disediakanOleh?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800 uppercase">Senarai OPR</h2>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Carian..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase text-sm"
            />
          </div>
          <button 
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
            title="Muat Semula"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 border-b border-green-100 flex items-center gap-3 text-green-700">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">{successMsg}</p>
        </div>
      )}

      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Tarikh</th>
              <th className="px-6 py-4">Nama Program</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Disediakan Oleh</th>
              <th className="px-6 py-4 text-center">Fail (Google Drive)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="uppercase font-medium text-xs tracking-wider">Memuat turun data...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <p className="uppercase font-medium text-sm">Tiada rekod dijumpai.</p>
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr key={item.oprId || idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {formatDate(item.tarikhMula || item.timestamp)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate uppercase" title={item.namaProgram}>
                    {item.namaProgram}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap uppercase">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold border border-gray-200">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap uppercase text-xs font-medium">
                    {item.disediakanOleh}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!(item.downloadUrl || item.pdfUrl || item.viewUrl) && (
                        <span className="text-xs text-gray-400 italic mr-2">Tiada Fail</span>
                      )}
                      
                      {(item.downloadUrl || item.pdfUrl) && (
                        <a 
                          href={item.downloadUrl || item.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-md text-xs font-bold transition-colors border border-blue-200 uppercase tracking-wide"
                          title="Muat Turun dari Google Drive"
                        >
                          <Download size={14} />
                          DOWNLOAD
                        </a>
                      )}
                      
                      {item.viewUrl && (
                        <a 
                          href={item.viewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md text-xs font-bold transition-colors border border-gray-200 uppercase tracking-wide"
                          title="Lihat di Google Drive"
                        >
                          <Eye size={14} />
                          VIEW
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 rounded-md text-xs font-bold transition-colors border border-red-200 uppercase tracking-wide"
                        title="Padam Rekod"
                      >
                        <Trash2 size={14} />
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pengesahan Padam</h3>
              <p className="text-gray-600 mb-6">
                Adakah anda pasti mahu memadam rekod ini?<br/>
                <span className="font-semibold text-gray-800 mt-2 block">{itemToDelete?.namaProgram}</span>
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  BATAL
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                >
                  PADAM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
