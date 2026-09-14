"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  sideOffset = 6,
  ...props
}: MenuPrimitive.Positioner.Props) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner sideOffset={sideOffset} className="z-50" {...props} />
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuPopup({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup>) {
  return (
    <MenuPrimitive.Popup
      data-slot="dropdown-menu-popup"
      className={cn(
        "min-w-[8rem] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-1 shadow-lg text-[var(--color-card-foreground)]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuLinkItem({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.LinkItem>) {
  return (
    <MenuPrimitive.LinkItem
      data-slot="dropdown-menu-link-item"
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-[var(--color-muted)] data-[highlighted]:text-[var(--color-foreground)]",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPopup,
  DropdownMenuLinkItem,
}
