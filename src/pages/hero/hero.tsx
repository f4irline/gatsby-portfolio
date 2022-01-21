import * as styles from './hero.module.scss';
import React, { useContext } from 'react';
import Fade from 'react-reveal/Fade';

import PortfolioContext from '../../context/context';
import { getCvBlob, getCvUrl } from '../../utils/api';
import { downloadFile } from '../../utils/file';

export default function Hero(): JSX.Element | null {
    const { hero, socialLinks } = useContext(PortfolioContext);
    const downloadCv = async () => {
        const url = await getCvUrl();
        const blob = await getCvBlob(url);
        downloadFile(blob, 'cv_tommi-lepola_2022.pdf');
    };

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
                <button onClick={downloadCv}>Click!</button>
            </div>
        </Fade>
    );
}
