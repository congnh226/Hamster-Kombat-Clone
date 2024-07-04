import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function App() {
  const newUser = {
    id: 'authUser.uid',
    coins: 0,
    energy: 100,
    level: 1,
  };

  const [user, setUser] = useState(newUser);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      function initTg() {
          setLoading(true);
          if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
              console.log('Telegram WebApp is set');
              const tgData = window.Telegram.WebApp
              console.log('tgData', tgData);
              console.log('tgData', tgData?.initDataUnsafe?.user?.id);
              setLoading(false);
              alert(tgData?.initDataUnsafe?.user?.id)
          } else {
              console.log('Telegram WebApp is undefined, retrying…');
              setTimeout(initTg, 500);
          }
      }

    return () => initTg();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access this application.</div>;
  }

  return (
    <div className="app">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Telegram Game</h1>
      </header>
      <main className="p-4">
        <Outlet context={{ user, setUser }} />
      </main>
      <nav className="fixed bottom-0 w-full bg-gray-200 p-4">
        {/* Add navigation buttons here */}
      </nav>
    </div>
  );
}

export default App;
