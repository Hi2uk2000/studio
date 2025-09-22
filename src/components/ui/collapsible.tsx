"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * A container for collapsible content.
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * A button that toggles the collapsible content.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * The content that is shown or hidden by the collapsible trigger.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
