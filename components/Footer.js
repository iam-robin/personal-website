import clsx from 'clsx';
import Link from 'next/link';
import Hand from '../public/img/hand.svg';

const Footer = () => {
  const footerIndexLinks = ['projects', 'media', 'photos', 'changelog'];

  return (
    <footer
      className={clsx(
        "flex flex-wrap mt-16",
        "sm:flex-nowrap sm:mt-30 sm:mb-12",
        "dark:text-grey-200"
    )}>
      <div className={clsx(
        "w-full text-sm flex flex-row items-center order-2 mt-10 gap-4",
        "sm:w-2/5 sm:flex-col sm:order-[0] sm:mt-[0] sm:gap-[0] sm:items-start"
      )}>
        <Hand className="h-14 transition-transform hover:scale-110 hover:rotate-6" />
        <div>
          <div className="font-bold sm:mt-4">Robin Spielmann</div>
          <div className="mt-1 font-bold">© {new Date().getFullYear()}</div>
        </div>
      </div>
      <div className="w-1/3 sm:w-1/5">
        <span className="font-bold text-sm dark:text-grey-600">Index</span>
        <ul className="mt-[10px]">
          {
            footerIndexLinks.map((link, i) => (
              <li key={i} className="text-sm hover:text-blue">
                <Link href={`/${link}`} className="py-[6px] inline-block">
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="w-1/3 sm:w-1/5">
        <span className="font-bold text-sm dark:text-grey-600">Social</span>
        <ul className="mt-[10px]">
          <li className="text-sm hover:text-blue">
            <a href="https://twitter.com/iamrob_in" className="py-[6px] inline-block">Twitter ↗</a>
          </li>
          <li className="text-sm hover:text-blue">
            <a href="https://mastodon.social/@iamrobin" className="py-[6px] inline-block">Mastodon ↗</a>
          </li>
          <li className="text-sm hover:text-blue">
            <a href="https://github.com/iam-robin" className="py-[6px] inline-block">Github ↗</a>
          </li>
          <li className="text-sm hover:text-blue">
            <a href="https://www.instagram.com/iamrob.in/" className="py-[6px] inline-block">Instagram ↗</a>
          </li>
          <li className="text-sm hover:text-blue">
            <a href="mailto:hey@iamrob.in" className="py-[6px] inline-block">Email</a>
          </li>
        </ul>
      </div>
      <div className="w-1/3 sm:w-1/5">
        <span className="font-bold text-sm dark:text-grey-600">Legal</span>
        <ul className="mt-4">
          <li className="mt-3 text-sm hover:text-blue">
            <Link href={`/imprint`}>
              Imprint
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
