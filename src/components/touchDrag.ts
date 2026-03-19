import type { RubyMethod } from '#/types'

type DropCallback = (method: RubyMethod) => void

/** Singleton ghost element for touch drag feedback */
let ghost: HTMLElement | null = null
let activeMethod: RubyMethod | null = null

function getGhost(): HTMLElement {
  if (!ghost) {
    ghost = document.createElement('div')
    ghost.id = 'drag-ghost'
    ghost.className = 'pill'
    document.body.appendChild(ghost)
  }
  return ghost
}

function moveGhost(touch: Touch): void {
  const g = getGhost()
  g.style.left = `${touch.clientX}px`
  g.style.top  = `${touch.clientY}px`
}

function elementAtTouch(touch: Touch): Element | null {
  return document.elementFromPoint(touch.clientX, touch.clientY)
}

function highlightDropZone(touch: Touch): void {
  document.querySelectorAll('.drop-zone').forEach((z) =>
    z.classList.remove('drag-active'),
  )
  const hit = elementAtTouch(touch)
  const zone = hit?.closest('.drop-zone')
  if (zone) zone.classList.add('drag-active')
}

function onTouchMove(e: TouchEvent): void {
  e.preventDefault()
  moveGhost(e.touches[0])
  highlightDropZone(e.touches[0])
}

function onTouchEnd(e: TouchEvent, onDrop: DropCallback): void {
  const g = getGhost()
  g.style.display = 'none'

  document.querySelectorAll('.drop-zone').forEach((z) =>
    z.classList.remove('drag-active'),
  )

  const touch = e.changedTouches[0]
  const hit = elementAtTouch(touch)

  if (
    activeMethod &&
    hit &&
    (hit.closest('.drop-zone') || hit.closest('#chain-block'))
  ) {
    onDrop(activeMethod)
  }

  activeMethod = null
  document.removeEventListener('touchmove',   onTouchMove as EventListener)
  document.removeEventListener('touchend',    (e) => onTouchEnd(e as TouchEvent, onDrop))
  document.removeEventListener('touchcancel', (e) => onTouchEnd(e as TouchEvent, onDrop))
}

/**
 * Attach touch-drag listeners to a palette pill element.
 * Call this once per pill during palette creation.
 */
export function attachTouchDrag(
  el: HTMLElement,
  method: RubyMethod,
  onDrop: DropCallback,
): void {
  el.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (el.classList.contains('used')) return
      e.preventDefault()

      activeMethod = method
      const g = getGhost()
      g.textContent = `.${method}`
      g.style.display = 'block'
      moveGhost(e.touches[0])

      const endHandler = (ev: Event) => onTouchEnd(ev as TouchEvent, onDrop)

      document.addEventListener('touchmove',   onTouchMove as EventListener, { passive: false })
      document.addEventListener('touchend',    endHandler, { once: true })
      document.addEventListener('touchcancel', endHandler, { once: true })
    },
    { passive: false },
  )
}
