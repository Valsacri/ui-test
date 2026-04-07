"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import {
  defaultPlacementEditorSettings,
  PLACEMENT_ZONE_IDS,
  type JerseySponsorPreviewProps,
  type PlacementZoneId,
  type ZonePlacementAdjust,
  type ZoneSurfaceAnchor,
} from "@/lib/types/campaign-jersey-placement"
import { cn } from "@/lib/utils"

export type { JerseySponsorPreviewProps }

/** Imperative API for exporting renders (e.g. four-sided PNG snapshots). */
export interface JerseySponsorPreviewHandle {
  /** Returns PNG data URLs for front, back, left, right (yaw reset to 0 for consistent labels). */
  captureFourViews: () => Promise<{ name: string; label: string; dataUrl: string }[]>
}

const MODEL_URL = "/models/jersey.glb"
const MESH_BIAS_Y = -0.32
const CANVAS_TRANSLATE_Y_PERCENT = "2%"
const INITIAL_CAMERA_Z = 3.15
const MODEL_TARGET_SIZE = 1.88
const DRACO_DECODER = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"

const ZONE = {
  chestYFrac: 0.64,
  chestWFrac: 0.26,
  chestHFrac: 0.16,
  /** Higher = back logo sits higher (toward shoulders). */
  backYFrac: 0.78,
  backWFrac: 0.28,
  backHFrac: 0.17,
  sleeveYFrac: 0.72,
  sleeveWFrac: 0.12,
  sleeveHFrac: 0.1,
  surfaceEpsFrac: 0.002,
  rayPad: 0.55,
  decalProjectorDepth: 0.11,
  decalPlaneFallbackOffset: 0.0004,
  sidePlaneNormalOffset: 0.004,
  sleeveDecalProjectorDepth: 0.048,
  sleeveDecalSizeScale: 0.82,
  sleeveZFrac: 0.38,
  backNumberYFrac: 0.5,
} as const

/** Set on logo/decal meshes so rotation spins in-plane around the surface normal (not like a clock hand). */
const UD_PLACEMENT_NORMAL = "placementNormalWorld" as const
const PLACEMENT_KIND_CUSTOM_TEXT = "custom_text" as const

