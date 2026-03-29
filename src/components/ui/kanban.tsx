import {
  type Announcements,
  type CollisionDetection,
  closestCenter,
  closestCorners,
  DndContext,
  type DndContextProps,
  type DragCancelEvent,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  type DroppableContainer,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  KeyboardCode,
  type KeyboardCoordinateGetter,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  type AnimateLayoutChanges,
  arrayMove,
  defaultAnimateLayoutChanges,
  horizontalListSortingStrategy,
  SortableContext,
  type SortableContextProps,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import * as ReactDOM from "react-dom"

import { useComposedRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"

const directions: string[] = [
  KeyboardCode.Down,
  KeyboardCode.Right,
  KeyboardCode.Up,
  KeyboardCode.Left,
]

const coordinateGetter: KeyboardCoordinateGetter = (event, { context }) => {
  const { active, droppableRects, droppableContainers, collisionRect } = context

  if (directions.includes(event.code)) {
    event.preventDefault()

    if (!active || !collisionRect) return

    const filteredContainers: DroppableContainer[] = []

    for (const entry of droppableContainers.getEnabled()) {
      if (!entry || entry?.disabled) return

      const rect = droppableRects.get(entry.id)
      if (!rect) return

      const data = entry.data.current
      if (data) {
        const { type, children } = data
        if (type === "container" && children?.length > 0) {
          if (active.data.current?.type !== "container") {
            return
          }
        }
      }

      switch (event.code) {
        case KeyboardCode.Down:
          if (collisionRect.top < rect.top) filteredContainers.push(entry)
          break
        case KeyboardCode.Up:
          if (collisionRect.top > rect.top) filteredContainers.push(entry)
          break
        case KeyboardCode.Left:
          if (collisionRect.left >= rect.left + rect.width) filteredContainers.push(entry)
          break
        case KeyboardCode.Right:
          if (collisionRect.left + collisionRect.width <= rect.left) filteredContainers.push(entry)
          break
      }
    }

    const collisions = closestCorners({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: filteredContainers,
      pointerCoordinates: null,
    })
    const closestId = getFirstCollision(collisions, "id")

    if (closestId != null) {
      const newDroppable = droppableContainers.get(closestId)
      const newNode = newDroppable?.node.current
      const newRect = newDroppable?.rect.current

      if (newNode && newRect) {
        if (newDroppable.id === "placeholder") {
          return {
            x: newRect.left + (newRect.width - collisionRect.width) / 2,
            y: newRect.top + (newRect.height - collisionRect.height) / 2,
          }
        }

        if (newDroppable.data.current?.type === "container") {
          return { x: newRect.left + 20, y: newRect.top + 74 }
        }

        return { x: newRect.left, y: newRect.top }
      }
    }
  }

  return undefined
}

interface KanbanContextValue<T> {
  id: string
  items: Record<UniqueIdentifier, T[]>
  modifiers: DndContextProps["modifiers"]
  strategy: SortableContextProps["strategy"]
  orientation: "horizontal" | "vertical"
  activeId: UniqueIdentifier | null
  setActiveId: (id: UniqueIdentifier | null) => void
  getItemValue: (item: T) => UniqueIdentifier
  flatCursor: boolean
}

const KanbanContext = React.createContext<KanbanContextValue<unknown> | null>(null)

function useKanbanContext(consumerName: string) {
  const context = React.useContext(KanbanContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`Kanban\``)
  }
  return context
}

interface GetItemValue<T> {
  getItemValue: (item: T) => UniqueIdentifier
}

type KanbanProps<T> = Omit<DndContextProps, "collisionDetection"> &
  (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>) & {
    value: Record<UniqueIdentifier, T[]>
    onValueChange?: (columns: Record<UniqueIdentifier, T[]>) => void
    onMove?: (event: DragEndEvent & { activeIndex: number; overIndex: number }) => void
    strategy?: SortableContextProps["strategy"]
    orientation?: "horizontal" | "vertical"
    flatCursor?: boolean
  }

function Kanban<T>(props: KanbanProps<T>) {
  const {
    value,
    onValueChange,
    modifiers,
    strategy = verticalListSortingStrategy,
    orientation = "horizontal",
    onMove,
    getItemValue: getItemValueProp,
    accessibility,
    flatCursor = false,
    ...kanbanProps
  } = props

  const id = React.useId()
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const lastOverIdRef = React.useRef<UniqueIdentifier | null>(null)
  const hasMovedRef = React.useRef(false)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter }),
  )

  const getItemValue = React.useCallback(
    (item: T): UniqueIdentifier => {
      if (typeof item === "object" && !getItemValueProp) {
        throw new Error("`getItemValue` is required when using array of objects")
      }
      return getItemValueProp ? getItemValueProp(item) : (item as UniqueIdentifier)
    },
    [getItemValueProp],
  )

  const getColumn = React.useCallback(
    (id: UniqueIdentifier) => {
      if (id in value) return id
      for (const [columnId, items] of Object.entries(value)) {
        if (items.some((item) => getItemValue(item) === id)) {
          return columnId
        }
      }
      return null
    },
    [value, getItemValue],
  )

  const collisionDetection: CollisionDetection = React.useCallback(
    (args) => {
      if (activeId && activeId in value) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in value,
          ),
        })
      }

      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args)
      let overId = getFirstCollision(intersections, "id")

      if (!overId) {
        if (hasMovedRef.current) {
          lastOverIdRef.current = activeId
        }
        return lastOverIdRef.current ? [{ id: lastOverIdRef.current }] : []
      }

      if (overId in value) {
        const containerItems = value[overId]
        if (containerItems && containerItems.length > 0) {
          const closestItem = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                containerItems.some((item) => getItemValue(item) === container.id),
            ),
          })
          if (closestItem.length > 0) {
            overId = closestItem[0]?.id ?? overId
          }
        }
      }

      lastOverIdRef.current = overId
      return [{ id: overId }]
    },
    [activeId, value, getItemValue],
  )

  const onDragStart = React.useCallback(
    (event: DragStartEvent) => {
      kanbanProps.onDragStart?.(event)
      if (event.activatorEvent.defaultPrevented) return
      setActiveId(event.active.id)
    },
    [kanbanProps.onDragStart],
  )

  const onDragOver = React.useCallback(
    (event: DragOverEvent) => {
      kanbanProps.onDragOver?.(event)
      if (event.activatorEvent.defaultPrevented) return

      const { active, over } = event
      if (!over) return

      const activeColumn = getColumn(active.id)
      const overColumn = getColumn(over.id)
      if (!activeColumn || !overColumn) return

      if (activeColumn === overColumn) {
        const items = value[activeColumn]
        if (!items) return

        const activeIndex = items.findIndex((item) => getItemValue(item) === active.id)
        const overIndex = items.findIndex((item) => getItemValue(item) === over.id)

        if (activeIndex !== overIndex) {
          const newColumns = { ...value }
          newColumns[activeColumn] = arrayMove(items, activeIndex, overIndex)
          onValueChange?.(newColumns)
        }
      } else {
        const activeItems = value[activeColumn]
        const overItems = value[overColumn]
        if (!activeItems || !overItems) return

        const activeIndex = activeItems.findIndex((item) => getItemValue(item) === active.id)
        if (activeIndex === -1) return

        const activeItem = activeItems[activeIndex]
        if (!activeItem) return

        const updatedItems = {
          ...value,
          [activeColumn]: activeItems.filter((item) => getItemValue(item) !== active.id),
          [overColumn]: [...overItems, activeItem],
        }

        onValueChange?.(updatedItems)
        hasMovedRef.current = true
      }
    },
    [value, getColumn, getItemValue, onValueChange, kanbanProps.onDragOver],
  )

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      kanbanProps.onDragEnd?.(event)
      if (event.activatorEvent.defaultPrevented) return

      const { active, over } = event

      if (!over) {
        setActiveId(null)
        return
      }

      if (active.id in value && over.id in value) {
        const activeIndex = Object.keys(value).indexOf(active.id as string)
        const overIndex = Object.keys(value).indexOf(over.id as string)

        if (activeIndex !== overIndex) {
          const orderedColumns = Object.keys(value)
          const newOrder = arrayMove(orderedColumns, activeIndex, overIndex)
          const newColumns: Record<UniqueIdentifier, T[]> = {}
          for (const key of newOrder) {
            const items = value[key]
            if (items) newColumns[key] = items
          }

          if (onMove) {
            onMove({ ...event, activeIndex, overIndex })
          } else {
            onValueChange?.(newColumns)
          }
        }
      } else {
        const activeColumn = getColumn(active.id)
        const overColumn = getColumn(over.id)

        if (!activeColumn || !overColumn) {
          setActiveId(null)
          return
        }

        if (activeColumn === overColumn) {
          const items = value[activeColumn]
          if (!items) {
            setActiveId(null)
            return
          }

          const activeIndex = items.findIndex((item) => getItemValue(item) === active.id)
          const overIndex = items.findIndex((item) => getItemValue(item) === over.id)

          if (activeIndex !== overIndex) {
            const newColumns = { ...value }
            newColumns[activeColumn] = arrayMove(items, activeIndex, overIndex)
            if (onMove) {
              onMove({ ...event, activeIndex, overIndex })
            } else {
              onValueChange?.(newColumns)
            }
          }
        }
      }

      setActiveId(null)
      hasMovedRef.current = false
    },
    [value, getColumn, getItemValue, onValueChange, onMove, kanbanProps.onDragEnd],
  )

  const onDragCancel = React.useCallback(
    (event: DragCancelEvent) => {
      kanbanProps.onDragCancel?.(event)
      if (event.activatorEvent.defaultPrevented) return
      setActiveId(null)
      hasMovedRef.current = false
    },
    [kanbanProps.onDragCancel],
  )

  const announcements: Announcements = React.useMemo(
    () => ({
      onDragStart({ active }) {
        const isColumn = active.id in value
        const itemType = isColumn ? "column" : "item"
        const position = isColumn
          ? Object.keys(value).indexOf(active.id as string) + 1
          : (() => {
              const column = getColumn(active.id)
              if (!column || !value[column]) return 1
              return value[column].findIndex((item) => getItemValue(item) === active.id) + 1
            })()
        const total = isColumn
          ? Object.keys(value).length
          : (() => {
              const column = getColumn(active.id)
              return column ? (value[column]?.length ?? 0) : 0
            })()
        return `Picked up ${itemType} at position ${position} of ${total}`
      },
      onDragOver({ active, over }) {
        if (!over) return
        const isColumn = active.id in value
        const itemType = isColumn ? "column" : "item"
        const overColumn = getColumn(over.id)
        const activeColumn = getColumn(active.id)
        const position = isColumn
          ? Object.keys(value).indexOf(over.id as string) + 1
          : (() => {
              if (!overColumn || !value[overColumn]) return 1
              return value[overColumn].findIndex((item) => getItemValue(item) === over.id) + 1
            })()
        const total = isColumn
          ? Object.keys(value).length
          : (() => {
              return overColumn ? (value[overColumn]?.length ?? 0) : 0
            })()

        if (isColumn) return `${itemType} is now at position ${position} of ${total}`
        if (activeColumn !== overColumn)
          return `${itemType} is now at position ${position} of ${total} in ${overColumn}`
        return `${itemType} is now at position ${position} of ${total}`
      },
      onDragEnd({ active, over }) {
        if (!over) return
        const isColumn = active.id in value
        const itemType = isColumn ? "column" : "item"
        const overColumn = getColumn(over.id)
        const activeColumn = getColumn(active.id)
        const position = isColumn
          ? Object.keys(value).indexOf(over.id as string) + 1
          : (() => {
              if (!overColumn || !value[overColumn]) return 1
              return value[overColumn].findIndex((item) => getItemValue(item) === over.id) + 1
            })()
        const total = isColumn
          ? Object.keys(value).length
          : (() => {
              return overColumn ? (value[overColumn]?.length ?? 0) : 0
            })()

        if (isColumn) return `${itemType} was dropped at position ${position} of ${total}`
        if (activeColumn !== overColumn)
          return `${itemType} was dropped at position ${position} of ${total} in ${overColumn}`
        return `${itemType} was dropped at position ${position} of ${total}`
      },
      onDragCancel({ active }) {
        const isColumn = active.id in value
        return `Dragging was cancelled. ${isColumn ? "column" : "item"} was dropped.`
      },
    }),
    [value, getColumn, getItemValue],
  )

  const contextValue = React.useMemo<KanbanContextValue<T>>(
    () => ({
      id,
      items: value,
      modifiers,
      strategy,
      orientation,
      activeId,
      setActiveId,
      getItemValue,
      flatCursor,
    }),
    [id, value, activeId, modifiers, strategy, orientation, getItemValue, flatCursor],
  )

  return (
    <KanbanContext.Provider value={contextValue as KanbanContextValue<unknown>}>
      <DndContext
        collisionDetection={collisionDetection}
        modifiers={modifiers}
        sensors={sensors}
        {...kanbanProps}
        id={id}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable: `To pick up a kanban item or column, press space or enter. While dragging, use the arrow keys to move the item. Press space or enter again to drop the item in its new position, or press escape to cancel.`,
          },
          ...accessibility,
        }}
      />
    </KanbanContext.Provider>
  )
}

