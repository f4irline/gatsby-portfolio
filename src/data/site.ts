export interface SocialLink {
    label: string;
    url: string;
    icon: string;
}

export interface SiteData {
    name: string;
    role: string;
    title: string;
    description: string;
    url: string;
    email: string;
    resumeUrl: string;
    socialLinks: SocialLink[];
}

const publicResumeUrl =
    import.meta.env.PUBLIC_RESUME_URL ??
    'https://s3.eu-central-1.amazonaws.com/tommilepola.fi-files/resume_tommi-lepola.pdf';

export const site: SiteData = {
    name: 'Tommi',
    role: 'Full Stack Web Developer',
    title: 'Tommi Lepola | Full Stack Web Developer',
    description: 'The portfolio of Tommi Lepola, a Full Stack Web Developer.',
    url: 'https://tommilepola.fi',
    email: 'lepola.tommi@gmail.com',
    resumeUrl: publicResumeUrl,
    socialLinks: [
        {
            label: 'GitHub',
            url: 'https://github.com/f4irline',
            icon: '/img/icons/github.svg',
        },
        {
            label: 'LinkedIn',
            url: 'https://linkedin.com/in/tommilepola',
            icon: '/img/icons/linkedin.svg',
        },
        {
            label: 'Email Tommi',
            url: 'mailto:lepola.tommi@gmail.com',
            icon: '/img/icons/email.svg',
        },
        {
            label: 'Open Tommi Lepola résumé (PDF)',
            url: publicResumeUrl,
            icon: '/img/icons/cv.svg',
        },
    ],
};
