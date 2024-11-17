import { useNavigate } from '@remix-run/react'
import {
  ArcballControls,
  Billboard,
  GizmoHelper,
  GizmoViewport,
  Stars,
  Text,
} from '@react-three/drei'
import { Canvas, Vector3 } from '@react-three/fiber'
import { useRef } from 'react'
// @ts-ignore
import * as THREE from 'three'
import { Project } from '@/types'

const Box = ({
  project,
}: {
  project: Project,
}) => {
  const meshRef = useRef<THREE.Mesh>()
  const navigate = useNavigate()

  return (
    <mesh
      position={project.embedding as Vector3}
      ref={meshRef}
      onClick={() => { navigate(`/projects/${project.id}`) }}
    >
      <sphereGeometry />
      <meshStandardMaterial emissive="skyblue" emissiveIntensity={5} />
      <Billboard>
        <Text
          fontSize={1}
          maxWidth={12}
          anchorY="top"
          overflowWrap="break-word"
        >
          {project.name}
        </Text>
      </Billboard>
    </mesh>
  )
}

export const Explore = ({
  projectList,
}: {
  projectList: Project[],
}) => {
  return (
    <div className="absolute h-dvh w-dvw top-0">
      <Canvas>
        <ArcballControls makeDefault />
        <GizmoHelper alignment="bottom-left">
        <GizmoViewport />
        </GizmoHelper>
        <Stars />
        {projectList.map((project, i) => (
          <Box key={i} project={project} />
        ))}
      </Canvas>
    </div>
  )
}