const KanbanBoardContext = React.createContext<boolean>(false)

interface KanbanBoardProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
  asChild?: boolean
}

function KanbanBoard(props: KanbanBoardProps) {
  const { asChild, className, ref, ...boardProps } = props
  const context = useKanbanContext("KanbanBoard")

  const columns = React.useMemo(() => Object.keys(context.items), [context.items])

  const BoardPrimitive = asChild ? Slot : "div"

  return (
    <KanbanBoardContext.Provider value={true}>
      <SortableContext
        items={columns}
        strategy={
          context.orientation === "horizontal"
            ? horizontalListSortingStrategy
            : verticalListSortingStrategy
        }
      >
        <BoardPrimitive
          aria-orientation={context.orientation}
          data-orientation={context.orientation}
          data-slot="kanban-board"
          {...boardProps}
          ref={ref}
          className={cn(
            "flex size-full gap-4",
            context.orientation === "horizontal" ? "flex-row" : "flex-col",
            className,
          )}
        />
      </SortableContext>
    </KanbanBoardContext.Provider>
  )
}

interface KanbanColumnContextValue {
  id: string
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners | undefined
  setActivatorNodeRef: (node: HTMLElement | null) => void
  isDragging?: boolean
  disabled?: boolean
}

const KanbanColumnContext = React.createContext<KanbanColumnContextValue | null>(null)

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true })

