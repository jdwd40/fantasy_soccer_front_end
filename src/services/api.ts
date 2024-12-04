import axios, { AxiosError } from 'axios';
import type { Tournament, Round, Match } from '../types/tournament';
import { debugLogger } from '../utils/debug';

const API_BASE_URL = '/api/jcup';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor with enhanced logging
api.interceptors.request.use(
  (config) => {
    debugLogger.request(config);
    return config;
  },
  (error) => {
    debugLogger.error(error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced logging
api.interceptors.response.use(
  (response) => {
    debugLogger.response(response);
    return response;
  },
  (error: AxiosError) => {
    debugLogger.error(error);
    return Promise.reject(error);
  }
);

const handleApiError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`${context}: ${message}`);
  }
  throw error;
};

export const tournamentApi = {
  initTournament: async (): Promise<Tournament> => {
    try {
      console.group('🎮 Tournament Initialization');
      console.log('Starting tournament initialization...');
      
      // First call: Initialize tournament
      const initResponse = await api.get<Tournament>('/init');
      console.log('Tournament initialized successfully');
      
      // Second call: Start playing
      console.log('Starting tournament play...');
      const playResponse = await api.post('/play');
      console.log('Tournament play started successfully');
      
      console.groupEnd();
      return initResponse.data;
    } catch (error) {
      console.groupEnd();
      handleApiError(error, 'Failed to initialize tournament');
    }
  },

  simulateMatch: async (matchId: string): Promise<Match> => {
    try {
      console.group('⚽ Match Simulation');
      const response = await api.post<Match>(`/matches/${matchId}/simulate`);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.groupEnd();
      handleApiError(error, 'Failed to simulate match');
    }
  },

  simulateRound: async (roundId: string): Promise<Round> => {
    try {
      console.group('🏆 Round Simulation');
      const response = await api.post<Round>(`/rounds/${roundId}/simulate`);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.groupEnd();
      handleApiError(error, 'Failed to simulate round');
    }
  },
};