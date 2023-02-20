import React from 'react';
import { Card, Icon, Image, } from 'semantic-ui-react';
import betPhoto from '../images/bet.jpg';

const Bet = ( {bet} ) => {
    
    //implement use effect to dynamically load the betting option
    //based on input. it is hardcoded for the time being!
    return (
        <div>
            <Card>
                <Image src={betPhoto} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>Bet Now To Win</Card.Header>
                    <Card.Meta>
                        <span className='date'>A valid ID is required.</span>
                    </Card.Meta>
                    <Card.Description>
                        Make a fortune while watching this excting match. But do play responsibly, and at your own risk.
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='dollar' />
                        500+ bets already placed!
                    </a>
                </Card.Content>
            </Card>
        </div>
    );
}
export default Bet;