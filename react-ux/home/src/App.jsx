import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import Container from './Container';

// in production implmentation parameterize this. currently it is hardcoded for the 
// purpose of demo.
const websocket_server_url = 'wss://<WEB_SOCKET_URL_HOST>/dev';

const App = ({}) => {
  
  const [data, setData] = useState();
  const clientRef = useRef(null);
  const [waitForReconnection, setWaitForReconnection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (waitForReconnection) {
      return;
    }

    if (!clientRef.current) {
        
        const ws = new WebSocket(websocket_server_url);
        clientRef.current = ws;
        window.client = ws;
        ws.onerror = (e) => console.error(e);

        ws.onopen = () => { 
            setIsOpen(true);
            console.log('websocket connection opened...');
            //this is hardcoded input for now. in real implementation this has to be replaced with interfaces
            //to get the real user id, content id, device id, etc.
            const user_input_json = { "action": "sendmessage", "consumer_id": "1", "device_id": "d1", "content_id": "c1"};
            ws.send(JSON.stringify(user_input_json));
        };

        ws.onclose = () => {

            if (clientRef.current) {
              console.log('websocket connection closed by the server...');
            } else {
              console.log('websocket connection closed by app component unmount...');
              return;
            }
    
            if (waitForReconnection) {
              return;
            };
    
            setIsOpen(false);
            console.log('connection closed');
    
            // Setting this will trigger a re-run of the effect,
            // cleaning up the current websocket, but not setting
            // up a new one right away
            setWaitForReconnection(true);
    
            // This will trigger another re-run, and because it is false,
            // the socket will be set up again
            setTimeout(() => setWaitForReconnection(null), 5000);
        };

        ws.onmessage = message => {
            setData(message.data);
        };
    
        return () => {
            console.log('Cleanup');
            // it will be created again, deference for now
            clientRef.current = null;
            ws.close();
        }
    }
  }, [waitForReconnection]);
  
    return (
      <div className="ui container">
          <Container driver={data}/>
      </div>
    );
}

ReactDOM.render(<App />, document.getElementById("app"));
