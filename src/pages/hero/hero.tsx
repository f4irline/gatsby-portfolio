import styles from './hero.module.scss';
import React, { useContext } from 'react';
import Fade from 'react-reveal/Fade';

import githubIcon from '../../../static/img/icons/github.svg';
import emailIcon from '../../../static/img/icons/email.svg';
import linkedInIcon from '../../../static/img/icons/linkedin.svg';
import tryHackMeIcon from '../../../static/img/icons/tryhackme.svg';
import PortfolioContext from '../../context/context';

interface SocialLinks {
    type: string;
    imgPath: string;
    url: string;
    alt: string;
}

export default function Hero(): JSX.Element {
    const { hero } = useContext(PortfolioContext);

    const socialLinks: SocialLinks[] = [
        {
            type: 'github',
            imgPath: githubIcon,
            url: 'https://linkedin.com/in/tommilepola',
            alt: 'GitHub',
        },
        {
            type: 'linkedin',
            imgPath: linkedInIcon,
            url: 'https://linkedin.com/in/tommilepola',
            alt: 'LinkedIn',
        },
        {
            type: 'email',
            imgPath: emailIcon,
            url: 'mailto:lepola.tommi@gmail.com',
            alt: 'Email',
        },
        {
            type: 'tryhackme',
            imgPath: tryHackMeIcon,
            url: 'https://tryhackme.com/p/F4irline',
            alt: 'TryHackMe',
        },
    ];
    return (
        <div className={styles.heroContainer}>
            <div className={styles.heroHeader}>
                <h1 className="title-huge uppercase">
                    <Fade left cascade>
                        Hello
                    </Fade>
                </h1>
                <Fade>
                    <span className={styles.intro}>
                        My name is {hero?.name}. I&apos;m a
                        <span className={styles.role}>{hero?.roles[0]}.</span>
                    </span>
                </Fade>
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
    );
}
