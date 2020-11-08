import React from 'react';
import { HeroData } from '../models';

interface IPortfolioContext {
    hero: HeroData | undefined;
}

const PortfolioContext = React.createContext<IPortfolioContext>({
    hero: undefined,
});

export const PortfolioProvider = PortfolioContext.Provider;
export const PortfolioConsumer = PortfolioContext.Consumer;

export default PortfolioContext;
