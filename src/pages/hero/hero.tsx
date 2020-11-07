import styles from './hero.module.scss';
import React from 'react';

interface SocialLinks {
    type: string;
    imgPath: string;
    url: string;
    alt: string;
}

export default function Hero(): JSX.Element {
    const socialLinks: SocialLinks[] = [
        {
            type: 'github',
            imgPath: 'github.png',
            url: 'https://github.com/f4irline',
            alt: 'GitHub',
        },
        {
            type: 'linkedin',
            imgPath: 'linkedIn.png',
            url: 'https://linkedin.com/in/tommilepola',
            alt: 'LinkedIn',
        },
        {
            type: 'email',
            imgPath: 'email.png',
            url: 'mailto:lepola.tommi@gmail.com',
            alt: 'Email',
        },
        {
            type: 'tryhackme',
            imgPath: 'tryhackme.png',
            url: 'https://tryhackme.com/p/F4irline',
            alt: 'TryHackMe',
        },
    ];
    return (
        <div className={styles.heroContainer}>
            <div>
                <span className="title-huge">Hello</span>
                <div>
                    <span>
                        My name is Tommi. I&apos;m a{' '}
                        <span>Full Stack Web Developer</span>
                    </span>
                </div>
            </div>
            <hr />
            <div className={styles.social}>
                {socialLinks.map(link => (
                    <div key={link.type}>
                        <a href={link.url}>
                            <img src={link.imgPath} alt={link.alt}></img>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
