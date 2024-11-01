import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, RoundedBox, Text, CameraControls, useCursor, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const InteractivePortal = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);
  const controlRef = useRef();
  const scene = useThree((state) => state.scene);

  // Context loss handler
  useEffect(() => {
    const renderer = controlRef.current?.gl;
    if (renderer) {
      const handleContextLost = (event) => {
        event.preventDefault();
        console.log('WebGL context lost');
      };

      const handleContextRestored = () => {
        console.log('WebGL context restored');
      };

      renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

      return () => {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, []);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      const activeObject = scene.getObjectByName(active);
      if (activeObject) {
        activeObject.getWorldPosition(targetPosition);
        controlRef.current.setLookAt(
          0, 0, 5,
          targetPosition.x, targetPosition.y, targetPosition.z,
          true
        );
      }
    } else {
      controlRef.current.setLookAt(
        0, 0, 8,
        0, 0, 0,
        true
      );
    }
  }, [active, scene]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controlRef.current) {
        controlRef.current.dispose(); // Dispose of camera controls
      }
      // Dispose of other resources if added
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.8} />
      <Environment preset="sunset" />
      <CameraControls 
        ref={controlRef} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 4}  
        enableZoom={false} 
      />

      {/* Portal Structure */}
      <PortalContainer 
        texture={"Texture/p1.jpg"} // Use a lower-resolution texture
        name="portal" 
        active={active} 
        setActive={setActive}
        hovered={hovered} 
        setHovered={setHovered}
      >
        <Suspense fallback={<Text>Loading Portal...</Text>}> {/* Minimal fallback */}
          <PortalContent hovered={hovered === "portal"} />
        </Suspense>
      </PortalContainer>
    </>
  );
};

// Portal Container Component
const PortalContainer = ({ children, name, texture, active, setActive, hovered, setHovered, ...props }) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();

  useFrame((_state, delta) => {
    const isActive = active === name;
    if (portalMaterial.current) {
      portalMaterial.current.opacity = isActive ? 1 : 0.6;
    }
  });

  return (
    <group {...props}>
      <RoundedBox
        args={[3, 3.5, 0.1]}
        name={name}
        onClick={() => setActive(active === name ? null : name)}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}
      >
        <meshStandardMaterial map={map} color="lightblue" transparent />
        {children}
      </RoundedBox>
    </group>
  );
};

// Portal Content
const PortalContent = ({ hovered }) => {
  const color = hovered ? 'skyblue' : 'lightgreen';

  return (
    <Text fontSize={0.5} position={[0, 0, 0.2]} color={color} anchorY="middle">
      Welcome to the Portal
    </Text>
  );
};

export default InteractivePortal;