interface KanbanColumnProps extends React.ComponentProps<"div"> {
  value: UniqueIdentifier
  children: React.ReactNode
  asChild?: boolean
  asHandle?: boolean
  disabled?: boolean
}

function KanbanColumn(props: KanbanColumnProps) {
  const { value, asChild, asHandle, disabled, className, style, ref, ...columnProps } = props

  const id = React.useId()
  const context = useKanbanContext("KanbanColumn")
  const inBoard = React.useContext(KanbanBoardContext)
  const inOverlay = React.useContext(KanbanOverlayContext)

  if (!inBoard && !inOverlay) {
    throw new Error("`KanbanColumn` must be used within `KanbanBoard` or `KanbanOverlay`")
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value, disabled, animateLayoutChanges })

  const composedRef = useComposedRefs(ref, (node: HTMLElement | null) => {
    if (disabled) return
    setNodeRef(node)
  })

  const composedStyle = React.useMemo<React.CSSProperties>(
    () => ({ transform: CSS.Transform.toString(transform), transition, ...style }),
    [transform, transition, style],
  )

  const items = React.useMemo(() => {
    const items = context.items[value] ?? []
    return items.map((item) => context.getItemValue(item))
  }, [context.items, value, context.getItemValue])

  const columnContext = React.useMemo<KanbanColumnContextValue>(
    () => ({ id, attributes, listeners, setActivatorNodeRef, isDragging, disabled }),
    [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled],
  )

  const ColumnPrimitive = asChild ? Slot : "div"

  return (
    <KanbanColumnContext.Provider value={columnContext}>
      <SortableContext
        items={items}
        strategy={
          context.orientation === "horizontal"
            ? horizontalListSortingStrategy
            : verticalListSortingStrategy
        }
      >
        <ColumnPrimitive
          id={id}
          data-disabled={disabled}
          data-dragging={isDragging ? "" : undefined}
          data-slot="kanban-column"
          {...columnProps}
          {...(asHandle && !disabled ? attributes : {})}
          {...(asHandle && !disabled ? listeners : {})}
          ref={composedRef}
          style={composedStyle}
          className={cn(
            "flex size-full flex-col gap-2 rounded-lg border p-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50",
            {
              "touch-none select-none": asHandle,
              "cursor-default": context.flatCursor,
              "data-dragging:cursor-grabbing": !context.flatCursor,
              "cursor-grab": !isDragging && asHandle && !context.flatCursor,
              "opacity-50": isDragging,
              "pointer-events-none opacity-50": disabled,
            },
            className,
          )}
        />
      </SortableContext>
    </KanbanColumnContext.Provider>
  )
}

