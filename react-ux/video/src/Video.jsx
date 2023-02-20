import React from 'react';
import ReactPlayer from 'react-player';
import carouselImageOne from '../images/soccer_1.jpg';
import { Image } from 'semantic-ui-react';


const Video = React.memo( video => {

    //implement use effect to dynamically load the betting option
    //based on input. it is hardcoded for the time being!
    const videoTitle = "Countdown to Qatar 2022 - FIFA ";
    const videoSynopsis = "As we count down to the start of the global showpiece in Qatar on 20 November, FIFA+ is showcasing 100 of the greatest moments in FIFA World Cup history...";
    
    return (
        <div>
            <div className="ui segment">
                <Image src={carouselImageOne} fluid />
            </div>
            <div className="ui segment">
                <h4 className="ui header">{videoTitle}</h4>
                <p>{videoSynopsis}</p>
            </div>
        </div>
    );
});
export default Video;