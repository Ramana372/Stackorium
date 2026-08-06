import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider } from '@/context/auth-context';
import { AppRouter } from '@/router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
