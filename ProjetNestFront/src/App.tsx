import { Routes, Route, NavLink } from 'react-router-dom';
import { AllReadingPage } from './reading/all-reading/AllReadingPage';
import { AddMangaPage } from './manga/add-manga/AddMangaPage';
import { MangaListPage } from './manga/manga-list/MangaListPage';
import { AddManhwaPage } from './manhwa/add-manhwa/AddManhwaPage';
import { ManhwaListPage } from './manhwa/manhwa-list/ManhwaListPage';
import { AddManhuaPage } from './manhua/add-manhua/AddManhuaPage';
import { ManhuaListPage } from './manhua/manhua-list/ManhuaListPage';
import { AddWorkMenu } from './shared/components/AddWorkMenu';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-sm font-medium uppercase tracking-wide transition-colors',
    isActive ? 'text-red-500' : 'text-slate-300 hover:text-white',
  ].join(' ');

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="text-slate-300">Mangathèque</span>
          </NavLink>
          <nav className="flex items-center gap-6">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <li><NavLink to="/" end className={navLinkClass}>Accueil</NavLink></li>
              <li><NavLink to="/manga" className={navLinkClass}>Mangas</NavLink></li>
              <li><NavLink to="/manhwa" className={navLinkClass}>Manhwas</NavLink></li>
              <li><NavLink to="/manhua" className={navLinkClass}>Manhuas</NavLink></li>
            </ul>
            <AddWorkMenu />
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<AllReadingPage />} />
        <Route path="/manga" element={<MangaListPage />} />
        <Route path="/manga/add" element={<AddMangaPage />} />
        <Route path="/manhwa" element={<ManhwaListPage />} />
        <Route path="/manhwa/add" element={<AddManhwaPage />} />
        <Route path="/manhua" element={<ManhuaListPage />} />
        <Route path="/manhua/add" element={<AddManhuaPage />} />
      </Routes>
    </div>
  );
}
