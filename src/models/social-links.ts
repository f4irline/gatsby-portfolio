export interface SocialLink {
    type: string;
    imgPath: string;
    alt: string;
    url?: string;
    fn?: () => void;
}
