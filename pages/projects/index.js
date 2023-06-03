import clsx from "clsx";
import ProjectCard from "../../components/ProjectCard";
import Head from "next/head";
import PageHeader from "../../components/PageHeader";

const Projects = () => {
    return (
        <div>
            <Head>
                <title>projects - iamrobin</title>
                <meta
                    name="description"
                    content="Project overview of iamrobin"
                />
            </Head>
            <PageHeader headline="Side Projects">
                I have lots of ideas and projects that I would like to
                implement. Many of them get lost in my notes or as random
                thoughts on my computer. But some of them actually happen.
            </PageHeader>
            <div
                className={clsx(
                    "grid grid-cols-1 gap-6 mt-4",
                    "sm:mt-20",
                    "lg:grid-cols-2 lg:gap-10",
                    "xl:grid-cols-3"
                )}
            >
                <ProjectCard
                    title="Lumon"
                    link="projects/lumon"
                    description="'Severance' interface"
                    color="bg-[#0E1F38]"
                    logo="/img/projects/lumon/thumb.png"
                    logoHeight="h-[33%]"
                    year="2022"
                />
                <ProjectCard
                    title="Geeenerated"
                    link="https://www.instagram.com/geeenerated/"
                    externalLink={true}
                    description="generative art"
                    color="bg-[#6F69D2]"
                    logo="/img/projects/geeenerated/thumb.svg"
                    logoHeight="h-[36%]"
                    year="ongoing"
                />
                <ProjectCard
                    title="notion budget"
                    link="projects/notionbudget"
                    description="budget data visualization"
                    color="bg-[#2D2E37]"
                    logo="/img/projects/notionbudget/thumb.png"
                    logoHeight="h-[33%]"
                    year="2021"
                />
                <ProjectCard
                    title="oh my"
                    link="projects/ohmy"
                    description="internet usage tracker"
                    color="bg-[#F5BA4F]"
                    logo="/img/projects/ohmy/thumb.svg"
                    logoHeight="h-[35%]"
                    year="2018"
                />
                <ProjectCard
                    title="sam"
                    link="projects/sam"
                    color="bg-[#304B56]"
                    description="project registration tool"
                    logo="/img/projects/sam/thumb.svg"
                    year="2018"
                />
                <ProjectCard
                    title="meaningful animations"
                    link="projects/meaningfulanimations"
                    description="UI animations criteria catalog"
                    color="bg-[#5861F4]"
                    logo="/img/projects/ma/thumb.svg"
                    year="2017"
                />
                <ProjectCard
                    title="media.camp"
                    link="projects/mediacamp"
                    description="student barcamp"
                    color="bg-[#917ED7]"
                    logo="/img/projects/mediacamp/thumb.svg"
                    logoHeight="h-[33%]"
                    year="2015-2017"
                />
            </div>
        </div>
    );
};


export default Projects;
Projects.Layout = "Main";
