import React from 'react';
import { Image } from 'semantic-ui-react';
import footer from '../images/header.png';

export default function Footer() {
    return (
        <div className="ui secondary pointing menu">
                <Image src={footer} fluid />
        </div>
    );
}