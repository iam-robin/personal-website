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
import PatentStudioLogo from '../assets/projects/patent-studio.svg';

export const projects: Props[] = [
    {
        bgColor: '#3662e3',
        href: 'https://www.patent-studio.com/',
        title: 'Patent Studio',
        labels: ['Website', 'Landing page', 'Astro'],
        logo: PatentStudioLogo,
        logoWidth: '4rem',
        customOpenString: 'Open Website',
        year: '2024'
    },
    {
        bgColor: '#64b89d',
        href: '#',
        title: 'Procrastisaurus',
        labels: ['Browser Extension', 'Midjourney'],
        logo: ProcrastisaurusLogo,
        logoWidth: '7rem',
        year: '2023'
    },
    {
        bgColor: '#121f36',
        href: 'https://iamrobinspielmann.notion.site/Lumon-7fa7e2796f764e53bcdaf0fb88373ac1',
        title: 'Lumon',
        labels: ['Website', 'UI Imitation'],
        logo: LumonLogo,
        logoWidth: '8rem',
        year: '2022'
    },
    {
        bgColor: '#6e69cb',
        href: 'https://www.instagram.com/geeenerated/',
        title: 'Geeenerated',
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
        labels: ['Data viz', 'React', 'Express'],
        logo: NotionbudgetLogo,
        year: '2021'
    },
    {
        bgColor: '#e8b046',
        href: '#',
        title: 'oh my',
        labels: ['Master Thesis', 'Data viz'],
        logo: OhmyLogo,
        year: '2018'
    },
    {
        bgColor: '#364a55',
        href: '#',
        title: 'sam',
        labels: ['Web app', 'Vue.js'],
        logo: SamLogo,
        year: '2018'
    },
    {
        bgColor: '#5961eb',
        href: '#',
        title: 'meaningful animations',
        labels: ['Bachelor Thesis', 'Motion Design'],
        logo: MeaningfulAnimationLogo,
        logoWidth: '7rem',
        year: '2017'
    },
    {
        bgColor: '#8e7fd1',
        href: '#',
        title: 'media.camp',
        labels: ['Barcamp', 'Organisation', 'Branding'],
        logo: MediacampLogo,
        logoWidth: '5rem',
        year: '2015 - 2017'
    }
];
