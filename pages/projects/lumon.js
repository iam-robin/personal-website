import ProjectImageHeader from "../../components/ProjectImageHeader";
import ProjectInfo from "../../components/ProjectInfo";
import ProjectSection from "../../components/ProjectSection";
import ProjectImage from "../../components/ProjectImage";
import Image from 'next/image';
import clsx from "clsx";

const Lumon = () => {
    return (
        <div>
          <ProjectImageHeader
            color="bg-[#0E1F38]"
            image="/img/projects/lumon/header.png"
            imageWidth="w-[60%]"
          />
          <ProjectInfo
            headline="Lumon"
            description="xxx"
            year="2022"
          />
        </div>
    );
}

Lumon.layout = "LayoutDefault";

export default Lumon;
