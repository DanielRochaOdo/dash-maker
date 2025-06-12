import React, { useState, useEffect } from 'react';
import { BarChart3, Settings, AlertCircle } from 'lucide-react';
import { googleSheetsService } from './services/googleSheetsService';
import { GoogleUser, SheetData } from './types';
import AuthButton from './components/AuthButton';
import SpreadsheetInput from './components/SpreadsheetInput';
import MonthSelector from './components/MonthSelector';
import Dashboard from './components/Dashboard';
import RecordsTable from './components/RecordsTable';

function App() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [sheetData, setSheetData] = useState<SheetData>({});
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await googleSheetsService.initializeGapi();
      const currentUser = googleSheetsService.getCurrentUser();
      if (currentUser && googleSheetsService.isSignedIn()) {
        const profile = currentUser.getBasicProfile();
        setUser({
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl()
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setError('Erro ao inicializar autenticação');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    setError('');
    try {
      const googleUser = await googleSheetsService.signIn();
      const profile = googleUser.getBasicProfile();
      setUser({
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl()
      });
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Erro ao fazer login');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSheetsService.signOut();
      setUser(null);
      setSheetData({});
      setSelectedMonth('');
      setError('');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSpreadsheetSubmit = async (spreadsheetId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await googleSheetsService.getSpreadsheetData(spreadsheetId);
      setSheetData(data);
      
      const months = Object.keys(data);
      if (months.length > 0) {
        setSelectedMonth(months[0]);
      }
    } catch (error: any) {
      console.error('Error loading spreadsheet:', error);
      setError(error.message || 'Erro ao carregar planilha');
    } finally {
      setLoading(false);
    }
  };

  const months = Object.keys(sheetData);
  const currentMonthData = selectedMonth ? sheetData[selectedMonth] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <BarChart3 size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Google Sheets</h1>
            </div>
            <AuthButton
              user={user}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              loading={authLoading}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {!user ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Settings size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bem-vindo ao Dashboard
              </h2>
              <p className="text-gray-600 mb-8">
                Faça login com sua conta Google para começar a visualizar os dados das suas planilhas.
              </p>
              <AuthButton
                user={user}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
                loading={authLoading}
              />
            </div>
          </div>
        ) : months.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <SpreadsheetInput
              onSpreadsheetSubmit={handleSpreadsheetSubmit}
              loading={loading}
            />
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Como usar:</h3>
              <ol className="text-blue-700 space-y-2 text-sm">
                <li>1. Certifique-se que sua planilha está compartilhada com permissão de visualização</li>
                <li>2. Cada aba da planilha deve representar um mês</li>
                <li>3. A estrutura deve conter as colunas A-D para dados e células F2-F5 para resumo</li>
                <li>4. Cole a URL ou ID da planilha acima e clique em "Carregar Dados"</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <MonthSelector
              months={months}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            
            {currentMonthData && (
              <>
                <Dashboard data={currentMonthData} />
                <RecordsTable records={currentMonthData.records} />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;