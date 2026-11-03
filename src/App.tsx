import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { RoutineProvider } from './features/routines/RoutineContext';
import { LibraryPage } from './features/library/LibraryPage';
import { SessionBar } from './features/session/SessionBar';
import './App.css';

const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutineDetailPage = lazy(
  () => import('./features/routines/RoutineDetailPage')
);

function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">🏋️</span>
          <span className="brand-title">Bấm giờ tập luyện</span>
        </div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-item nav-active' : 'nav-item'
            }
          >
            Kho bài tập
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              isActive ? 'nav-item nav-active' : 'nav-item'
            }
          >
            Đã lưu
          </NavLink>
          <NavLink
            to="/routines"
            className={({ isActive }) =>
              isActive ? 'nav-item nav-active' : 'nav-item'
            }
          >
            Giáo án
          </NavLink>
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
          >
            {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          </button>
        </div>
      </div>
    </header>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <RoutineProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navigation />
            <main className="main-content">
              <Suspense fallback={<p>Đang tải trang...</p>}>
                <Routes>
                  <Route path="/" element={<LibraryPage />} />
                  <Route path="/saved" element={<SavedPage />} />
                  <Route path="/routines" element={<RoutinesPage />} />
                  <Route path="/routines/:id" element={<RoutineDetailPage />} />
                </Routes>
              </Suspense>
            </main>
            <SessionBar />
          </div>
        </BrowserRouter>
      </RoutineProvider>
    </ThemeProvider>
  );
}

export default App;
