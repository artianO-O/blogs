# Vue3虚拟DOM系统详解

## 🎯 虚拟DOM概述

Vue3的虚拟DOM系统是框架的核心渲染机制，它通过JavaScript对象来描述真实的DOM结构，实现了高效的DOM更新和跨平台渲染。

### 系统架构图

```
┌─────────────────────────────────────┐
│        虚拟DOM层 (VNode Layer)      │
│  createVNode() | h() | render()    │
├─────────────────────────────────────┤
│        渲染器层 (Renderer Layer)    │
│  patch() | mount() | unmount()     │
├─────────────────────────────────────┤
│        平台层 (Platform Layer)      │
│  DOM操作 | Canvas | 小程序等        │
└─────────────────────────────────────┘
```

## 🏗️ VNode设计

### 1. VNode接口定义

```typescript
export interface VNode<
  HostNode = RendererNode,
  HostElement = RendererElement,
  ExtraProps = { [key: string]: any },
> {
  __v_isVNode: true
  [ReactiveFlags.SKIP]: true

  // 基础属性
  type: VNodeTypes
  props: (VNodeProps & ExtraProps) | null
  key: PropertyKey | null
  ref: VNodeNormalizedRef | null

  // 子节点
  children: VNodeNormalizedChildren

  // 组件相关
  component: ComponentInternalInstance | null
  dirs: DirectiveBinding[] | null
  transition: TransitionHooks<HostElement> | null

  // DOM相关
  el: HostNode | null
  anchor: HostNode | null
  target: HostElement | null

  // 优化相关
  shapeFlag: number
  patchFlag: number
  dynamicProps: string[] | null
  dynamicChildren: (VNode[] & { hasOnce?: boolean }) | null

  // 应用相关
  appContext: AppContext | null
  ctx: ComponentInternalInstance | null
}
```

### 2. VNode类型系统

```typescript
export type VNodeTypes =
  | string // 元素类型
  | VNode // 虚拟节点
  | Component // 组件
  | typeof Text // 文本节点
  | typeof Static // 静态节点
  | typeof Comment // 注释节点
  | typeof Fragment // 片段
  | typeof Teleport // 传送门
  | typeof TeleportImpl // 传送门实现
  | typeof Suspense // 异步组件
  | typeof SuspenseImpl // 异步组件实现

// 特殊节点类型
export const Fragment = Symbol.for('v-fgt') as any as {
  __isFragment: true
  new (): { $props: VNodeProps }
}
export const Text: unique symbol = Symbol.for('v-txt')
export const Comment: unique symbol = Symbol.for('v-cmt')
export const Static: unique symbol = Symbol.for('v-stc')
```

### 3. VNode创建函数

```typescript
// 创建VNode的核心函数
export function createVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false,
): VNode {
  // 处理类型
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true)
    if (children) {
      normalizeChildren(cloned, children)
    }
    return cloned
  }

  // 处理类组件
  if (isClassComponent(type)) {
    type = type.__vccOpts
  }

  // 规范化props
  if (props) {
    props = guardReactiveProps(props)!
  }

  // 创建VNode
  const vnode: VNode = {
    __v_isVNode: true,
    [ReactiveFlags.SKIP]: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children: null,
    component: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    shapeFlag: type === Fragment ? 0 : ShapeFlags.ELEMENT,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance,
  }

  // 规范化子节点
  if (children != null) {
    normalizeChildren(vnode, children)
  }

  // 处理块级节点
  if (isBlockNode) {
    setupBlock(vnode)
  }

  return vnode
}
```

## 🎛️ 形状标志 (ShapeFlags)

### 1. 形状标志定义

```typescript
export enum ShapeFlags {
  ELEMENT = 1, // 元素节点
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 有状态组件
  TEXT_CHILDREN = 1 << 3, // 文本子节点
  ARRAY_CHILDREN = 1 << 4, // 数组子节点
  SLOTS_CHILDREN = 1 << 5, // 插槽子节点
  TELEPORT = 1 << 6, // 传送门
  SUSPENSE = 1 << 7, // 异步组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 应该保持活跃的组件
  COMPONENT_KEPT_ALIVE = 1 << 9, // 保持活跃的组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
```

