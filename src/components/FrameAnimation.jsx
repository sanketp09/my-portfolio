import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function pad3(number) {
  return String(number).padStart(3, '0')
}

function coverDraw(ctx, img, canvasWidth, canvasHeight) {
  const imageWidth = img.naturalWidth || img.width
  const imageHeight = img.naturalHeight || img.height

  if (!imageWidth || !imageHeight) return

  // Overscale by 4% to guarantee we have extra height to crop the bottom edge
  const overScale = 1.04
  const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight) * overScale
  const drawWidth = imageWidth * scale
  const drawHeight = imageHeight * scale
  const x = (canvasWidth - drawWidth) / 2
  let y = (canvasHeight - drawHeight) / 2

  // Shift the image DOWNWARD to push the watermark completely off the bottom edge
  // This pushes the top edge exactly to the top of the canvas, hiding the bottom completely.
  const maxShiftDown = Math.max(0, (drawHeight - canvasHeight) / 2)
  y += maxShiftDown

  ctx.drawImage(img, x, y, drawWidth, drawHeight)
}

function drawBottomCrop(ctx, canvasWidth, canvasHeight) {
  const cropHeight = Math.round(Math.min(canvasHeight * 0.12, 160))
  const y = canvasHeight - cropHeight

  ctx.save()
  const gradient = ctx.createLinearGradient(0, y, 0, canvasHeight)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.8)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, y, canvasWidth, cropHeight)
  ctx.restore()
}

/**
 * Scroll-driven, Apple-style frame sequence animation.
 *
 * Requirements:
 * - Frames live in /public/frames named frame_0001.jpg ... frame_XXXX.jpg
 * - Preload all frames before enabling scroll control
 * - Canvas is fixed fullscreen; behind it a 600vh scroll area drives frames
 * - GSAP ScrollTrigger maps scroll progress -> frame index
 */
