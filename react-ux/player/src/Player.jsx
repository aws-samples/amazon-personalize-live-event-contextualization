import React from 'react';
import { Card, Icon, Image, } from 'semantic-ui-react';
import playerPhoto from '../images/player.jpg';

const Player = ( {player} ) => {
    
    return (
        <div>
            <Card>
                <Image src={playerPhoto} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>John Doe</Card.Header>
                    <Card.Meta>
                        <span className='date'>Born: 24 June 1987</span>
                    </Card.Meta>
                    <Card.Description>
                        Learn more about this unsung soccer hero and his untold stories.
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='user' />
                        100K+ Facebook followers
                    </a>
                </Card.Content>
            </Card>
        </div>
    );
}
export default Player;