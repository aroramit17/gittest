import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/credit-cards', label: 'Credit Cards', icon: '💳' },
  { to: '/bills', label: 'Monthly Bills', icon: '🏠' },
  { to: '/subscriptions', label: 'Subscriptions', icon: '🔄' },
  { to: '/investments', label: 'Investments', icon: '📈' },
  { to: '/savings', label: 'Savings', icon: '🏦' },
  { to: '/loans', label: 'Loans', icon: '📋' },
  { to: '/trips', label: 'Trips', icon: '✈️' },
];

export default function Layout() {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>FinanceTracker</h1>
        </div>
        <ul className="nav-list">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.to === '/'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