interface KanbanItemProps extends React.ComponentProps<"div"> {
  value: UniqueIdentifier
  asHandle?: boolean
  asChild?: boolean
  disabled?: boolean
}

function KanbanItem(props: KanbanItemProps) {
  const { value, style, asHandle, asChild, disabled, className, ref, ...itemProps } = props

  const id = React.useId()
  const context = useKanbanContext("KanbanItem")

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value, disabled })

  const composedRef = useComposedRefs(ref, (node: HTMLElement | null) => {
    if (disabled) return
    setNodeRef(node)
  })

  const composedStyle = React.useMemo<React.CSSProperties>(
    () => ({ transform: CSS.Transform.toString(transform), transition, ...style }),
    [transform, transition, style],
  )

  const itemContext = React.useMemo<KanbanItemContextValue>(
    () => ({ id, attributes, listeners, setActivatorNodeRef, isDragging, disabled }),
    [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled],
  )

  const ItemPrimitive = asChild ? Slot : "div"

  return (
    <KanbanItemContext.Provider value={itemContext}>
      <ItemPrimitive
        id={id}
        data-disabled={disabled}
        data-dragging={isDragging ? "" : undefined}
        data-slot="kanban-item"
        {...itemProps}
        {...(asHandle && !disabled ? attributes : {})}
        {...(asHandle && !disabled ? listeners : {})}
        ref={composedRef}
        style={composedStyle}
        className={cn(
          "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
          {
            "touch-none select-none": asHandle,
            "cursor-default": context.flatCursor,
            "data-dragging:cursor-grabbing": !context.flatCursor,
            "cursor-grab": !isDragging && asHandle && !context.flatCursor,
            "opacity-50": isDragging,
            "pointer-events-none opacity-50": disabled,
          },
          className,
        )}
      />
    </KanbanItemContext.Provider>
  )
}

