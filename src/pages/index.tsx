import React, { useState } from 'react';
import { PortfolioProvider } from '../context/context';
import Hero from './hero/hero';

import heroData from '../data/hero';
import { HeroData } from '../models';

export default function Home(): JSX.Element {
    const [hero] = useState<HeroData>({ ...heroData });

    return (
        <PortfolioProvider value={{ hero }}>
            <Hero></Hero>
        </PortfolioProvider>
    );
}
