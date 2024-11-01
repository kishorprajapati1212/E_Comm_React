import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import Category from './Component/Category';
import ViewProduct from './Component/ViewProduct';


const Saleproduct = lazy(() => import('./Component/Saleproduct'));

const THome = () => {
    const [inView, setInView] = React.useState(true);

    const handleScroll = () => {
        const canvasTop = document.getElementById('canvas-container').getBoundingClientRect().top;
        setInView(canvasTop < window.innerHeight && canvasTop > 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <Category />
            <Suspense fallback={<div>Loading...</div>}>
                <Canvas 
                    frameloop={inView ? "always" : "demand"}
                    camera={{ position: [0, 0, 6], fov: 35 }}
                    style={{ height: "80vh", width: "auto" }}
                    id="canvas-container"
                >
                    <Saleproduct />
                </Canvas>
            </Suspense>
            <ViewProduct />
        </div>
    );
};
export default THome;
