import React from 'react';
import { PortfolioProvider } from '../context/context';
import Hero from './hero/hero';

export default function Home(): JSX.Element {
    return (
        <PortfolioProvider value={{}}>
            <Hero></Hero>
        </PortfolioProvider>
    );
}
