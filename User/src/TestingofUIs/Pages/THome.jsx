import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Category from './Component/Category';
import ViewProduct from './Component/ViewProduct';

const Saleproduct = lazy(() => import('./Component/Saleproduct'));

const THome = () => {
    const [inView, setInView] = useState(true);

    const handleScroll = () => {
        const canvasTop = document.getElementById('canvas-container').getBoundingClientRect().top;
        setInView(canvasTop < window.innerHeight && canvasTop > 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOverlayScroll = (e) => {
        e.stopPropagation(); // Prevent interference with other events
    };

    return (
        <div>
            <Category />
            <Suspense fallback={<div>Loading...</div>}>
                {/* Main Canvas */}
                <Canvas
                    frameloop={inView ? "always" : "demand"}
                    camera={{ position: [0, 0, 6], fov: 35 }}
                    style={{ height: "80vh", width: "auto" }}
                    id="canvas-container"
                >
                    <Saleproduct />
                </Canvas>
            </Suspense>
            
            {/* Overlay Canvas */}
            <div
                style={{
                    position: "absolute",
                    top: 180,
                    left: "50%",
                    width: "50%",
                    height: "80vh",
                    zIndex: 10, // Ensure it overlays the main canvas
                    background: "rgba(255, 255, 255, 0)", // Fully transparent
                    pointerEvents: "auto", // Allow interactions
                    // backgroundColor:"red"
                }}
                onScroll={handleOverlayScroll}
            >
                {/* Optional content here */}
            </div>
            <ViewProduct />
        </div>
    );
};

export default THome;