interface KanbanItemContextValue {
  id: string
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners | undefined
  setActivatorNodeRef: (node: HTMLElement | null) => void
  isDragging?: boolean
  disabled?: boolean
}

const KanbanItemContext = React.createContext<KanbanItemContextValue | null>(null)

function useKanbanItemContext(consumerName: string) {
  const context = React.useContext(KanbanItemContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`KanbanItem\``)
  }
  return context
}

interface KanbanItemHandleProps extends React.ComponentProps<"button"> {
  asChild?: boolean
}

function KanbanItemHandle(props: KanbanItemHandleProps) {
  const { asChild, disabled, className, ref, ...itemHandleProps } = props

  const context = useKanbanContext("KanbanItemHandle")
  const itemContext = useKanbanItemContext("KanbanItemHandle")

  const isDisabled = disabled ?? itemContext.disabled

  const composedRef = useComposedRefs(ref, (node: HTMLElement | null) => {
    if (isDisabled) return
    itemContext.setActivatorNodeRef(node)
  })

  const HandlePrimitive = asChild ? Slot : "button"

  return (
    <HandlePrimitive
      type="button"
      aria-controls={itemContext.id}
      data-disabled={isDisabled}
      data-dragging={itemContext.isDragging ? "" : undefined}
      data-slot="kanban-item-handle"
      {...itemHandleProps}
      {...(isDisabled ? {} : itemContext.attributes)}
      {...(isDisabled ? {} : itemContext.listeners)}
      ref={composedRef}
      className={cn(
        "select-none disabled:pointer-events-none disabled:opacity-50",
        context.flatCursor
          ? "cursor-default"
          : "cursor-grab data-dragging:cursor-grabbing",
        className,
      )}
      disabled={isDisabled}
    />
  )
}

const KanbanOverlayContext = React.createContext(false)

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.4" } },
  }),
}

interface KanbanOverlayProps
  extends Omit<React.ComponentProps<typeof DragOverlay>, "children"> {
  container?: Element | DocumentFragment | null
  children?:
    | React.ReactNode
    | ((params: { value: UniqueIdentifier; variant: "column" | "item" }) => React.ReactNode)
}

function KanbanOverlay(props: KanbanOverlayProps) {
  const { container: containerProp, children, ...overlayProps } = props
  const context = useKanbanContext("KanbanOverlay")

  const [mounted, setMounted] = React.useState(false)
  React.useLayoutEffect(() => setMounted(true), [])

  const container = containerProp ?? (mounted ? globalThis.document?.body : null)
  if (!container) return null

  const variant = context.activeId && context.activeId in context.items ? "column" : "item"

  return ReactDOM.createPortal(
    <DragOverlay
      dropAnimation={dropAnimation}
      modifiers={context.modifiers}
      className={cn(!context.flatCursor && "cursor-grabbing")}
      {...overlayProps}
    >
      <KanbanOverlayContext.Provider value={true}>
        {context.activeId && children
          ? typeof children === "function"
            ? children({ value: context.activeId, variant })
            : children
          : null}
      </KanbanOverlayContext.Provider>
    </DragOverlay>,
    container,
  )
}

export {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
  type KanbanProps,
}
