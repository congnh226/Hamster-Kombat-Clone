import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { updateOrAddUserApi } from './services/dataServices/userData.service';
import config from "./config";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();

    const initWs = (listenKey) => {
        let heartBeatId;

        const socket = new WebSocket(config.WS_API);
        socket.onopen = () => {
            console.log('ws open ok', new Date());

            const subscribeMessage = {
                event: "auth",
                token: listenKey
            };

            socket.send(JSON.stringify(subscribeMessage));

            heartBeatId = setInterval(() => {
                // console.log('ping interval 10s')
                socket.send("{\"event\":\"ping\"}");
            }, 60000);
        }

        socket.onclose = async (e) => {
            console.log('ws closed at', new Date(), 'attempt to reconnect after 2s', e);

            clearInterval(heartBeatId);
            // reconnect
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(3000);
            initWs(listenKey);
        }
        socket.onerror = (e) => console.error('ws error', new Date(), e);

        socket.onmessage = ({data}) => {
            // console.log('incoming ws message');
            data = JSON.parse(data);
            // console.log('data', data);

            if (data.id !== null && !data.result) {
                // todo
            }
        };

        setWs(socket);
    }

  useEffect( () => {
      const fetchAccessToken = async () => {
          try {
              setLoading(true);
              if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
                  console.log('Telegram WebApp is set');
                  const tgData = window.Telegram.WebApp;
                  console.log('tgData', tgData);
                  console.log('tgData', tgData?.initDataUnsafe?.user?.id);

                  // call api get token
                  const requestBody = {
                      "userId": tgData?.initDataUnsafe?.user?.id,
                      "username": tgData?.initDataUnsafe?.user?.username,
                      "firstName": tgData?.initDataUnsafe?.user?.first_name,
                      "lastName": tgData?.initDataUnsafe?.user?.last_name
                  }

                  // for testing
                  if (tgData?.initDataUnsafe?.user?.id == null) {
                      requestBody.userId = 3;
                      requestBody.username = "testing";
                      requestBody.firstName = "tester";
                  }

                  const userResponse = await updateOrAddUserApi(requestBody);
                  console.log('userResponse', userResponse);
                  setUser(userResponse.data);

                  // init websocket
                  initWs(userResponse.data.accessToken);

              } else {
                  console.log('Telegram WebApp is undefined, retrying…');
              }
              setLoading(false);

          } catch (error) {
              console.error('Error fetching access token:', error);
          }
      };

      fetchAccessToken();

    return () => {
        if (ws) {
            ws.close();
        }
    };
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
        <Outlet context={{ user, setUser,  ws, setWs} } />
      </main>
      <nav className="fixed bottom-0 w-full bg-gray-200 p-4">
        {/* Add navigation buttons here */}
      </nav>
    </div>
  );
}

export default App;
