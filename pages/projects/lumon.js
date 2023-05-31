import ProjectImageHeader from "../../components/ProjectImageHeader";
import ProjectInfo from "../../components/ProjectInfo";
import ProjectSection from "../../components/ProjectSection";
import ProjectImage from "../../components/ProjectImage";
import Image from "next/image";
import clsx from "clsx";

const Lumon = () => {
    return (
        <div>
            <ProjectImageHeader
                color="bg-[#0E1F38]"
                image="/img/projects/lumon/header.png"
                imageWidth="w-[60%]"
            />
            <ProjectInfo headline="Lumon" year="2022">
                Engaging series, movies, or video games always get my creative
                juices flowing and make me want to create something inspired by
                them. That&apos;s exactly what happened when I watched the first
                season of the TV series &quot;Severance&quot; on Apple TV+. I
                was totally blown away by their software interface and just had
                to recreate it myself.
            </ProjectInfo>
            <ProjectSection
                headline="TV show"
                description="Severance is a US science fiction thriller television series. It was first released on Apple TV+ on February 18, 2022. The protagonists work in a company called Lumon, where all employees have undergone a procedure that separates their memory between work and private memories."
            />
            <div
                className={clsx(
                    "grid grid-cols-1 gap-4 mt-10",
                    "sm:grid-cols-2"
                )}
            >
                <Image
                    src="/img/projects/lumon/show/02.png"
                    width={662}
                    height={372}
                    className="rounded-lg"
                    alt="Severance TV show screenshot that shows the main characters on their desks"
                />
                <Image
                    src="/img/projects/lumon/show/01.png"
                    width={662}
                    height={372}
                    className="rounded-lg"
                    alt="Severance TV show screenshot that shows the main characters with a camera"
                />
                <Image
                    src="/img/projects/lumon/show/03.png"
                    width={662}
                    height={372}
                    className="rounded-lg"
                    alt="Severance TV show screenshot that shows the main character sitting on his desk in front of a old computer"
                />
                <Image
                    src="/img/projects/lumon/show/04.png"
                    width={662}
                    height={372}
                    className="rounded-lg"
                    alt="Severance TV show screenshot that shows the main characters staring at a screen"
                />
            </div>
            <p className="flex justify-end gap-1 mt-2 text-sm text-text-lvl-3">
                All images by{" "}
                <a
                    className="underline"
                    href="https://www.moviepilot.de/serie/severance/bilder"
                >
                    Moviepilot
                </a>
            </p>
            <ProjectSection
                headline="Rebuilt Interface"
                description="At work, Lumon employees operate specific software all day long. Neither they nor the viewers of the show know what exactly the software does. But that doesn't matter, it's just incredibly aesthetically pleasing and I just had to recreate it."
            />
            <ProjectImage
                src="/img/projects/lumon/interface.png"
                height={1200}
            />
            <ProjectSection
                headline="Feedback"
                description="I'm so proud of this fact, that I simply have to share it here on my personal website: Britt Lower, the actress who plays one of the main character in the series, actually commented on my tweet about the project. It's beyond incredible!"
            />
            <ProjectImage src="/img/projects/lumon/tweet.png" height={1200} />
        </div>
    );
};

Lumon.layout = "LayoutDefault";

export default Lumon;