### 2. 形状标志使用

```typescript
// 设置形状标志
function setShapeFlag(vnode: VNode, flag: ShapeFlags) {
  vnode.shapeFlag |= flag
}

// 检查形状标志
function hasShapeFlag(vnode: VNode, flag: ShapeFlags): boolean {
  return (vnode.shapeFlag & flag) > 0
}

// 示例：创建元素节点
const vnode = createVNode('div', { class: 'container' }, 'Hello Vue3')
setShapeFlag(vnode, ShapeFlags.ELEMENT | ShapeFlags.TEXT_CHILDREN)
// vnode.shapeFlag = 9 (1 + 8)
```

## 🎯 补丁标志 (PatchFlags)

### 1. 补丁标志定义

```typescript
export const enum PatchFlags {
  TEXT = 1, // 动态文本内容
  CLASS = 1 << 1, // 动态类名
  STYLE = 1 << 2, // 动态样式
  PROPS = 1 << 3, // 动态属性
  FULL_PROPS = 1 << 4, // 全量属性更新
  HYDRATE_EVENTS = 1 << 5, // 水合事件
  STABLE_FRAGMENT = 1 << 6, // 稳定片段
  KEYED_FRAGMENT = 1 << 7, // 带键的片段
  UNKEYED_FRAGMENT = 1 << 8, // 无键的片段
  NEED_PATCH = 1 << 9, // 需要补丁
  DYNAMIC_SLOTS = 1 << 10, // 动态插槽
  HOISTED = -1, // 静态提升
  BAIL = -2, // 跳过优化
}
```

### 2. 补丁标志优化

```typescript
// 编译时生成的优化代码
function render() {
  return (
    openBlock(),
    createElementBlock(
      'div',
      {
        class: _ctx.dynamicClass, // 动态类名
        style: _ctx.dynamicStyle, // 动态样式
      },
      [
        createTextVNode(_ctx.message), // 动态文本
      ],
      6,
    )
  ) // patchFlag = 6 (CLASS + STYLE)
}

// 运行时根据patchFlag进行优化
function patchElement(n1: VNode, n2: VNode) {
  const { patchFlag } = n2

  if (patchFlag > 0) {
    // 有补丁标志，进行优化更新
    if (patchFlag & PatchFlags.CLASS) {
      // 只更新类名
      if (n1.props.class !== n2.props.class) {
        hostPatchProp(el, 'class', null, n2.props.class)
      }
    }

    if (patchFlag & PatchFlags.STYLE) {
      // 只更新样式
      if (n1.props.style !== n2.props.style) {
        hostPatchProp(el, 'style', n1.props.style, n2.props.style)
      }
    }

    if (patchFlag & PatchFlags.TEXT) {
      // 只更新文本内容
      if (n1.children !== n2.children) {
        hostSetElementText(el, n2.children as string)
      }
    }
  } else {
    // 无补丁标志，全量更新
    patchProps(el, n1.props, n2.props)
  }
}
```

## 🔧 块级优化 (Block Optimization)

### 1. 块级节点概念

```typescript
// 块级节点：包含动态子节点的父节点
let currentBlock: VNode[] | null = null
let currentBlockTree: VNode[] | null = null

// 开启块级追踪
export function openBlock(disableTracking = false): void {
  if (!disableTracking) {
    currentBlock = []
  }
}

// 关闭块级追踪
export function closeBlock(): void {
  currentBlock = null
}

// 设置块级节点
function setupBlock(vnode: VNode) {
  if (currentBlock) {
    vnode.dynamicChildren = currentBlock
    currentBlock = null
  }
}
```

### 2. 块级优化示例

