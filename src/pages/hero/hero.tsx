import styles from './hero.module.scss';
import React, { useContext } from 'react';
import Fade from 'react-reveal/Fade';

import PortfolioContext from '../../context/context';

export default function Hero(): JSX.Element | null {
    const { hero, socialLinks } = useContext(PortfolioContext);

    return !hero ? null : (
        <Fade duration={2000}>
            <div className={styles.heroContainer}>
                <div className={styles.heroHeader}>
                    <h1 className="title-huge uppercase">
                        <Fade left cascade>
                            Hello
                        </Fade>
                    </h1>
                    <span className={styles.intro}>
                        My name is {hero?.name}. I&apos;m a&nbsp;
                        <span className={styles.role}>{hero?.roles[0]}.</span>
                    </span>
                </div>
                <hr />
                <div className={styles.social}>
                    {socialLinks.map(link => (
                        <a href={link.url} key={link.type}>
                            <img src={link.imgPath} alt={link.alt}></img>
                        </a>
                    ))}
                </div>
            </div>
        </Fade>
    );
}
