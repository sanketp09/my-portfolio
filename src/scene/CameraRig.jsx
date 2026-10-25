import { useContext, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { SceneContext, AVATARS } from '../context/SceneContext';

export function CameraRig() {
  const { camera } = useThree();
  const ctx = useContext(SceneContext);
  if (!ctx) return null;
  const { selected } = ctx;

  useEffect(() => {
    const isAvatar = selected && AVATARS[selected];
    const target = isAvatar
      ? {
          x: AVATARS[selected].position[0] * 0.3,
          y: 1.8,
          z: 4.5,
        }
      : { x: 0, y: 1.5, z: 6 };

    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.1,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => {
        camera.lookAt(isAvatar ? AVATARS[selected].position[0] * 0.15 : 0, 1.0, 0);
      },
    })
  }, [selected, camera])

  return null
}
