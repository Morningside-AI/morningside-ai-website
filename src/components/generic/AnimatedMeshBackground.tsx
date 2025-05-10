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
        urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.4&cAzimuthAngle=180&cDistance=2.3&cPolarAngle=80&cameraZoom=9.1&color1=%23080808&color2=%23325E43&color3=%23469C71&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=50&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=0.4&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=31.1&rangeStart=9&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1&uFrequency=0&uSpeed=0.1&uStrength=0.8&uTime=9&wireframe=false"
      />
    </ShaderGradientCanvas>
    </div>
  );
};

export default AnimatedMeshBackground;