function buildCustomTextCanvas(text: string, fontFamily: string, color: string): { canvas: HTMLCanvasElement; aspect: number } {
  const display = text.trim().slice(0, 120)
  const maxW = 1024
  const maxH = 512
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  let fontPx = Math.min(96, Math.floor(maxH * 0.35))
  ctx.font = `bold ${fontPx}px ${fontFamily}`
  let m = ctx.measureText(display)
  while (m.width > maxW - 64 && fontPx > 18) {
    fontPx -= 3
    ctx.font = `bold ${fontPx}px ${fontFamily}`
    m = ctx.measureText(display)
  }
  const pad = 40
  const w = Math.min(maxW, Math.ceil(m.width + pad * 2))
  const h = Math.min(maxH, Math.ceil(fontPx * 1.35 + pad * 2))
  canvas.width = w
  canvas.height = h
  ctx.font = `bold ${fontPx}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.clearRect(0, 0, w, h)
  ctx.fillText(display, w / 2, h / 2)
  return { canvas, aspect: w / Math.max(h, 1) }
}

function applyZoneAdjustToMesh(mesh: THREE.Mesh, adj: ZonePlacementAdjust, anchorLocked = false) {
  const s = adj.scale > 0 ? adj.scale : 1
  mesh.scale.multiplyScalar(s)
  const rad = THREE.MathUtils.degToRad(adj.rotationDeg)
  if (Math.abs(rad) > 1e-6) {
    mesh.updateMatrixWorld(true)
    const stored = mesh.userData[UD_PLACEMENT_NORMAL] as THREE.Vector3 | undefined
    const axis =
      stored?.clone().normalize() ??
      new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion).normalize()
    mesh.rotateOnWorldAxis(axis, rad)
  }
  if (!anchorLocked) {
    mesh.translateX(adj.offsetX)
    mesh.translateY(adj.offsetY)
    mesh.translateZ(adj.offsetZ)
  }
}

function worldNormalFromHit(hit: THREE.Intersection): THREE.Vector3 {
  if (hit.face) {
    return hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize()
  }
  return new THREE.Vector3(0, 0, 1)
}

function outwardNormalForSleeve(hit: THREE.Intersection, side: "left" | "right"): THREE.Vector3 {
  const n = worldNormalFromHit(hit)
  if (side === "left" && n.x > 0) n.negate()
  if (side === "right" && n.x < 0) n.negate()
  return n.normalize()
}

const WORLD_UP = new THREE.Vector3(0, 1, 0)
/** Slight X bias + world Y so sleeve patches stay visually level on curved arms. */
const SLEEVE_REF_UP_LEFT = new THREE.Vector3(-0.35, 1, 0).normalize()
const SLEEVE_REF_UP_RIGHT = new THREE.Vector3(0.35, 1, 0).normalize()

/**
 * Orient +Z along `n` but lock local +Y to "upright" (world Y projected onto the tangent plane).
 * This removes arbitrary roll from `setFromUnitVectors` so logos and numbers stay level when
 * dragging across curved surfaces. Optional `referenceUp` for shoulders (e.g. world up along arm).
 */
function uprightQuaternionFromNormal(n: THREE.Vector3, flipUpsideDown = false, referenceUp?: THREE.Vector3): THREE.Quaternion {
  const nz = n.clone().normalize()
  const ref = referenceUp ?? WORLD_UP
  let u = ref.clone().sub(nz.clone().multiplyScalar(ref.dot(nz)))
  if (u.lengthSq() < 1e-10) {
    const z = new THREE.Vector3(0, 0, 1)
    u = z.clone().sub(nz.clone().multiplyScalar(z.dot(nz)))
    if (u.lengthSq() < 1e-10) {
      u.set(1, 0, 0).sub(nz.clone().multiplyScalar(nz.x))
    }
  }
  u.normalize()
  const r = u.clone().cross(nz).normalize()
  const uOrtho = nz.clone().cross(r).normalize()
  const m = new THREE.Matrix4().makeBasis(r, uOrtho, nz)
  const q = new THREE.Quaternion().setFromRotationMatrix(m)
  if (flipUpsideDown) {
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI))
  }
  return q
}

function tryAddConformDecal(
  mat: THREE.MeshBasicMaterial,
  w: number,
  h: number,
  projectorDepth: number,
  hit: THREE.Intersection,
  parent: THREE.Group,
  flipUpsideDown = false,
  sleeveSide?: "left" | "right"
): THREE.Mesh | null {
  const source = hit.object
  if (!(source instanceof THREE.Mesh) || !source.geometry) return null
  const n = sleeveSide ? outwardNormalForSleeve(hit, sleeveSide) : worldNormalFromHit(hit)
  const refUp = sleeveSide === "left" ? SLEEVE_REF_UP_LEFT : sleeveSide === "right" ? SLEEVE_REF_UP_RIGHT : undefined
  const q = uprightQuaternionFromNormal(n, flipUpsideDown, refUp)
  const euler = new THREE.Euler().setFromQuaternion(q)
  let geom: THREE.BufferGeometry
  try {
    geom = new DecalGeometry(source, hit.point.clone(), euler, new THREE.Vector3(w, h, projectorDepth))
  } catch {
    return null
  }
  const posAttr = geom.getAttribute("position")
  if (!posAttr || posAttr.count === 0) {
    geom.dispose()
    return null
  }
  const decalMesh = new THREE.Mesh(geom, mat)
  decalMesh.renderOrder = 2
  /** Decal verts are not centered on mesh origin — rotation would orbit. Move pivot to bbox center. */
  geom.computeBoundingBox()
  const bb = geom.boundingBox
  if (bb) {
    const c = new THREE.Vector3()
    bb.getCenter(c)
    geom.translate(-c.x, -c.y, -c.z)
    decalMesh.position.copy(c)
  }
  const nWorld = (sleeveSide ? outwardNormalForSleeve(hit, sleeveSide) : worldNormalFromHit(hit)).clone().normalize()
  decalMesh.userData[UD_PLACEMENT_NORMAL] = nWorld
  parent.add(decalMesh)
  return decalMesh
}

function addDecalPlane(
  mat: THREE.MeshBasicMaterial,
  w: number,
  h: number,
  hit: THREE.Intersection,
  parent: THREE.Group,
  normalOffset: number,
  flipUpsideDown = false,
  sleeveSide?: "left" | "right"
): THREE.Mesh {
  const n = sleeveSide ? outwardNormalForSleeve(hit, sleeveSide) : worldNormalFromHit(hit)
  const off = sleeveSide ? ZONE.sidePlaneNormalOffset : normalOffset
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
  mesh.position.copy(hit.point).addScaledVector(n, off)
  const refUp = sleeveSide === "left" ? SLEEVE_REF_UP_LEFT : sleeveSide === "right" ? SLEEVE_REF_UP_RIGHT : undefined
  mesh.quaternion.copy(uprightQuaternionFromNormal(n, flipUpsideDown, refUp))
  const nStore = sleeveSide ? outwardNormalForSleeve(hit, sleeveSide) : worldNormalFromHit(hit)
  mesh.userData[UD_PLACEMENT_NORMAL] = nStore.clone().normalize()
  mesh.renderOrder = 2
  parent.add(mesh)
  return mesh
}

function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose()
      const m = child.material
      if (Array.isArray(m)) m.forEach((mm) => mm.dispose())
      else m?.dispose()
    }
  })
}

function applyJerseyColorToModel(root: THREE.Object3D, color: THREE.Color) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const mats = Array.isArray(child.material) ? child.material : [child.material]
    mats.forEach((m) => {
      if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
        m.color.copy(color)
        m.roughness = 0.55
        m.metalness = 0.05
        m.needsUpdate = true
      } else if (m instanceof THREE.MeshBasicMaterial) {
        m.color.copy(color)
        m.needsUpdate = true
      }
    })
  })
}

function addFallbackShirt(shirtGroup: THREE.Group, color: THREE.Color) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 })
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.48, 0.44), mat)
  shirtGroup.add(torso)
  const sleeveGeo = new THREE.BoxGeometry(0.42, 0.58, 0.4)
  const l = new THREE.Mesh(sleeveGeo, mat.clone())
  l.position.set(-0.76, 0.22, 0)
  shirtGroup.add(l)
  const r = new THREE.Mesh(sleeveGeo, mat.clone())
  r.position.set(0.76, 0.22, 0)
  shirtGroup.add(r)
}

/** Persistent Three.js objects that survive across prop changes. */
interface SceneCtx {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  shirtGroup: THREE.Group
  logoGroup: THREE.Group
  raycaster: THREE.Raycaster
  dom: HTMLCanvasElement
}

export const JerseySponsorPreview = forwardRef<JerseySponsorPreviewHandle, JerseySponsorPreviewProps>(function JerseySponsorPreview(
  {
    logoUrl,
    activeZones,
    jerseyColor,
    className,
    editor: editorProp,
    onZoneAnchorChange,
    onCustomTextAnchorChange,
  },
  ref
) {
  const editor = editorProp ?? defaultPlacementEditorSettings()
  const { cameraDistanceMul, modelYawDeg, zoneAdjustments, backNumber, zoneAnchors, customText, customTextAnchor } = editor

  const mountRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<SceneCtx | null>(null)
  const jerseyRootRef = useRef<THREE.Object3D | null>(null)
  const sponsorMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const orbitBaseDistanceRef = useRef(0)
  const cameraDistanceMulRef = useRef(cameraDistanceMul)
  cameraDistanceMulRef.current = cameraDistanceMul
  const draftZoneAnchorsRef = useRef<Partial<Record<PlacementZoneId, ZoneSurfaceAnchor>>>({})
  const draftCustomTextAnchorRef = useRef<ZoneSurfaceAnchor | null>(null)

  const onZoneAnchorChangeRef = useRef(onZoneAnchorChange)
  onZoneAnchorChangeRef.current = onZoneAnchorChange
  const onCustomTextAnchorChangeRef = useRef(onCustomTextAnchorChange)
  onCustomTextAnchorChangeRef.current = onCustomTextAnchorChange

  const [modelReady, setModelReady] = useState(false)
  const [textureReady, setTextureReady] = useState(0)

  const zonesKey = JSON.stringify(activeZones)
  const editorPlacementKey = JSON.stringify({ zoneAdjustments, backNumber, zoneAnchors, customText, customTextAnchor })

  // ─── Effect 1: Scene setup (mount-only). Camera, renderer, controls, lights, loop. ───
  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0.2, INITIAL_CAMERA_Z)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1

    const dom = renderer.domElement
    dom.style.display = "block"
    dom.style.width = "100%"
    dom.style.height = "100%"
    dom.style.transform = `translateY(${CANVAS_TRANSLATE_Y_PERCENT})`
    dom.style.cursor = "grab"

    const controls = new OrbitControls(camera, dom)
    controls.enablePan = false
    controls.target.set(0, 0, 0)
    controls.minPolarAngle = 0.75
    controls.maxPolarAngle = Math.PI / 2
    controls.minDistance = 1.5
    controls.maxDistance = 5
    controls.enableDamping = true
    controls.dampingFactor = 0.12
    controls.update()

    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.35))
    const d1 = new THREE.DirectionalLight(0xffffff, 1.2)
    d1.position.set(4, 8, 6)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4)
    d2.position.set(-4, 2, -4)
    scene.add(d2)

    const shirtGroup = new THREE.Group()
    scene.add(shirtGroup)
    const logoGroup = new THREE.Group()
    shirtGroup.add(logoGroup)

    const raycaster = new THREE.Raycaster()

    const ctx: SceneCtx = { scene, camera, renderer, controls, shirtGroup, logoGroup, raycaster, dom }
    ctxRef.current = ctx

    const setSize = () => {
      const w = Math.max(2, el.offsetWidth || el.clientWidth || 320)
      const h = Math.max(2, el.offsetHeight || el.clientHeight || 360)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    setSize()
    el.appendChild(dom)
    requestAnimationFrame(setSize)

    const ro = new ResizeObserver(setSize)
    ro.observe(el)

    let alive = true
    const loop = () => {
      if (!alive) return
      requestAnimationFrame(loop)
      controls.update()
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      alive = false
      ro.disconnect()
      controls.dispose()
      ctxRef.current = null

      scene.remove(shirtGroup)
      disposeObject(shirtGroup)
      renderer.dispose()
      if (dom.parentNode === el) el.removeChild(dom)
    }
  }, [])

  // ─── Effect 2: Load GLB model once. Re-runs only on mount. ───
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) return

    const { shirtGroup, camera, controls } = ctx
    let cancelled = false

    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(DRACO_DECODER)
    gltfLoader.setDRACOLoader(dracoLoader)

    const onLoaded = (root: THREE.Object3D) => {
      if (cancelled) {
        disposeObject(root)
        return
      }
      root.updateMatrixWorld(true)
      applyJerseyColorToModel(root, new THREE.Color(jerseyColor))

      const box = new THREE.Box3().setFromObject(root)
      if (!box.isEmpty()) {
        const center = box.getCenter(new THREE.Vector3())
        root.position.sub(center)
        root.updateMatrixWorld(true)
        const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3())
        root.scale.setScalar(MODEL_TARGET_SIZE / Math.max(size.x, size.y, size.z, 1e-6))
        root.position.y += MESH_BIAS_Y
      }

      shirtGroup.add(root)
      root.updateMatrixWorld(true)
      jerseyRootRef.current = root

      shirtGroup.updateMatrixWorld(true)
      const focusBox = new THREE.Box3().setFromObject(shirtGroup)
      if (!focusBox.isEmpty()) {
        const focus = focusBox.getCenter(new THREE.Vector3())
        const prev = controls.target.clone()
        controls.target.copy(focus)
        camera.position.add(focus.clone().sub(prev))
        controls.update()
        orbitBaseDistanceRef.current = camera.position.distanceTo(controls.target)
      }

      setModelReady(true)
    }

    gltfLoader.load(
      MODEL_URL,
      (gltf) => onLoaded(gltf.scene),
      undefined,
      () => {
        if (cancelled) return
        addFallbackShirt(shirtGroup, new THREE.Color(jerseyColor))
        jerseyRootRef.current = shirtGroup
        setModelReady(true)
      }
    )

    return () => {
      cancelled = true
      dracoLoader.dispose()
    }
    // jerseyColor used only for initial load color; recoloring is a separate effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Effect 3: Recolor jersey when color changes (no GLB reload). ───
  useEffect(() => {
    const root = jerseyRootRef.current
    if (!root || !modelReady) return
    applyJerseyColorToModel(root, new THREE.Color(jerseyColor))
  }, [jerseyColor, modelReady])

  // ─── Effect 4: Load logo texture when logoUrl changes. ───
  useEffect(() => {
    if (!logoUrl) {
      sponsorMaterialRef.current?.dispose()
      sponsorMaterialRef.current = null
      setTextureReady((v) => v + 1)
      return
    }

    let cancelled = false
    const texLoader = new THREE.TextureLoader()
    texLoader.load(
      logoUrl,
      (tex) => {
        if (cancelled) {
          tex.dispose()
          return
        }
        tex.colorSpace = THREE.SRGBColorSpace
        tex.needsUpdate = true

        sponsorMaterialRef.current?.dispose()
        sponsorMaterialRef.current = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        })
        setTextureReady((v) => v + 1)
      },
      undefined,
      () => {}
    )

    return () => {
      cancelled = true
    }
  }, [logoUrl])

  // ─── Effect 5: Place decals. Runs when model/texture/zones/editor change. Camera untouched. ───
  useEffect(() => {
    const ctx = ctxRef.current
    const jerseyRoot = jerseyRootRef.current
    if (!ctx || !jerseyRoot || !modelReady) return

    const { shirtGroup, logoGroup, raycaster } = ctx
    const sponsorMaterial = sponsorMaterialRef.current

    const clearLogoMeshes = () => {
      logoGroup.children.forEach((child) => {
        if (!(child instanceof THREE.Mesh)) return
        const m = child.material
        if (m instanceof THREE.MeshBasicMaterial) {
          if (m.map && m.map !== sponsorMaterial?.map) m.map.dispose()
          if (m !== sponsorMaterial) m.dispose()
        }
        child.geometry?.dispose()
      })
      logoGroup.clear()
    }

    clearLogoMeshes()

    jerseyRoot.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(jerseyRoot)
    if (box.isEmpty()) return

    const zoneFlags = JSON.parse(zonesKey) as Record<PlacementZoneId, boolean>

    const min = box.min
    const max = box.max
    const sx = max.x - min.x
    const sy = max.y - min.y
    const epsFallback = Math.max(sx, sy, max.z - min.z) * ZONE.surfaceEpsFrac
    const cx = (min.x + max.x) / 2
    const sz = max.z - min.z
    const sleeveZ = min.z + sz * ZONE.sleeveZFrac
    const pad = ZONE.rayPad
    const chestY = min.y + sy * ZONE.chestYFrac
    const backY = min.y + sy * ZONE.backYFrac
    const sleeveY = min.y + sy * ZONE.sleeveYFrac
    const numberY = min.y + sy * ZONE.backNumberYFrac

    const mergedAnchors: Partial<Record<PlacementZoneId, ZoneSurfaceAnchor>> = {
      ...zoneAnchors,
      ...draftZoneAnchorsRef.current,
    }

    const firstMeshHit = (origin: THREE.Vector3, direction: THREE.Vector3): THREE.Intersection | null => {
      direction.normalize()
      raycaster.set(origin, direction)
      return raycaster.intersectObjects([jerseyRoot], true).find((h) => h.object instanceof THREE.Mesh) ?? null
    }

    const firstMeshHitSide = (origin: THREE.Vector3, direction: THREE.Vector3, side: "left" | "right"): THREE.Intersection | null => {
      direction.normalize()
      raycaster.set(origin, direction)
      const hits = raycaster.intersectObjects([jerseyRoot], true).filter((h) => h.object instanceof THREE.Mesh)
      const outward = hits.filter((h) => {
        const nx = worldNormalFromHit(h).x
        return side === "left" ? nx < -0.22 : nx > 0.22
      })
      const pool = outward.length > 0 ? outward : hits
      if (pool.length === 0) return null
      return side === "left"
        ? pool.reduce((a, b) => (a.point.x < b.point.x ? a : b))
        : pool.reduce((a, b) => (a.point.x > b.point.x ? a : b))
    }

    const hitFromAnchor = (zone: PlacementZoneId, anchor: ZoneSurfaceAnchor): THREE.Intersection | null => {
      shirtGroup.updateMatrixWorld(true)
      const pLocal = new THREE.Vector3(anchor.px, anchor.py, anchor.pz)
      const nLocal = new THREE.Vector3(anchor.nx, anchor.ny, anchor.nz)
      if (nLocal.lengthSq() < 1e-10) return null
      nLocal.normalize()
      const pWorld = shirtGroup.localToWorld(pLocal.clone())
      const nWorld = nLocal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(shirtGroup.matrixWorld)).normalize()
      const origin = pWorld.clone().addScaledVector(nWorld, ZONE.rayPad * 0.35)
      raycaster.set(origin, nWorld.clone().negate())
      const hits = raycaster.intersectObjects([jerseyRoot], true).filter((h) => h.object instanceof THREE.Mesh)
      if (hits.length === 0) return null
      if (zone === "left_sleeve" || zone === "right_sleeve") {
        const side = zone === "left_sleeve" ? "left" : "right"
        const outward = hits.filter((h) => (side === "left" ? worldNormalFromHit(h).x < -0.22 : worldNormalFromHit(h).x > 0.22))
        const pool = outward.length > 0 ? outward : hits
        let best = pool[0]
        let bestD = best.point.distanceToSquared(pWorld)
        for (let i = 1; i < pool.length; i++) {
          const d = pool[i].point.distanceToSquared(pWorld)
          if (d < bestD) { best = pool[i]; bestD = d }
        }
        return best
      }
      return hits[0]
    }

    if (sponsorMaterial) {
      const mat = sponsorMaterial
      const getAdj = (id: PlacementZoneId): ZonePlacementAdjust => zoneAdjustments[id]

      const placeLogoZone = (
        id: PlacementZoneId, w: number, h: number, hit: THREE.Intersection | null,
        opts: { flipUpsideDown: boolean; sleeveSide?: "left" | "right"; decalDepth: number },
        anchorLocked: boolean
      ) => {
        if (!hit) return
        let mesh: THREE.Mesh | null = tryAddConformDecal(mat, w, h, opts.decalDepth, hit, logoGroup, opts.flipUpsideDown, opts.sleeveSide)
        if (!mesh) mesh = addDecalPlane(mat, w, h, hit, logoGroup, ZONE.decalPlaneFallbackOffset, opts.flipUpsideDown, opts.sleeveSide)
        mesh.userData.placementZoneId = id
        applyZoneAdjustToMesh(mesh, getAdj(id), anchorLocked)
      }

      const fallbackPlane = (x: number, y: number, zPos: number, w: number, h: number, outwardNormal: THREE.Vector3): THREE.Mesh => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
        mesh.position.set(x, y, zPos)
        const nn = outwardNormal.clone().normalize()
        mesh.quaternion.copy(uprightQuaternionFromNormal(nn, false))
        mesh.userData[UD_PLACEMENT_NORMAL] = nn
        mesh.renderOrder = 2
        logoGroup.add(mesh)
        return mesh
      }

      const resolveHit = (zone: PlacementZoneId, defaultOrigin: THREE.Vector3, defaultDir: THREE.Vector3, side?: "left" | "right") => {
        const a = mergedAnchors[zone]
        let hit: THREE.Intersection | null = null
        let anchorLocked = false
        if (a) { hit = hitFromAnchor(zone, a); if (hit) anchorLocked = true }
        if (!hit) { hit = side ? firstMeshHitSide(defaultOrigin, defaultDir, side) : firstMeshHit(defaultOrigin, defaultDir); anchorLocked = false }
        return { hit, anchorLocked }
      }

      if (zoneFlags.chest) {
        const w = sx * ZONE.chestWFrac, h = sy * ZONE.chestHFrac
        const { hit, anchorLocked } = resolveHit("chest", new THREE.Vector3(cx, chestY, max.z + pad), new THREE.Vector3(0, 0, -1))
        if (hit) placeLogoZone("chest", w, h, hit, { flipUpsideDown: false, decalDepth: ZONE.decalProjectorDepth }, anchorLocked)
        else {
          const m = fallbackPlane(cx, chestY, max.z + epsFallback, w, h, new THREE.Vector3(0, 0, -1))
          m.userData.placementZoneId = "chest"
          applyZoneAdjustToMesh(m, getAdj("chest"))
        }
      }
      if (zoneFlags.back) {
        const w = sx * ZONE.backWFrac, h = sy * ZONE.backHFrac
        const { hit, anchorLocked } = resolveHit("back", new THREE.Vector3(cx, backY, min.z - pad), new THREE.Vector3(0, 0, 1))
        if (hit) placeLogoZone("back", w, h, hit, { flipUpsideDown: false, decalDepth: ZONE.decalProjectorDepth }, anchorLocked)
        else {
          const m = fallbackPlane(cx, backY, min.z - epsFallback, w, h, new THREE.Vector3(0, 0, 1))
          m.userData.placementZoneId = "back"
          applyZoneAdjustToMesh(m, getAdj("back"))
        }
      }
      if (zoneFlags.left_sleeve) {
        const w = sx * ZONE.sleeveWFrac * ZONE.sleeveDecalSizeScale, h = sy * ZONE.sleeveHFrac * ZONE.sleeveDecalSizeScale
        const { hit, anchorLocked } = resolveHit("left_sleeve", new THREE.Vector3(min.x - pad, sleeveY, sleeveZ), new THREE.Vector3(1, 0, 0), "left")
        if (hit) placeLogoZone("left_sleeve", w, h, hit, { flipUpsideDown: false, sleeveSide: "left", decalDepth: ZONE.sleeveDecalProjectorDepth }, anchorLocked)
        else {
          const m = fallbackPlane(min.x + sx * 0.22, sleeveY, sleeveZ, w, h, new THREE.Vector3(-1, 0, 0))
          m.userData.placementZoneId = "left_sleeve"
          applyZoneAdjustToMesh(m, getAdj("left_sleeve"))
        }
      }
      if (zoneFlags.right_sleeve) {
        const w = sx * ZONE.sleeveWFrac * ZONE.sleeveDecalSizeScale, h = sy * ZONE.sleeveHFrac * ZONE.sleeveDecalSizeScale
        const { hit, anchorLocked } = resolveHit("right_sleeve", new THREE.Vector3(max.x + pad, sleeveY, sleeveZ), new THREE.Vector3(-1, 0, 0), "right")
        if (hit) placeLogoZone("right_sleeve", w, h, hit, { flipUpsideDown: false, sleeveSide: "right", decalDepth: ZONE.sleeveDecalProjectorDepth }, anchorLocked)
        else {
          const m = fallbackPlane(max.x - sx * 0.22, sleeveY, sleeveZ, w, h, new THREE.Vector3(1, 0, 0))
          m.userData.placementZoneId = "right_sleeve"
          applyZoneAdjustToMesh(m, getAdj("right_sleeve"))
        }
      }
    }

    if (backNumber.enabled) {
      const nh = sy * backNumber.sizeFrac
      const nw = nh * 1.2
      const canvas = document.createElement("canvas")
      const texSize = 1024
      canvas.width = texSize
      canvas.height = texSize
      const canvasCtx = canvas.getContext("2d")!
      const fontPx = Math.round(texSize * 0.42)
      canvasCtx.font = `bold ${fontPx}px ${backNumber.fontFamily}`
      canvasCtx.fillStyle = backNumber.color
      canvasCtx.textAlign = "center"
      canvasCtx.textBaseline = "middle"
      canvasCtx.clearRect(0, 0, texSize, texSize)
      canvasCtx.fillText(backNumber.text.slice(0, 4), texSize / 2, texSize / 2)
      const numTex = new THREE.CanvasTexture(canvas)
      numTex.colorSpace = THREE.SRGBColorSpace
      numTex.needsUpdate = true
      const numMat = new THREE.MeshBasicMaterial({
        map: numTex, transparent: true, depthTest: true, depthWrite: false,
        side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
      })
      const hit = firstMeshHit(new THREE.Vector3(cx, numberY, min.z - pad), new THREE.Vector3(0, 0, 1))
      if (hit) {
        let mesh: THREE.Mesh | null = tryAddConformDecal(numMat, nw, nh, ZONE.decalProjectorDepth, hit, logoGroup, false)
        if (!mesh) mesh = addDecalPlane(numMat, nw, nh, hit, logoGroup, ZONE.decalPlaneFallbackOffset, false)
        if (mesh) {
          mesh.userData.placementKind = "back_number"
          applyZoneAdjustToMesh(mesh, backNumber.adjust)
        }
      } else {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(nw, nh), numMat)
        mesh.position.set(cx, numberY, min.z - epsFallback)
        const nn = new THREE.Vector3(0, 0, 1)
        mesh.quaternion.copy(uprightQuaternionFromNormal(nn, false))
        mesh.userData[UD_PLACEMENT_NORMAL] = nn.clone()
        mesh.renderOrder = 2
        mesh.userData.placementKind = "back_number"
        logoGroup.add(mesh)
        applyZoneAdjustToMesh(mesh, backNumber.adjust)
      }
    }

    if (customText.enabled && customText.text.trim()) {
      const ct = customText
      const z = ct.zone
      let hit: THREE.Intersection | null = null
      let anchorLocked = false
      const tAnchor = draftCustomTextAnchorRef.current ?? customTextAnchor
      if (tAnchor) {
        hit = hitFromAnchor(z, tAnchor)
        if (hit) anchorLocked = true
      }
      if (!hit) {
        if (z === "chest") hit = firstMeshHit(new THREE.Vector3(cx, chestY, max.z + pad), new THREE.Vector3(0, 0, -1))
        else if (z === "back") hit = firstMeshHit(new THREE.Vector3(cx, backY, min.z - pad), new THREE.Vector3(0, 0, 1))
        else if (z === "left_sleeve")
          hit = firstMeshHitSide(new THREE.Vector3(min.x - pad, sleeveY, sleeveZ), new THREE.Vector3(1, 0, 0), "left")
        else hit = firstMeshHitSide(new THREE.Vector3(max.x + pad, sleeveY, sleeveZ), new THREE.Vector3(-1, 0, 0), "right")
      }
      const { canvas, aspect } = buildCustomTextCanvas(ct.text, ct.fontFamily, ct.color)
      const textTex = new THREE.CanvasTexture(canvas)
      textTex.colorSpace = THREE.SRGBColorSpace
      textTex.needsUpdate = true
      const texMat = new THREE.MeshBasicMaterial({
        map: textTex,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
      const nh = sy * ct.sizeFrac
      const nw = nh * aspect
      const sleeveSide = z === "left_sleeve" ? "left" : z === "right_sleeve" ? "right" : undefined
      const dec = z === "left_sleeve" || z === "right_sleeve" ? ZONE.sleeveDecalProjectorDepth : ZONE.decalProjectorDepth
      if (hit) {
        let mesh: THREE.Mesh | null = tryAddConformDecal(texMat, nw, nh, dec, hit, logoGroup, false, sleeveSide)
        if (!mesh) mesh = addDecalPlane(texMat, nw, nh, hit, logoGroup, ZONE.decalPlaneFallbackOffset, false, sleeveSide)
        if (mesh) {
          mesh.userData.placementKind = PLACEMENT_KIND_CUSTOM_TEXT
          mesh.userData.customTextZone = z
          applyZoneAdjustToMesh(mesh, ct.adjust, anchorLocked)
        }
      } else {
        let nn: THREE.Vector3
        let px: number
        let py: number
        let pz: number
        if (z === "chest") {
          nn = new THREE.Vector3(0, 0, -1)
          px = cx
          py = chestY
          pz = max.z + epsFallback
        } else if (z === "back") {
          nn = new THREE.Vector3(0, 0, 1)
          px = cx
          py = backY
          pz = min.z - epsFallback
        } else if (z === "left_sleeve") {
          nn = new THREE.Vector3(-1, 0, 0)
          px = min.x + sx * 0.22
          py = sleeveY
          pz = sleeveZ
        } else {
          nn = new THREE.Vector3(1, 0, 0)
          px = max.x - sx * 0.22
          py = sleeveY
          pz = sleeveZ
        }
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(nw, nh), texMat)
        mesh.position.set(px, py, pz)
        mesh.quaternion.copy(uprightQuaternionFromNormal(nn, false))
        mesh.userData[UD_PLACEMENT_NORMAL] = nn.clone()
        mesh.renderOrder = 2
        mesh.userData.placementKind = PLACEMENT_KIND_CUSTOM_TEXT
        mesh.userData.customTextZone = z
        logoGroup.add(mesh)
        applyZoneAdjustToMesh(mesh, ct.adjust, false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelReady, textureReady, zonesKey, editorPlacementKey])

  // ─── Effect 6: Pointer drag for logos (mount-only, reads refs). ───
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) return

    const { controls, dom, raycaster, shirtGroup, logoGroup, camera } = ctx
    let draggingZone: PlacementZoneId | null = null
    let draggingCustomText = false
    let dragCustomTextZone: PlacementZoneId | null = null
    let dragRaf = 0

    const ndcFromEvent = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect()
      return new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    }

    const pickJerseyHitForDrag = (rawHits: THREE.Intersection[], zone: PlacementZoneId): THREE.Intersection | null => {
      if (rawHits.length === 0) return null
      if (zone === "left_sleeve") {
        const outward = rawHits.filter((h) => worldNormalFromHit(h).x < -0.22)
        const pool = outward.length > 0 ? outward : rawHits
        return pool.reduce((a, b) => (a.point.x < b.point.x ? a : b))
      }
      if (zone === "right_sleeve") {
        const outward = rawHits.filter((h) => worldNormalFromHit(h).x > 0.22)
        const pool = outward.length > 0 ? outward : rawHits
        return pool.reduce((a, b) => (a.point.x > b.point.x ? a : b))
      }
      return rawHits[0]
    }

    const rebuildDecals = () => {
      setTextureReady((v) => v + 1)
    }

    const onPointerDown = (e: PointerEvent) => {
      const jerseyRoot = jerseyRootRef.current
      if (!e.isPrimary || !jerseyRoot) return
      raycaster.setFromCamera(ndcFromEvent(e), camera)
      const hits = raycaster.intersectObjects([logoGroup], true).filter((h): h is THREE.Intersection & { object: THREE.Mesh } => h.object instanceof THREE.Mesh)
      if (hits.length === 0) return
      hits.sort((a, b) => a.distance - b.distance)
      const top = hits[0].object
      if (top.userData.placementKind === PLACEMENT_KIND_CUSTOM_TEXT) {
        const z = top.userData.customTextZone as PlacementZoneId | undefined
        if (z == null || !PLACEMENT_ZONE_IDS.includes(z)) return
        draggingCustomText = true
        dragCustomTextZone = z
        controls.enabled = false
        dom.style.cursor = "grabbing"
        try { dom.setPointerCapture(e.pointerId) } catch { /* ignore */ }
        e.preventDefault()
        return
      }
      if (!sponsorMaterialRef.current) return
      const zoneId = top.userData.placementZoneId as PlacementZoneId | undefined
      if (zoneId == null || !PLACEMENT_ZONE_IDS.includes(zoneId)) return
      draggingZone = zoneId
      controls.enabled = false
      dom.style.cursor = "grabbing"
      try { dom.setPointerCapture(e.pointerId) } catch { /* ignore */ }
      e.preventDefault()
    }

    const onPointerMove = (e: PointerEvent) => {
      const jerseyRoot = jerseyRootRef.current
      if (draggingCustomText && jerseyRoot && dragCustomTextZone) {
        dom.style.cursor = "grabbing"
        raycaster.setFromCamera(ndcFromEvent(e), camera)
        const rawHits = raycaster.intersectObjects([jerseyRoot], true).filter((h) => h.object instanceof THREE.Mesh)
        const hit = pickJerseyHitForDrag(rawHits, dragCustomTextZone)
        if (!hit) return
        shirtGroup.updateMatrixWorld(true)
        const pLocal = shirtGroup.worldToLocal(hit.point.clone())
        const nWorld = worldNormalFromHit(hit)
        const inv = new THREE.Matrix4().copy(shirtGroup.matrixWorld).invert()
        const nLocal = nWorld.clone().transformDirection(inv).normalize()
        draftCustomTextAnchorRef.current = { px: pLocal.x, py: pLocal.y, pz: pLocal.z, nx: nLocal.x, ny: nLocal.y, nz: nLocal.z }
        if (dragRaf) cancelAnimationFrame(dragRaf)
        dragRaf = requestAnimationFrame(rebuildDecals)
        return
      }
      if (!draggingZone || !jerseyRoot) {
        if (!draggingZone && !draggingCustomText) {
          raycaster.setFromCamera(ndcFromEvent(e), camera)
          const over = raycaster.intersectObjects([logoGroup], true).some(
            (h) =>
              h.object instanceof THREE.Mesh &&
              (h.object.userData.placementZoneId != null || h.object.userData.placementKind === PLACEMENT_KIND_CUSTOM_TEXT)
          )
          dom.style.cursor = over ? "grab" : "grab"
        }
        return
      }
      dom.style.cursor = "grabbing"
      raycaster.setFromCamera(ndcFromEvent(e), camera)
      const rawHits = raycaster.intersectObjects([jerseyRoot], true).filter((h) => h.object instanceof THREE.Mesh)
      const hit = pickJerseyHitForDrag(rawHits, draggingZone)
      if (!hit) return
      shirtGroup.updateMatrixWorld(true)
      const pLocal = shirtGroup.worldToLocal(hit.point.clone())
      const nWorld = worldNormalFromHit(hit)
      const inv = new THREE.Matrix4().copy(shirtGroup.matrixWorld).invert()
      const nLocal = nWorld.clone().transformDirection(inv).normalize()
      draftZoneAnchorsRef.current[draggingZone] = { px: pLocal.x, py: pLocal.y, pz: pLocal.z, nx: nLocal.x, ny: nLocal.y, nz: nLocal.z }
      if (dragRaf) cancelAnimationFrame(dragRaf)
      dragRaf = requestAnimationFrame(rebuildDecals)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (draggingCustomText) {
        draggingCustomText = false
        dragCustomTextZone = null
        controls.enabled = true
        dom.style.cursor = "grab"
        try { dom.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
        const snap = draftCustomTextAnchorRef.current
        draftCustomTextAnchorRef.current = null
        if (dragRaf) { cancelAnimationFrame(dragRaf); dragRaf = 0 }
        if (snap) onCustomTextAnchorChangeRef.current?.(snap)
        return
      }
      if (draggingZone == null) return
      const zone = draggingZone
      draggingZone = null
      controls.enabled = true
      dom.style.cursor = "grab"
      try { dom.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
      const snap = draftZoneAnchorsRef.current[zone]
      draftZoneAnchorsRef.current = {}
      if (dragRaf) { cancelAnimationFrame(dragRaf); dragRaf = 0 }
      if (snap) onZoneAnchorChangeRef.current?.(zone, snap)
    }

    dom.addEventListener("pointerdown", onPointerDown)
    dom.addEventListener("pointermove", onPointerMove)
    dom.addEventListener("pointerup", onPointerUp)
    dom.addEventListener("pointercancel", onPointerUp)

    return () => {
      dom.removeEventListener("pointerdown", onPointerDown)
      dom.removeEventListener("pointermove", onPointerMove)
      dom.removeEventListener("pointerup", onPointerUp)
      dom.removeEventListener("pointercancel", onPointerUp)
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      captureFourViews: async () => {
        const ctx = ctxRef.current
        if (!ctx || !jerseyRootRef.current) return []
        const { scene, camera, renderer, controls, shirtGroup, dom } = ctx
        const el = mountRef.current
        const exportW = Math.min(2048, Math.max(768, Math.round((el?.clientWidth ?? 640) * 2)))
        const exportH = Math.min(2048, Math.max(768, Math.round((el?.clientHeight ?? 640) * 2)))
        const prevSize = new THREE.Vector2()
        renderer.getSize(prevSize)
        const prevAspect = camera.aspect
        const prevCamPos = camera.position.clone()
        const prevTarget = controls.target.clone()
        const prevRotY = shirtGroup.rotation.y

        shirtGroup.rotation.y = 0
        shirtGroup.updateMatrixWorld(true)
        const box = new THREE.Box3().setFromObject(shirtGroup)
        if (box.isEmpty()) {
          shirtGroup.rotation.y = prevRotY
          return []
        }
        const target = box.getCenter(new THREE.Vector3())
        controls.target.copy(target)
        let dist = orbitBaseDistanceRef.current * cameraDistanceMulRef.current
        if (!Number.isFinite(dist) || dist < 0.5) {
          dist = Math.max(2, camera.position.distanceTo(target))
        }

        renderer.setSize(exportW, exportH, false)
        camera.aspect = exportW / exportH
        camera.updateProjectionMatrix()
        renderer.setClearColor(0xf4f4f5, 1)

        const views: { name: string; label: string; dir: THREE.Vector3 }[] = [
          { name: "front", label: "Front", dir: new THREE.Vector3(0, 0, 1) },
          { name: "back", label: "Back", dir: new THREE.Vector3(0, 0, -1) },
          { name: "left", label: "Left", dir: new THREE.Vector3(-1, 0, 0) },
          { name: "right", label: "Right", dir: new THREE.Vector3(1, 0, 0) },
        ]
        const heightBias = 0.12
        const out: { name: string; label: string; dataUrl: string }[] = []
        for (const { name, label, dir } of views) {
          const offset = dir.clone().normalize().multiplyScalar(dist)
          camera.position.copy(target).add(offset)
          camera.position.y += heightBias
          camera.lookAt(target)
          controls.update()
          renderer.render(scene, camera)
          out.push({ name, label, dataUrl: dom.toDataURL("image/png") })
        }

        camera.position.copy(prevCamPos)
        controls.target.copy(prevTarget)
        shirtGroup.rotation.y = prevRotY
        renderer.setClearColor(0x000000, 0)
        renderer.setSize(prevSize.x, prevSize.y, false)
        camera.aspect = prevAspect
        camera.updateProjectionMatrix()
        controls.update()
        renderer.render(scene, camera)
        return out
      },
    }),
    []
  )

  // ─── Effect 7: Camera zoom (no scene rebuild). ───
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx || orbitBaseDistanceRef.current <= 0) return
    const dir = ctx.camera.position.clone().sub(ctx.controls.target).normalize()
    ctx.camera.position.copy(ctx.controls.target).addScaledVector(dir, orbitBaseDistanceRef.current * cameraDistanceMul)
    ctx.controls.update()
  }, [cameraDistanceMul])

  // ─── Effect 8: Model yaw (no scene rebuild). ───
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.shirtGroup.rotation.set(0, THREE.MathUtils.degToRad(modelYawDeg), 0)
  }, [modelYawDeg])

  return (
    <div className="relative">
      <div
        ref={mountRef}
        className={cn(
          "relative h-[min(420px,55vh)] w-full min-h-[280px] overflow-hidden rounded-2xl bg-gradient-to-b from-muted/30 to-muted/60",
          className
        )}
      />
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] text-muted-foreground/70 select-none">
        Drag to orbit · Scroll to zoom · Drag a logo or custom text to reposition on the fabric
      </p>
    </div>
  )
})

JerseySponsorPreview.displayName = "JerseySponsorPreview"
