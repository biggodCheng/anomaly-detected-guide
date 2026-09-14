import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSearchShortcut } from './use-search-shortcut'

describe('useSearchShortcut', () => {
  it('calls onOpen on Ctrl+K', () => {
    const onOpen = vi.fn()
    renderHook(() => useSearchShortcut(onOpen))
    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' }))
    expect(onOpen).toHaveBeenCalled()
  })

  it('calls onOpen on Cmd+K (metaKey)', () => {
    const onOpen = vi.fn()
    renderHook(() => useSearchShortcut(onOpen))
    window.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }))
    expect(onOpen).toHaveBeenCalled()
  })

  it('ignores plain K without modifier', () => {
    const onOpen = vi.fn()
    renderHook(() => useSearchShortcut(onOpen))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }))
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('ignores Ctrl with a different key', () => {
    const onOpen = vi.fn()
    renderHook(() => useSearchShortcut(onOpen))
    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'j' }))
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('ignores Ctrl+Shift+K (browser/user combo, not search)', () => {
    const onOpen = vi.fn()
    renderHook(() => useSearchShortcut(onOpen))
    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: 'K' }))
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('ignores Ctrl+Alt+K (AltGr on Windows types a character)', () => {
    const onOpen = vi.fn()
    renderHook(() => useSearchShortcut(onOpen))
    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k' }))
    expect(onOpen).not.toHaveBeenCalled()
  })
})
