import ProjectImageHeader from "../../components/ProjectImageHeader";
import ProjectInfo from "../../components/ProjectInfo";
import ProjectSection from "../../components/ProjectSection";
import ProjectImage from "../../components/ProjectImage";
import Image from 'next/image';
import clsx from "clsx";

const meaningfulanimations = () => {
    return (
        <div>
          <ProjectImageHeader
            color="bg-[#5A61EB]"
            image="/img/projects/ma/header.png"
            imageWidth="w-[60%]"
          />
          <ProjectInfo
            headline="Meaningful Animation"
            year="2016-2017"
            roles={["Bachelor Thesis", "Motion", "UX Design", "Frontend"]}
          >»Meaningful Animations - Animations in microinteractions with regard to the impact on the user experience of mobile applications« - As part of my bachelor thesis, I developed a criteria catalog for Meaningful Animations, which was then evaluated in a user test using prototypes.</ProjectInfo>
          <ProjectSection
            headline="Abstract"
            description="In the real world, it is commonplace and normal that changes of state occur through a sequence of movements. If a door is opened, this does not happen abruptly, but through a movement. In the digital world, however, the exact opposite takes place. Digital applications, such as websites and mobile applications, are based on binary code, which consists exclusively of zeros and ones. In this respect, changes of state are displayed abruptly and without transition by default. However, with the help of animations, realistic motion sequences, which humans are used to, can be simulated. The goal of this bachelor thesis is to find out whether the use of animations in mobile applications has an effect on their user experience and how animations have to be used and designed so that this effect is positive. By means of a user test, a direct comparison is made between two prototypes, which differ only in their use of animations. Through the difference of the results, the impact of animations on the UX could be determined in the course of this bachelor thesis."
          />
          <ProjectSection
            headline="User test"
            description="For the user test, two prototypes were programmed with the javascript library Framer.js. Prototype A contains no animations, whereas the microinteractions in Prototype B are supported by Meaningful Animations. The prototypes represent a simple to-do list application and allow adding, deleting and rearranging list items."
          />
          <ProjectImage
            src="/img/projects/ma/konzept.png"
            height={1067}
          />
          <ProjectImage
            src="/img/projects/ma/prototypen.png"
            height={1023}
          />
          <ProjectSection
            headline="Result"
            description="The evaluation of the user test revealed that 7 of the 20 test subjects considered did not notice any conscious difference between prototype A and prototype B. Consequently, the methodology of this user test could not capture the unconscious perception of animations and their effect on the UX and thus could not be measured. However, through the results of the remaining 13 subjects, a difference between the tested prototypes could be detected. Both pragmatic and hedonic quality were rated better for Prototype B, the application with animations. That this difference occurred by chance can be ruled out, since the order of the prototypes was changed in the user test and the size of the sample is sufficient to make a scientifically relevant statement."
          />
        </div>
    );
}


export default meaningfulanimations;
meaningfulanimations.Layout = "Stacked";
