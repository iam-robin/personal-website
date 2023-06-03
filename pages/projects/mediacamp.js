import ProjectImageHeader from "../../components/ProjectImageHeader";
import ProjectInfo from "../../components/ProjectInfo";
import ProjectSection from "../../components/ProjectSection";
import ProjectImage from "../../components/ProjectImage";
import Image from 'next/image';
import clsx from "clsx";

const Mediacamp = () => {
    return (
        <div>
          <ProjectImageHeader
            color="bg-[#917ED7]"
            image="/img/projects/mediacamp/website.png"
            imageWidth="w-[50%]"
          />
          <ProjectInfo
            headline="media.camp"
            year="2015-2017"
            roles={["Organisation", "Frontend", "Branding"]}
          >Between 2015 and 2017, together with three other students, I took over the initialization and management of the media.camp - a barcamp by students for students at Furtwangen University. Our tasks included the acquisition of supporters and speakers, the marketing, the public appearance and the implementation of the barcamp.</ProjectInfo>
          <ProjectSection
            headline="Barcamp"
            description="The media.camp is a barcamp in the premises of the faculty «Digital Media» at Furtwangen University. In the course of the media.camp, media students and external speakers from the private enterprise meet once a semester and exchange knowledge about digital media in the form of lectures and workshops. Supporters such as t3n and ZEIT Campus also provide suitable reading material in the form of free magazines."
          />
          <div className={clsx(
            'grid grid-cols-2 gap-4 mt-10',
            'sm:grid-cols-4'
          )}>
            <Image
              src="/img/projects/mediacamp/photos/01.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
            <Image
              src="/img/projects/mediacamp/photos/02.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
            <Image
              src="/img/projects/mediacamp/photos/03.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
            <Image
              src="/img/projects/mediacamp/photos/04.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
            <Image
              src="/img/projects/mediacamp/photos/05.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
            <Image
              src="/img/projects/mediacamp/photos/06.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
            <Image
              src="/img/projects/mediacamp/photos/07.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
            <Image
              src="/img/projects/mediacamp/photos/08.png"
              width={400}
              height={400}
              className="rounded-xl"
            />
          </div>
          <ProjectSection
            headline="Branding"
            description="One of my first tasks was to revise the media.camp's coperate identity. In the course of this, the logo was simplified and the sans serif font «Lato» was introduced for a new typeface. In addition, the primary colors were revised, which should provide recognition in the use of color accents."
          />
          <ProjectImage
            src="/img/projects/mediacamp/styleguide.png"
            height={1067}
          />
          <ProjectImage
            src="/img/projects/mediacamp/poster2.png"
            height={1067}
          />
          <ProjectSection
            headline="Website"
            description="In addition, I took care of a relaunch of the website. The main task of the new website was to make the information of the barcamp easily accessible and to present it clearly. In addition, the design of the website was to be adapted to the revised corporate identity and represent the modern and lightweight feel of the media.camp."
          />
          <ProjectImage
            src="/img/projects/mediacamp/konzept.png"
            height={1067}
          />
          <ProjectImage
            src="/img/projects/mediacamp/desktop.png"
            height={2897}
          />
          <ProjectImage
            src="/img/projects/mediacamp/mockup.png"
            height={1067}
          />
          <ProjectSection
            headline="Installation"
            description="One to two weeks before the start of the Barcamp, a large timer was projected onto one of the interior walls in the main building of the «Digital Media» faculty at Furtwangen University. Besides social media campaigns, the installation was the biggest component to make students aware of the event."
          />
          <ProjectImage
            src="/img/projects/mediacamp/konzept.png"
            height={945}
          />
        </div>
    );
}


export default Mediacamp;
Mediacamp.Layout = "Stacked";
