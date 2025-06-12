import React, { useState } from 'react';
import { FileSpreadsheet, Search } from 'lucide-react';

interface SpreadsheetInputProps {
  onSpreadsheetSubmit: (spreadsheetId: string) => void;
  loading: boolean;
}

const SpreadsheetInput: React.FC<SpreadsheetInputProps> = ({ onSpreadsheetSubmit, loading }) => {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');

  const extractSpreadsheetId = (url: string): string => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spreadsheetUrl.trim()) return;
    
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl.trim());
    onSpreadsheetSubmit(spreadsheetId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <FileSpreadsheet size={24} className="text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Conectar Planilha</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="spreadsheet" className="block text-sm font-medium text-gray-700 mb-2">
            URL ou ID da Planilha Google Sheets
          </label>
          <input
            type="text"
            id="spreadsheet"
            value={spreadsheetUrl}
            onChange={(e) => setSpreadsheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/1A2B3C... ou apenas o ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Cole a URL completa da planilha ou apenas o ID
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading || !spreadsheetUrl.trim()}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Carregando...</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Carregar Dados</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SpreadsheetInput;