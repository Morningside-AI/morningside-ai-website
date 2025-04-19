"use client";

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

const AnimatedMeshBackground = () => {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <ShaderGradientCanvas
      style={{
        position: 'absolute',
        top: 0,
        zIndex: -1,
      }}
    >
      <ShaderGradient
        control="query"
        urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.5&cAzimuthAngle=180&cDistance=1.8&cPolarAngle=80&cameraZoom=9.1&color1=%23000000&color2=%23469C71&color3=%23000000&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=0.5&uFrequency=0&uSpeed=0.4&uStrength=1&uTime=8&wireframe=false"
      />
    </ShaderGradientCanvas>
    </div>
  );
};

export default AnimatedMeshBackground;
