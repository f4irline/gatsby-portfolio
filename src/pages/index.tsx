import React, { useState } from 'react';
import { PortfolioProvider } from '../context/context';
import Hero from './hero/hero';

import { heroData, socialLinks as social } from '../data/hero';
import { HeroData, SocialLink } from '../models';

export default function Home(): JSX.Element {
    const [hero] = useState<HeroData>({ ...heroData });
    const [socialLinks] = useState<SocialLink[]>([...social]);

    return (
        <PortfolioProvider value={{ hero, socialLinks }}>
            <Hero></Hero>
        </PortfolioProvider>
    );
}
