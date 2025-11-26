import { Outlet } from 'react-router-dom';
import Header from './Header';
import CategoryMenu from './CategoryMenu';
import SubcategoryBar from './SubcategoryBar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <CategoryMenu />
      <SubcategoryBar />
      <main style={{ flex: 1, paddingTop: '80px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
