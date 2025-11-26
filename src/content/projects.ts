import type { Props } from '@components/ProjectItem.astro';
import LumonLogo from '../assets/projects/lumon.png';
import GeeeneratedLogo from '../assets/projects/geeenerated.svg';
import NotionbudgetLogo from '../assets/projects/notionbudget.png';
import OhmyLogo from '../assets/projects/ohmy.svg';
import SamLogo from '../assets/projects/sam.svg';
import CvLogo from '../assets/projects/cv.png';
import ProcrastisaurusLogo from '../assets/projects/procrastisaurus.png';
import MeaningfulAnimationLogo from '../assets/projects/meaningful-animation.svg';
import MediacampLogo from '../assets/projects/mediacamp.svg';
// import PatentStudioLogo from '../assets/projects/patent-studio.svg';

export const projects: Props[] = [
    // {
    //     bgColor: '#3662e3',
    //     href: 'https://www.patent-studio.com/',
    //     title: 'Patent Studio',
    //     description:
    //         'A landingpage for a software solution streamlining patent workflows for law firms.',
    //     labels: ['Website', 'Landing page', 'Astro'],
    //     logo: PatentStudioLogo,
    //     logoWidth: '4rem',
    //     customOpenString: 'Open Website',
    //     year: '2024'
    // },
    {
        bgColor: '#64b89d',
        title: 'Procrastisaurus',
        description: 'A browser extension to fight procrastination.',
        labels: ['Browser Extension', 'Midjourney'],
        logo: ProcrastisaurusLogo,
        logoWidth: '7rem',
        year: '2023',
        comingSoon: true
    },
    {
        bgColor: '#121f36',
        href: 'https://iamrobinspielmann.notion.site/Lumon-7fa7e2796f764e53bcdaf0fb88373ac1',
        title: 'Lumon',
        description:
            'A project inspired by the unique software interface from Apple TVs "Severance".',
        labels: ['Website', 'UI Imitation'],
        logo: LumonLogo,
        logoWidth: '8rem',
        year: '2022'
    },
    {
        bgColor: '#6e69cb',
        href: 'https://www.instagram.com/geeenerated/',
        title: 'Geeenerated',
        description: 'My ongoing generative art side project. Visual experiments with p5.js.',
        labels: ['Generative art', 'p5.js'],
        logo: GeeeneratedLogo,
        logoWidth: '3rem',
        customOpenString: 'Open instagram',
        year: '2020 - now'
    },
    {
        bgColor: '#64b89d',
        href: 'https://iam-robin.github.io/resume/',
        title: 'Personal CV',
        description: 'A bilingual personal CV website built with Tailwind CSS',
        labels: ['CV', 'Website', 'Tailwind'],
        logo: CvLogo,
        logoWidth: '5rem',
        customOpenString: 'Open CV',
        year: '2022'
    },
    {
        bgColor: '#2d2e36',
        href: 'https://iamrobinspielmann.notion.site/Notion-Budget-c15a80d50c7f476dad942dc91a0316eb?pvs=4',
        title: 'notion budget',
        description:
            'A web app leveraging the Notion API to analyze and display personal financial data from a Notion-based budget planner',
        labels: ['Data viz', 'React', 'Express'],
        logo: NotionbudgetLogo,
        year: '2021'
    },
    {
        bgColor: '#e8b046',
        href: 'https://iamrobinspielmann.notion.site/Oh-my-4418933a4eac40c0bef4ca6f21ac865e',
        title: 'oh my',
        description:
            'A browser extension visualizing your web habits and helping you manage online time.',
        labels: ['Master Thesis', 'Data viz'],
        logo: OhmyLogo,
        year: '2018'
    },
    {
        bgColor: '#364a55',
        href: 'https://iamrobinspielmann.notion.site/sam-c951baad511345f9af63e77f6db712d2',
        title: 'sam',
        description:
            'A web app for course registration, developed as part of a masters project, featuring priority-based allocation.',
        labels: ['Web app', 'Vue.js'],
        logo: SamLogo,
        year: '2018'
    },
    {
        bgColor: '#5961eb',
        href: 'https://iamrobinspielmann.notion.site/Meaningful-animations-e29647c876e44651b0065f82a25ff8b1?pvs=4',
        title: 'meaningful animations',
        description:
            'A bachelor thesis project creating and user-testing a criteria catalog for impactful microinteraction animations in mobile apps.',
        labels: ['Bachelor Thesis', 'Motion Design'],
        logo: MeaningfulAnimationLogo,
        logoWidth: '7rem',
        year: '2017'
    },
    {
        bgColor: '#8e7fd1',
        href: 'https://iamrobinspielmann.notion.site/media-camp-6192f2c280524260848b10b3e040f048?pvs=4',
        title: 'media.camp',
        description:
            'Student-run barcamp, co-managed 2015-2017, handling sponsorships, design and execution.',
        labels: ['Barcamp', 'Branding'],
        logo: MediacampLogo,
        logoWidth: '5rem',
        year: '2015 - 2017'
    }
];
