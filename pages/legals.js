const Imprint = () => {
    return (
        <div className="text-text-lvl-1">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2">
                    <h2 className="font-bold text-xl">Editor</h2>
                    <ul>
                        <li>Robin Spielmann</li>
                        <li>hey@iamrob.in</li>
                        <li>www.iamrob.in</li>
                    </ul>
                </div>

                <div className="w-full md:w-1/2 mt-12 md:mt-[0] mb-2">
                    <h2 className="font-bold text-xl">Contact</h2>
                    <ul>
                        <li>Robin Spielmann</li>
                        <li>Pelkovenstr. 70</li>
                        <li>80992 München</li>
                    </ul>
                </div>
            </div>

            <h2 className="font-bold text-xl mt-12 mb-2">Liability for content</h2>
            <p>As a service provider, we are responsible for our own content on these pages in accordance with general legislation pursuant to Section 7 (1) of the German Telemedia Act (TMG). According to §§ 8 to 10 TMG, however, we are not obligated as a service provider to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under the general laws remain unaffected. However, liability in this regard is only possible from the point in time at which a concrete infringement of the law becomes known. If we become aware of any such infringements, we will remove this content immediately.</p>

            <h2 className="font-bold text-xl mt-12 mb-2">Liability for links</h2>
            <p>Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking. However, a permanent control of the contents of the linked pages is not reasonable without concrete evidence of a violation of the law. If we become aware of any infringements, we will remove such links immediately.</p>

            <h2 className="font-bold text-xl mt-12 mb-2">Copyright</h2>
            <p>The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, editing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. If we become aware of any infringements, we will remove such content immediately.</p>

            <h2 className="font-bold text-xl mt-12 mb-2">Privacy</h2>
            <p>The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy. The use of our website is generally possible without providing personal data. Insofar as personal data (for example name, address or e-mail addresses) is collected on our pages, this is always done, as far as possible, on a voluntary basis. This data will not be passed on to third parties without your express consent. We point out that data transmission over the Internet (eg communication by e-mail) security gaps. A complete protection of data against access by third parties is not possible.</p>
        </div>
    )
}

Imprint.layout = "LayoutDefault";

export default Imprint;