export default function FrameAnimation({ totalFrames = 240, onComplete, onReverse, isComplete }) {
  const canvasRef = useRef(null)
  const scrollAreaRef = useRef(null)
  const introTextRef = useRef(null)


  const imagesRef = useRef([])
  const ctxRef = useRef(null)
  const dprRef = useRef(1)

  const rafIdRef = useRef(0)
  const lastDrawnFrameRef = useRef(-1)
  const targetFrameRef = useRef(0)
  const isCompleteRef = useRef(false)

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState('')

  const frameUrl = (frameNumber1Based) => `/frames/ezgif-frame-${pad3(frameNumber1Based)}.jpg`

  const setCanvasSize = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    dprRef.current = dpr

    const cssWidth = window.innerWidth
    const cssHeight = window.innerHeight

    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssHeight}px`

    canvas.width = Math.floor(cssWidth * dpr)
    canvas.height = Math.floor(cssHeight * dpr)

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
  }

  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const images = imagesRef.current

    if (!canvas || !ctx || images.length === 0) return

    const clampedIndex = clamp(frameIndex, 0, images.length - 1)
    const img = images[clampedIndex]
    if (!img) return

    const width = canvas.width / dprRef.current
    const height = canvas.height / dprRef.current

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    coverDraw(ctx, img, width, height)
    drawBottomCrop(ctx, width, height)

    lastDrawnFrameRef.current = clampedIndex
  }

  const requestDraw = () => {
    if (rafIdRef.current) return
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = 0
      drawFrame(targetFrameRef.current)
    })
  }

  useEffect(() => {
    let isCancelled = false

    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const restoreScroll = () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!ctx) return

    ctxRef.current = ctx
    setCanvasSize()

    const onResize = () => {
      setCanvasSize()
      const frameToRedraw = lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0
      drawFrame(frameToRedraw)
    }

    window.addEventListener('resize', onResize)

    const preload = async () => {
      try {
        setLoadError('')
        const images = new Array(totalFrames)
        let decodedCount = 0

        for (let i = 1; i <= totalFrames; i += 1) {
          const img = new Image()
          const src = frameUrl(i)

          // Always wait for the image to load first (reliable progress updates).
          await new Promise((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error(`Failed to load frame: ${src}`))
            img.src = src
          })

          // Then try to fully decode (best effort).
          try {
            if (img.decode) {
              await img.decode()
            }
          } catch {
            // ignore decode errors
          }

          if (isCancelled) return

          images[i - 1] = img
          decodedCount += 1
          setLoadingProgress(Math.round((decodedCount / totalFrames) * 100))
        }

        if (isCancelled) return

        imagesRef.current = images
        setIsLoaded(true)
        restoreScroll()
        // Ensure a first draw before ScrollTrigger runs.
        targetFrameRef.current = 0
        drawFrame(0)
      } catch (err) {
        if (isCancelled) return
        const message = err instanceof Error ? err.message : 'Failed to preload frames.'
        setLoadError(message)
        restoreScroll()
      }
    }

    preload()

    return () => {
      isCancelled = true
      restoreScroll()
      window.removeEventListener('resize', onResize)
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [totalFrames])

  useEffect(() => {
    if (!isLoaded) return

    const canvas = canvasRef.current
    const scrollArea = scrollAreaRef.current
    if (!canvas || !scrollArea) return

    // Initial state: canvas visible.
    gsap.set(canvas, { autoAlpha: 1, scale: 1, zIndex: 5 })

    isCompleteRef.current = false

    const trigger = ScrollTrigger.create({
      trigger: scrollArea,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = clamp(self.progress, 0, 1)
        const frameIndex = Math.round(progress * (totalFrames - 1))

        if (frameIndex !== targetFrameRef.current) {
          targetFrameRef.current = frameIndex
          requestDraw()
        }

        const completedNow = progress > 0.98
        if (completedNow !== isCompleteRef.current) {
          isCompleteRef.current = completedNow
          if (completedNow) {
            if (onComplete) onComplete()
          } else {
            if (onReverse) onReverse()
          }
        }
      },
    })

    let textTrigger;
    if (introTextRef.current) {
      textTrigger = gsap.to(introTextRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: scrollArea,
          start: 'top top',
          end: 'top -900px',
          scrub: true,
        }
      })
    }

    return () => {
      trigger.kill()
      if (textTrigger) textTrigger.kill()
    }
  }, [isLoaded, totalFrames, onComplete, onReverse])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isLoaded) return
    
    if (isComplete) {
      // Cinematic 3D fly-through effect on the canvas as it fades
      gsap.to(canvas, { scale: 2, y: "-20%", opacity: 0, filter: "blur(20px)", duration: 1.8, ease: "power3.inOut", overwrite: true })
    } else {
      // Revert fly-through and explicitly clear the filter to restore crisp rendering
      gsap.to(canvas, { 
        scale: 1, 
        y: "0%",
        opacity: 1, 
        filter: "blur(0px)", 
        duration: 1.8, 
        ease: "power3.inOut", 
        overwrite: true,
        onComplete: () => gsap.set(canvas, { clearProps: "filter" })
      })
    }
  }, [isComplete, isLoaded])

  return (
    <>
      {!isLoaded && (
        <div className="loader" role="status" aria-live="polite" aria-label="Loading frames">
          <div className="loader__inner">
            <div className="loader__label">
              {loadError ? loadError : `Loading… ${loadingProgress}%`}
            </div>
            <div className="loader__bar" aria-hidden="true">
              <div className="loader__barFill" style={{ width: `${loadingProgress}%` }} />
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="frameCanvas" />

      <div ref={introTextRef} className="intro-text">
        <h1>SANKET PATIL<br /><span style={{ fontSize: "0.5em", letterSpacing: "0.1em", fontWeight: 400, opacity: 0.9 }}>SOFTWARE & SYSTEMS ENGINEER</span></h1>
        <p style={{ margin: "8px 0 14px", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.85em", opacity: 0.65 }}>
          Scroll to explore 3D world
        </p>
        <button
          type="button"
          onClick={() => {
            if (onComplete) onComplete();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            borderRadius: 999,
            border: "1px solid rgba(0, 229, 255, 0.45)",
            background: "rgba(0, 229, 255, 0.12)",
            backdropFilter: "blur(10px)",
            color: "#00e5ff",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
            pointerEvents: "auto",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 229, 255, 0.25)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 229, 255, 0.12)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Fast Track to Portfolio ▹
        </button>
      </div>

      <div ref={scrollAreaRef} className="scrollArea" aria-hidden="true" />
    </>
  )
}
