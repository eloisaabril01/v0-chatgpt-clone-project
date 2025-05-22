"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Environment } from "@react-three/drei"
import * as THREE from "three"

function Brain(props: any) {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 2) / 10, 0.1)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.sin(t / 4) / 20, 0.1)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(t / 1.5) / 10, 0.1)
    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, Math.sin(t / 3) / 6 + 1, 0.1)
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, Math.sin(t / 3) / 6 + 1, 0.1)
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, Math.sin(t / 3) / 6 + 1, 0.1)
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.8} />
      </mesh>
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  )
}

function LoadingText() {
  const textRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.1 - 2
    }
  })

  return (
    <Text
      ref={textRef}
      color="white"
      fontSize={0.5}
      font="/fonts/Inter_Regular.json"
      position={[0, -2, 0]}
      anchorX="center"
      anchorY="middle"
    >
      Loading Nav's GPT...
    </Text>
  )
}

export default function LoadingScene() {
  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#111"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Brain position={[0, 0, 0]} />
        <LoadingText />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
