// src/components/slider/SliderItem.jsx
import React from 'react';

interface ContainerProps {
    children?: React.ReactNode | string;
    classes?: string;
}

const Container: React.FC<ContainerProps> = ({ children, classes }) => {
    return (
        <div className={`mx-auto max-w-screen-lg px-4 sm:px-8 lg-with-padding:px-0 ${classes}`}>
            {children}
        </div>
    );
};

export default Container;
