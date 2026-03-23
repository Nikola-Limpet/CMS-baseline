// This file provides TypeScript declarations for React Three Fiber JSX elements

// Simplified approach: just declare the JSX elements as any to avoid type errors
declare namespace JSX {
  interface IntrinsicElements {
    // Basic Three.js elements
    group: any
    mesh: any
    primitive: any
    
    // Geometries
    boxGeometry: any
    sphereGeometry: any
    cylinderGeometry: any
    coneGeometry: any
    planeGeometry: any
    circleGeometry: any
    
    // Materials
    meshStandardMaterial: any
    meshBasicMaterial: any
    
    // Lights
    ambientLight: any
    pointLight: any
    directionalLight: any
    spotLight: any
    
    // Other common elements
    lineSegments: any
    line: any
    points: any
    sprite: any
  }
}

// Declare module for 'three' to fix the missing declaration file error
declare module 'three' {
  // Just enough to satisfy basic usage
  export class Object3D {
    position: Vector3
    rotation: Euler
    scale: Vector3
    visible: boolean
    lookAt(target: Vector3 | number, y?: number, z?: number): void
  }

  export class Group extends Object3D {}
  export class Mesh extends Object3D {}

  export class Vector3 {
    x: number
    y: number
    z: number
    constructor(x?: number, y?: number, z?: number)
  }

  export class Euler {
    x: number
    y: number
    z: number
  }

  export class Event {
    stopPropagation(): void
  }

  export class Intersection {
    stopPropagation() {
      throw new Error("Method not implemented.")
    }
    distance: number
    point: Vector3
    faceIndex?: number
  }

  export const DoubleSide: number
}
