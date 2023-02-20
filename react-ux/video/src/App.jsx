import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import Video from './Video';


const App = ({}) => {
  
  const [data, setData] = useState();
    
  return (
    <div className="ui container">
        <Video video={data}/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
