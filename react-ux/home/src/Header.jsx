import React from 'react';
import { Image } from 'semantic-ui-react';
import header from '../images/header.png';

export default function Header() {
    return (
        <div className="ui secondary pointing menu">
                <Image src={header} fluid />
        </div>
    );
}