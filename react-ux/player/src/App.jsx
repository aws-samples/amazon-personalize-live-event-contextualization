import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import Player from './Player';

const websocket_server_url = 'ws://localhost:8000';

const App = ({}) => {
  
  const [data, setData] = useState();
    
  return (
    <div className="ui container">
        <Player player={data}/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
