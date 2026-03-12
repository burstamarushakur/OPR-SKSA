export interface OprData {
  id?: string;
  oprId?: string;
  namaProgram: string;
  kategori: string;
  tarikhMula: string;
  tarikhAkhir: string;
  tempat: string;
  anjuran: string;
  kehadiran: string;
  kekuatanProgram: string;
  kelemahanProgram: string;
  sumberKewangan: string;
  disediakanOleh: string;
  jawatan: string;
  gambar: string[]; // base64 strings
  tandatangan: string; // base64 string
  fileName?: string;
  pdfUrl?: string; // Legacy URL
  downloadUrl?: string; // URL from Google Drive for downloading
  viewUrl?: string; // URL from Google Drive for viewing
  fileId?: string; // Google Drive file ID
  timestamp?: string;
}