```typescript
// 模板
<template>
  <div>
    <span>{{ message }}</span>
    <span>{{ count }}</span>
    <span>静态文本</span>
  </div>
</template>

// 编译结果
function render() {
  return (openBlock(), createElementBlock("div", null, [
    createElementVNode("span", null, toDisplayString(_ctx.message), 1),  // TEXT
    createElementVNode("span", null, toDisplayString(_ctx.count), 1),    // TEXT
    createElementVNode("span", null, "静态文本")  // 静态节点
  ]))
}

// 运行时优化
function patchBlockChildren(n1: VNode, n2: VNode) {
  const { dynamicChildren } = n2

  if (dynamicChildren) {
    // 只更新动态子节点
    for (let i = 0; i < dynamicChildren.length; i++) {
      const dynamicChild = dynamicChildren[i]
      const child = n1.dynamicChildren![i]
      patch(child, dynamicChild, container)
    }
  } else {
    // 全量更新
    patchChildren(n1, n2, container)
  }
}
```

## 🎨 静态提升 (Static Hoisting)

### 1. 静态提升机制

```typescript
// 静态节点提升
const hoisted = /*#__PURE__*/ createVNode(
  'div',
  {
    class: 'static-class',
    id: 'static-id',
  },
  [createVNode('span', null, '静态内容')],
)

// 编译结果
function render() {
  return (
    openBlock(),
    createElementBlock('div', null, [
      hoisted, // 复用静态节点
      createElementVNode('span', null, toDisplayString(_ctx.message), 1),
    ])
  )
}
```

### 2. 静态提升优化

```typescript
// 静态节点缓存
const staticVNodes = new WeakMap()

// 检查是否为静态节点
function isStaticVNode(vnode: VNode): boolean {
  return (
    vnode.type === 'div' &&
    vnode.props &&
    vnode.props.class === 'static-class' &&
    !vnode.dynamicChildren
  )
}

// 静态节点复用
function cloneIfMounted(child: VNode): VNode {
  if (child.shapeFlag & ShapeFlags.ELEMENT) {
    const el = child.el
    if (el) {
      // 已挂载的静态节点，创建新的VNode
      return cloneVNode(child)
    }
  }
  return child
}
```

## 🔄 Diff算法

### 1. 快速Diff算法

```typescript
function patchKeyedChildren(
  c1: VNode[],
  c2: VNodeArrayChildren,
  container: RendererElement,
  parentAnchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  slotScopeIds: string[] | null,
  optimized: boolean,
) {
  let i = 0
  const l2 = c2.length
  let e1 = c1.length - 1
  let e2 = l2 - 1

  // 1. 从头部开始比较
  while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = c2[i] as VNode
    if (isSameVNodeType(n1, n2)) {
      patch(
        n1,
        n2,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    } else {
      break
    }
    i++
  }

  // 2. 从尾部开始比较
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = c2[e2] as VNode
    if (isSameVNodeType(n1, n2)) {
      patch(
        n1,
        n2,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    } else {
      break
    }
    e1--
    e2--
  }

  // 3. 处理新增节点
  if (i > e1) {
    if (i <= e2) {
      const nextPos = e2 + 1
      const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
      while (i <= e2) {
        patch(
          null,
          c2[i] as VNode,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        i++
      }
    }
  }
  // 4. 处理删除节点
  else if (i > e2) {
    while (i <= e1) {
      unmount(c1[i], parentComponent, parentSuspense, true)
      i++
    }
  }
  // 5. 处理未知序列
  else {
    const s1 = i
    const s2 = i
    const keyToNewIndexMap = new Map()

    // 建立新节点的key映射
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i] as VNode
      if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i)
      }
    }

    // 更新和移动节点
    let patched = 0
    const toBePatched = e2 - s2 + 1
    let moved = false
    let maxNewIndexSoFar = 0

    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i]
      if (patched >= toBePatched) {
        unmount(prevChild, parentComponent, parentSuspense, true)
        continue
      }

      let newIndex
      if (prevChild.key != null) {
        newIndex = keyToNewIndexMap.get(prevChild.key)
      } else {
        // 无key的节点，需要遍历查找
        for (let j = s2; j <= e2; j++) {
          if (isSameVNodeType(prevChild, c2[j] as VNode)) {
            newIndex = j
            break
          }
        }
      }

      if (newIndex === undefined) {
        unmount(prevChild, parentComponent, parentSuspense, true)
      } else {
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          moved = true
        }
        patch(
          prevChild,
          c2[newIndex] as VNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        patched++
      }
    }
  }
}
```

### 2. 最长递增子序列算法

```typescript
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length

  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
```

## 🎛️ 渲染器系统

### 1. 渲染器接口

```typescript
export interface Renderer<HostElement = RendererElement> {
  render: RootRenderFunction<HostElement>
  createApp: CreateAppFunction<HostElement>
}

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  patchProp(
    el: HostElement,
    key: string,
    prevValue: any,
    nextValue: any,
    namespace?: ElementNamespace,
    parentComponent?: ComponentInternalInstance | null,
  ): void

  insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
  remove(el: HostNode): void
  createElement(
    type: string,
    namespace?: ElementNamespace,
    isCustomizedBuiltIn?: string,
  ): HostElement
  createText(text: string): HostNode
  createComment(text: string): HostNode
  setText(node: HostNode, text: string): void
  setElementText(node: HostElement, text: string): void
  parentNode(node: HostNode): HostElement | null
  nextSibling(node: HostNode): HostNode | null
}
```

### 2. 创建渲染器

```typescript
export function createRenderer<HostNode, HostElement>(
  options: RendererOptions<HostNode, HostElement>,
): Renderer<HostElement> {
  return baseCreateRenderer(options)
}

function baseCreateRenderer(
  options: RendererOptions<Node, Element>,
): Renderer<Element> {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    cloneNode: hostCloneNode,
    insertStaticContent: hostInsertStaticContent,
  } = options

  // 实现各种patch函数
  const patch: PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    namespace = undefined,
    slotScopeIds = null,
    optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren,
  ) => {
    const { type, shapeFlag } = n2

    switch (type) {
      case Text:
        processText(n1, n2, container, anchor)
        break
      case Comment:
        processCommentNode(n1, n2, container, anchor)
        break
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor)
        }
        break
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        } else if (shapeFlag & ShapeFlags.TELEPORT) {
          ;(type as typeof TeleportImpl).process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals,
          )
        } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
          ;(type as typeof SuspenseImpl).process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals,
          )
        }
    }
  }

  return {
    render,
    createApp: createAppAPI(render, hydrate),
  }
}
```

## 📊 性能优化

### 1. 编译时优化

```typescript
// 静态提升
const hoisted = /*#__PURE__*/ createVNode('div', { class: 'static' })

// 补丁标志
const patchFlag = PatchFlags.CLASS | PatchFlags.STYLE

// 块级优化
const dynamicChildren = [dynamicVNode1, dynamicVNode2]
```

### 2. 运行时优化

```typescript
// 快速路径检查
if (patchFlag > 0) {
  // 有补丁标志，进行优化更新
  if (patchFlag & PatchFlags.CLASS) {
    // 只更新类名
  }
  if (patchFlag & PatchFlags.STYLE) {
    // 只更新样式
  }
} else {
  // 无补丁标志，全量更新
}

// 块级更新
if (dynamicChildren) {
  // 只更新动态子节点
  for (let i = 0; i < dynamicChildren.length; i++) {
    patch(dynamicChildren[i], newDynamicChildren[i])
  }
}
```

## 🎯 总结

Vue3的虚拟DOM系统展现了现代前端框架的设计精髓：

1. **高效Diff算法** - 快速Diff + 最长递增子序列
2. **编译时优化** - 静态提升 + 补丁标志 + 块级优化
3. **运行时优化** - 快速路径 + 块级更新
4. **跨平台支持** - 渲染器抽象 + 平台特定实现
5. **类型安全** - 完整的TypeScript支持
6. **性能优先** - 多种优化策略组合

这套虚拟DOM系统不仅为Vue3提供了高效的渲染能力，也为其他前端项目提供了优秀的设计参考。
