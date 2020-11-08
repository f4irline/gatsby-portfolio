import React from 'react';
import { HeroData, SocialLink } from '../models';

interface IPortfolioContext {
    hero: HeroData | undefined;
    socialLinks: SocialLink[];
}

const PortfolioContext = React.createContext<IPortfolioContext>({
    hero: undefined,
    socialLinks: [],
});

export const PortfolioProvider = PortfolioContext.Provider;
export const PortfolioConsumer = PortfolioContext.Consumer;

export default PortfolioContext;
