import ProjectImageHeader from "../../components/ProjectImageHeader";
import ProjectInfo from "../../components/ProjectInfo";

const Sam = () => {
    return (
        <div>
          <ProjectImageHeader
            color="bg-[#3A4953]"
            image="/img/projects/sam/header.png"
            imageWidth="w-[50%]"
          />
          <ProjectInfo
            headline="sam"
            year="2018"
            roles={["UX/UI Design", "Frontend", "Research"]}
          >As part of a one-year master&apos;s project for the «Interactive Media Systems» course at Augsburg University of Applied Sciences, I conceptualized, designed and developed the web application «sam» in a team of eight master&apos;s students. The web-based application enables course and project registrations for students at Augsburg University of Applied Sciences. Lecturers create courses and projects, in which students subsequently register in the form of priority lists. Subsequently, an allocation algorithm assigns students to individual courses and projects.</ProjectInfo>
        </div>
    );
}

Sam.layout = "LayoutDefault";

export default Sam;
