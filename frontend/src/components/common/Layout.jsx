import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="shell-body">
        <Sidebar />
        <main className="main-content">
          <div className="content-inner animate-fade">{children}</div>
        </main>
      </div>

      <style>{`
        .app-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-dark);
        }
        .shell-body {
          display: flex;
          flex: 1;
        }
        .main-content {
          flex: 1;
          padding: 2rem;
          background: var(--bg-dark);
          overflow-y: auto;
          max-width: 1400px;
        }
        .content-inner {
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .shell-body {
            flex-direction: column;
          }
          .main-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
