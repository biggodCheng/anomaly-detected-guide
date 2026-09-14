import '@testing-library/jest-dom/vitest'

// jsdom 无 PointerEvent —— base-ui/floating-ui 的菜单/弹层交互(pointerdown 序列)依赖它
if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    pointerType: string
    constructor(
      type: string,
      params: MouseEventInit & { pointerType?: string; isPrimary?: boolean } = {}
    ) {
      super(type, params)
      this.pointerType = params.pointerType ?? 'mouse'
    }
  }
  window.PointerEvent = PointerEventPolyfill as unknown as typeof window.PointerEvent
}
