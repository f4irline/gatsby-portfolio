import { HeroData, SocialLink } from '../models';
import githubIcon from '../../static/img/icons/github.svg';
import emailIcon from '../../static/img/icons/email.svg';
import linkedInIcon from '../../static/img/icons/linkedin.svg';

const heroData: HeroData = {
    name: 'Tommi',
    roles: ['Full Stack Web Developer'],
};

const socialLinks: SocialLink[] = [
    {
        type: 'github',
        imgPath: githubIcon,
        url: 'https://github.com/f4irline',
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
];

export { heroData, socialLinks };
