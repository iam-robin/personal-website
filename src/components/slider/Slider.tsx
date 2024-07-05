import { useEffect, useRef } from 'react';
import './react-slider.css';
import { debounce } from 'src/utils/debounce';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import Container from '@components/Container';

interface SliderProps {
    children?: React.ReactNode | string;
    classes?: string;
    spacingTop?: boolean;
    buttonPosition?: 'top' | 'bottom' | null;
}

const Slider: React.FC<SliderProps> = ({
    children,
    classes,
    spacingTop,
    buttonPosition = 'bottom'
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const galleryRef = useRef<HTMLDivElement | null>(null);
    const prevButtonRef = useRef<HTMLButtonElement | null>(null);
    const nextButtonRef = useRef<HTMLButtonElement | null>(null);

    const gap = 40;

    useEffect(() => {
        const container = containerRef.current;
        const gallery = galleryRef.current;
        if (!container || !gallery) return;
        const slides = gallery?.querySelectorAll('.slide');
        const prevButton = prevButtonRef.current;
        const nextButton = nextButtonRef.current;

        const updateButtonStates = () => {
            const isScrolledToLeft = gallery.scrollLeft === 0;
            const isScrolledToRight =
                gallery.scrollLeft + gallery.clientWidth + 5 >= gallery.scrollWidth;

            if (isScrolledToLeft) {
                prevButton?.classList.add('disabled');
            } else {
                prevButton?.classList.remove('disabled');
            }

            if (isScrolledToRight) {
                nextButton?.classList.add('disabled');
            } else {
                nextButton?.classList.remove('disabled');
            }
        };

        gallery.addEventListener('scroll', debounce(updateButtonStates, 100));

        const scrollToNextVisibleSlide = () => {
            const viewportWidth = gallery?.clientWidth;
            let lastVisibleIndex = -1;
            prevButton?.classList.remove('disabled');

            // Find the last visible slide
            slides?.forEach((slide, index: number) => {
                const rect = slide.getBoundingClientRect();
                if (rect.left >= 0 && rect.right - rect.width / 2 <= (viewportWidth ?? 0)) {
                    lastVisibleIndex = index;
                }
            });

            // scroll to the next slide
            if (lastVisibleIndex !== -1) {
                if (lastVisibleIndex >= (slides?.length ?? 0) - 2) {
                    nextButton?.classList.add('disabled');
                }
                const nextSlide = slides?.[lastVisibleIndex + 1] as HTMLElement;
                if (nextSlide) {
                    const slideWidth = nextSlide.offsetWidth;
                    const scrollLeft = nextSlide.offsetLeft + slideWidth - (viewportWidth ?? 0);
                    gallery?.scrollTo({ left: scrollLeft + gap, behavior: 'smooth' });
                }
            }
        };

        const scrollToPrevVisibleSlide = () => {
            const viewportWidth = gallery?.clientWidth;
            let firstVisibleIndex = -1;
            let firstVisibleFound = false;
            nextButton?.classList.remove('disabled');

            // Find the first visible slide
            slides?.forEach((slide, index) => {
                if (firstVisibleFound) return;

                const rect = slide.getBoundingClientRect();
                if (rect.left >= (rect.width / 2) * -1 && rect.right <= (viewportWidth ?? 0)) {
                    firstVisibleIndex = index;
                    firstVisibleFound = true;
                }
            });

            // scroll to the prev slide
            if (firstVisibleIndex !== -1) {
                if (firstVisibleIndex <= 1) {
                    prevButton?.classList.add('disabled');
                    gallery?.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const prevSlide = slides?.[firstVisibleIndex - 1] as HTMLElement;
                    if (prevSlide) {
                        const scrollRight = prevSlide.offsetLeft;
                        gallery?.scrollTo({ left: scrollRight - gap, behavior: 'smooth' });
                    }
                }
            }
        };

        prevButton?.addEventListener('click', scrollToPrevVisibleSlide);
        nextButton?.addEventListener('click', scrollToNextVisibleSlide);

        return () => {
            gallery.removeEventListener('scroll', updateButtonStates);
            prevButton?.removeEventListener('click', scrollToPrevVisibleSlide);
            nextButton?.removeEventListener('click', scrollToNextVisibleSlide);
        };
    }, []);

    return (
        <div ref={containerRef} className={classes}>
            {buttonPosition === 'top' && (
                <Container classes="mt-2 items-center justify-end hidden md:flex">
                    <div className="flex gap-2">
                        <button
                            ref={prevButtonRef}
                            className="prev-button disabled group flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-neutral-100"
                        >
                            <ArrowLeft
                                size={30}
                                className="translate-x-1 transition group-hover:translate-x-0"
                            />
                        </button>
                        <button
                            ref={nextButtonRef}
                            className="next-button group flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-neutral-100"
                        >
                            <ArrowRight
                                size={30}
                                className="-translate-x-1 transition group-hover:translate-x-0"
                            />
                        </button>
                    </div>
                </Container>
            )}
            <div
                className="slider-grid"
                style={{
                    gridTemplateColumns:
                        '[full-start] 1fr [content-start] min( var(--content-max-width), calc(100% - var(--space-md) * 2) ) [content-end] 1fr [full-end]'
                }}
            >
                <div
                    ref={galleryRef}
                    className="gallery col-[full] grid grid-cols-[inherit] overflow-x-scroll"
                >
                    <div
                        className={`col-[content] flex gap-4 pt-3 lg:gap-8 ${
                            spacingTop ? 'pt-5' : ''
                        }`}
                    >
                        {children}
                    </div>
                </div>
            </div>
            {buttonPosition === 'bottom' && (
                <Container classes="mt-8 items-center justify-end hidden md:flex">
                    <div className="flex gap-2">
                        <button
                            ref={prevButtonRef}
                            className="prev-button disabled group flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-neutral-100"
                        >
                            <ArrowLeft
                                size={30}
                                className="translate-x-1 transition group-hover:translate-x-0"
                            />
                        </button>
                        <button
                            ref={nextButtonRef}
                            className="next-button group flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-neutral-100"
                        >
                            <ArrowRight
                                size={30}
                                className="-translate-x-1 transition group-hover:translate-x-0"
                            />
                        </button>
                    </div>
                </Container>
            )}
        </div>
    );
};

export default Slider;
