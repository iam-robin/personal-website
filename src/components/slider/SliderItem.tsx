// src/components/slider/SliderItem.jsx
import React from 'react';

interface SliderItemProps {
    children?: React.ReactNode | string;
    emptyEnd?: boolean;
    classes?: string;
    size?: 'small' | 'medium' | 'large';
}

const SliderItem: React.FC<SliderItemProps> = ({
    children,
    emptyEnd = false,
    classes,
    size = 'medium'
}) => {
    const baseClasses = ['slide', 'flex', 'shrink-0', 'content-center', 'items-center'];
    const widthClasses = [
        !emptyEnd && size === 'small' ? 'w-[calc(25%-(96px/4))]' : '',
        !emptyEnd && size === 'medium'
            ? 'w-[calc(100%-(64px/3))] xs:w-[calc(50%-(64px/3))] md:w-[calc(33.33%-(64px/3))]'
            : '',
        !emptyEnd && size === 'large' ? 'w-1/2' : ''
    ];
    const endWidthClass = emptyEnd
        ? 'w-4 sm:w-8 lg-with-padding:w-[calc((100vw-1024px)/2-2rem)]'
        : '';

    return (
        <div
            className={`${classes} ${baseClasses.join(' ')} ${widthClasses.join(
                ' '
            )} ${endWidthClass}`}
        >
            {children}
        </div>
    );
};

export default SliderItem;
