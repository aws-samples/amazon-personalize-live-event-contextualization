import React, { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import Header from './Header';
import Footer from './Footer';
import Player from 'player/Player';
import Bet from 'bet/Bet';
import Video from 'video/Video';

const Container = ( {driver} ) => {

    const [engagementBlock, setEngagementBlock] = useState("Engagement Block");

    useEffect (() => {
        if(driver) {
            
            console.log('data receive debug...' + driver);
            
            //while the web socket sends recommendation on different aspects, 
            //we will use only one for sample implementation.
            let general_comp  = "";
            general_comp  = JSON.parse(driver).GENERAL;
            
            if (general_comp) {
                const refreshPageContent = async () => {
                    // this is a dummy placeholder logic for now!!!
                    const const_numerical = general_comp.slice(-2);
                    const numeric_val = parseInt(const_numerical);
                    if (numeric_val < 15) {
                        setEngagementBlock(<Bet/>);
                    }else{
                        setEngagementBlock(<Player/>);
                    }
                }
                refreshPageContent();
            }
        }
    }, [driver]);

    return (
        <div className="ui container">
                <Header />
                <div className="ui grid"> 
                    <div className="ui row">
                        <div className="eleven wide column">
                            <div className="ui segment vertical">
                               <Video/>
                            </div>
                        </div>    
                        <div className="five wide column">
                            <div className="ui segment vertical">
                                {engagementBlock}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
        </div>
    );
}

export default Container;