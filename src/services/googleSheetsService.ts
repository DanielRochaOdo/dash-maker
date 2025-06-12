import { gapi } from 'gapi-script';
import { MonthData, Record, SheetData } from '../types';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

class GoogleSheetsService {
  private isInitialized = false;

  async initializeGapi(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: [DISCOVERY_DOC],
            scope: SCOPES
          });
          this.isInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async signIn(): Promise<any> {
    await this.initializeGapi();
    const authInstance = gapi.auth2.getAuthInstance();
    return await authInstance.signIn();
  }

  async signOut(): Promise<void> {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  }

  getCurrentUser(): any {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance || !authInstance.isSignedIn.get()) {
      console.warn("Usuário não autenticado ou authInstance ausente");
      return null;
    }
    return authInstance.currentUser.get();
  }


  isSignedIn(): boolean {
    if (!this.isInitialized) return false;
    const authInstance = gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  }

  async getSpreadsheetData(spreadsheetId: string): Promise<SheetData> {
    try {
      // Get all sheet names
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId
      });

      const sheets = response.result.sheets || [];
      const sheetData: SheetData = {};

      for (const sheet of sheets) {
        const sheetName = sheet.properties?.title;
        if (!sheetName) continue;

        // Get data for this sheet
        const dataResponse = await gapi.client.sheets.spreadsheets.values.batchGet({
          spreadsheetId: spreadsheetId,
          ranges: [
            `${sheetName}!A2:D`,  // Records data
            `${sheetName}!F2:F5`  // Summary data
          ]
        });

        const valueRanges = dataResponse.result.valueRanges || [];
        const recordsData = valueRanges[0]?.values || [];
        const summaryData = valueRanges[1]?.values || [];

        // Parse records
        const records: Record[] = recordsData.map((row: any[]) => ({
          obs: row[0] || '',
          ticket: row[1] || '',
          titulo: row[2] || '',
          horas: parseFloat(row[3]) || 0
        })).filter(record => record.obs || record.ticket || record.titulo || record.horas);

        // Parse summary data
        const horasOferecidas = parseFloat(summaryData[0]?.[0]) || 0;
        const saldoMesAnterior = parseFloat(summaryData[1]?.[0]) || 0;
        const horasUtilizadas = parseFloat(summaryData[2]?.[0]) || 0;
        const restante = parseFloat(summaryData[3]?.[0]) || 0;

        // Calculate total hours
        const totalHorasLancadas = records.reduce((sum, record) => sum + record.horas, 0);

        sheetData[sheetName] = {
          month: sheetName,
          records,
          horasOferecidas,
          saldoMesAnterior,
          horasUtilizadas,
          restante,
          totalHorasLancadas
        };
      }

      return sheetData;
    } catch (error) {
      console.error('Error fetching spreadsheet data:', error);
      throw new Error('Erro ao carregar dados da planilha');
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();