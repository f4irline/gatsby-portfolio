export interface SocialLink {
    label: string;
    url: string;
    icon: string;
}

export interface SiteData {
    name: string;
    role: string;
    headline: string;
    introduction: string[];
    location: string;
    currentCompany: string;
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
    name: 'Tommi Lepola',
    role: 'Senior Software Developer',
    headline: 'Senior software developer building useful digital products.',
    introduction: [
        "I'm Tommi Lepola, a full-stack software developer based in Tampere, Finland. I design and build reliable web applications and AI-enabled solutions, from architecture and hands-on development to production.",
        'I also help teams work effectively through technical leadership, pragmatic engineering practices, and AI-assisted software delivery.',
    ],
    location: 'Tampere, Finland',
    currentCompany: 'Currently at Kaiku',
    title: 'Tommi Lepola | Senior Software Developer',
    description:
        'Tommi Lepola is a senior software developer building reliable web applications and AI-enabled digital products.',
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
            label: 'Email',
            url: 'mailto:lepola.tommi@gmail.com',
            icon: '/img/icons/email.svg',
        },
        {
            label: 'Résumé (PDF)',
            url: publicResumeUrl,
            icon: '/img/icons/cv.svg',
        },
    ],
};
