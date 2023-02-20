import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import Bet from './Bet';


const App = ({}) => {
  
  const [data, setData] = useState();
    
  return (
    <div className="ui container">
        <Bet bet={data}/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
