import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TournamentProvider } from './context/TournamentContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TournamentView } from './components/TournamentView';
import { Navbar } from './components/layout/Navbar';
import { useTournament } from './context/TournamentContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { tournament } = useTournament();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {!tournament ? <WelcomeScreen /> : <TournamentView />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TournamentProvider>
        <AppContent />
      </TournamentProvider>
    </QueryClientProvider>
  );
}

export default App;