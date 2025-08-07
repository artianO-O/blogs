# Vue3性能优化详解

## 🎯 性能优化概述

Vue3在性能优化方面做了大量工作，从编译时到运行时都有相应的优化策略，实现了显著的性能提升。

### 优化架构图

```
┌─────────────────────────────────────┐
│        编译时优化 (Compile-time)    │
│  静态提升 | 补丁标志 | 块级优化     │
├─────────────────────────────────────┤
│        运行时优化 (Runtime)         │
│  快速路径 | 批量更新 | 缓存机制     │
├─────────────────────────────────────┤
│        内存优化 (Memory)            │
│  WeakMap | 自动GC | 内存泄漏防护    │
└─────────────────────────────────────┘
```

## 🔧 编译时优化

### 1. 静态提升 (Static Hoisting)

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

// 静态提升优化
function transformHoist(node: ElementNode, context: TransformContext) {
  if (isStaticNode(node)) {
    // 提升静态节点
    const hoisted = generateStaticNode(node, context)
    context.hoist(hoisted)

    // 替换为静态引用
    context.replaceNode(
      createSimpleExpression(
        context.helperString(HoistType.HOISTED),
        false,
        node.loc,
      ),
    )
  }
}

// 检查静态节点
function isStaticNode(node: ElementNode): boolean {
  // 检查属性是否静态
  for (const prop of node.props) {
    if (prop.type === NodeTypes.DIRECTIVE) {
      return false
    }
    if (prop.type === NodeTypes.ATTRIBUTE) {
      if (prop.value && !isStaticExp(prop.value)) {
        return false
      }
    }
  }

  // 检查子节点是否静态
  for (const child of node.children) {
    if (!isStaticChild(child)) {
      return false
    }
  }

  return true
}
```

### 2. 补丁标志 (Patch Flags)

```typescript
// 补丁标志定义
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

// 生成补丁标志
function getPatchFlag(node: ElementNode, context: TransformContext): number {
  let patchFlag = 0

  // 检查动态属性
  for (const prop of node.props) {
    if (prop.type === NodeTypes.DIRECTIVE) {
      const dir = prop
      if (dir.name === 'bind') {
        patchFlag |= PatchFlags.PROPS
      } else if (dir.name === 'on') {
        patchFlag |= PatchFlags.HYDRATE_EVENTS
      }
    } else if (prop.type === NodeTypes.ATTRIBUTE) {
      if (prop.name === 'class') {
        patchFlag |= PatchFlags.CLASS
      } else if (prop.name === 'style') {
        patchFlag |= PatchFlags.STYLE
      }
    }
  }

  // 检查动态子节点
  for (const child of node.children) {
    if (child.type === NodeTypes.INTERPOLATION) {
      patchFlag |= PatchFlags.TEXT
    }
  }

  return patchFlag
}

// 运行时优化
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

### 3. 块级优化 (Block Optimization)

```typescript
// 块级节点概念
let currentBlock: VNode[] | null = null

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

// 块级优化示例
function render() {
  return (
    openBlock(),
    createElementBlock('div', null, [
      createElementVNode('span', null, toDisplayString(_ctx.message), 1), // TEXT
      createElementVNode('span', null, toDisplayString(_ctx.count), 1), // TEXT
      createElementVNode('span', null, '静态文本'), // 静态节点
    ])
  )
}

// 运行时块级更新
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

## ⚡ 运行时优化

### 1. 快速路径 (Fast Path)

```typescript
// 快速路径检查
function patchElement(n1: VNode, n2: VNode) {
  const { patchFlag } = n2

  if (patchFlag > 0) {
    // 快速路径：有补丁标志
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
    // 慢速路径：全量更新
    patchProps(el, n1.props, n2.props)
  }
}

// 快速Diff算法
function patchKeyedChildren(c1: VNode[], c2: VNodeArrayChildren) {
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

  // 3. 处理新增和删除
  if (i > e1) {
    // 新增节点
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
  } else if (i > e2) {
    // 删除节点
    while (i <= e1) {
      unmount(c1[i], parentComponent, parentSuspense, true)
      i++
    }
  } else {
    // 处理未知序列
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

### 2. 批量更新 (Batch Updates)

```typescript
// 批量深度
let batchDepth = 0

// 开始批量
export function startBatch(): void {
  batchDepth++
}

// 结束批量
export function endBatch(): void {
  if (--batchDepth > 0) {
    return
  }

  // 执行队列中的任务
  let error: unknown
  while (batchedSub) {
    let e: Subscriber | undefined = batchedSub
    batchedSub = undefined
    while (e) {
      const next: Subscriber | undefined = e.next
      e.next = undefined
      e.flags &= ~EffectFlags.NOTIFIED
      if (e.flags & EffectFlags.ACTIVE) {
        try {
          ;(e as ReactiveEffect).trigger()
        } catch (err) {
          if (!error) error = err
        }
      }
      e = next
    }
  }

  if (error) throw error
}

// 批量任务
export function batch(sub: Subscriber, isComputed = false): void {
  sub.flags |= EffectFlags.NOTIFIED

  if (isComputed) {
    // computed effect：添加到computed队列
    sub.next = batchedComputed
    batchedComputed = sub
  } else {
    // 普通effect：添加到普通队列
    sub.next = batchedSub
    batchedSub = sub
  }
}
```

### 3. 缓存机制 (Caching)

```typescript
// 计算属性缓存
class ComputedRefImpl<T> implements Subscriber {
  _value: any = undefined
  dep: Dep = new Dep(this)
  flags: EffectFlags = EffectFlags.DIRTY

  get value(): T {
    this.dep.track()
    refreshComputed(this) // 只在需要时重新计算
    return this._value
  }

  notify(): true | void {
    this.flags |= EffectFlags.DIRTY // 标记为脏
    batch(this, true) // 批量更新
    return true
  }
}

// 版本控制缓存
function isDirty(sub: Subscriber): boolean {
  for (let link = sub.deps; link; link = link.nextDep) {
    // 检查版本号是否匹配
    if (link.dep.version !== link.version) {
      return true
    }
    // 检查computed依赖
    if (link.dep.computed && refreshComputed(link.dep.computed)) {
      return true
    }
  }
  return false
}

// 快速路径缓存
if (computed.globalVersion === globalVersion) {
  return computed._value // 跳过计算
}
```

## 💾 内存优化

### 1. WeakMap避免内存泄漏

```typescript
// 全局依赖映射表
export const targetMap: WeakMap<object, Map<any, Dep>> = new WeakMap()

// WeakMap的优势
// 1. 当target被GC时，相关依赖自动清理
// 2. 避免内存泄漏
// 3. 自动垃圾回收

// 依赖收集
export function track(target: object, type: TrackOpTypes, key: unknown): void {
  if (shouldTrack && activeSub) {
    // 获取或创建target的依赖映射
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    // 获取或创建key的依赖
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Dep()))
      dep.map = depsMap
      dep.key = key
    }

    // 建立依赖关系
    dep.track()
  }
}
```

### 2. 双向链表O(1)操作

```typescript
// 链接节点
export class Link {
  version: number
  nextDep?: Link // 在effect的dep链表中的下一个
  prevDep?: Link // 在effect的dep链表中的上一个
  nextSub?: Link // 在dep的sub链表中的下一个
  prevSub?: Link // 在dep的sub链表中的上一个
  prevActiveLink?: Link

  constructor(
    public sub: Subscriber,
    public dep: Dep,
  ) {
    this.version = dep.version
  }
}

// O(1)的依赖管理操作
function addDep(sub: Subscriber, dep: Dep): void {
  const link = new Link(sub, dep)

  // 添加到dep的sub链表
  if (dep.subs) {
    dep.subs.prevSub = link
    link.nextSub = dep.subs
  }
  dep.subs = link

  // 添加到sub的dep链表
  if (sub.deps) {
    sub.deps.prevDep = link
    link.nextDep = sub.deps
  }
  sub.deps = link
}

function removeDep(link: Link): void {
  // 从dep的sub链表中移除
  if (link.nextSub) {
    link.nextSub.prevSub = link.prevSub
  }
  if (link.prevSub) {
    link.prevSub.nextSub = link.nextSub
  } else {
    link.dep.subs = link.nextSub
  }

  // 从sub的dep链表中移除
  if (link.nextDep) {
    link.nextDep.prevDep = link.prevDep
  }
  if (link.prevDep) {
    link.prevDep.nextDep = link.nextDep
  } else {
    link.sub.deps = link.nextDep
  }
}
```

### 3. 依赖清理机制

```typescript
// 依赖清理
function cleanupDeps(sub: Subscriber) {
  let head
  let tail = sub.depsTail
  let link = tail

  while (link) {
    const prev = link.prevDep
    if (link.version === -1) {
      // 未使用的依赖：从链表中移除
      if (link === tail) tail = prev
      removeSub(link)
      removeDep(link)
    } else {
      // 使用的依赖：保留
      head = link
    }

    // 恢复之前的活跃链接
    link.dep.activeLink = link.prevActiveLink
    link.prevActiveLink = undefined
    link = prev
  }

  // 更新头部和尾部指针
  sub.deps = head
  sub.depsTail = tail
}
```

## 📊 性能监控

### 1. 性能指标

```typescript
// 性能监控
export interface PerformanceMetrics {
  renderTime: number // 渲染时间
  patchTime: number // 补丁时间
  mountTime: number // 挂载时间
  updateTime: number // 更新时间
  memoryUsage: number // 内存使用
  componentCount: number // 组件数量
  vnodeCount: number // VNode数量
}

// 性能监控器
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    patchTime: 0,
    mountTime: 0,
    updateTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    vnodeCount: 0,
  }

  startTimer(type: keyof PerformanceMetrics): void {
    this.metrics[type] = performance.now()
  }

  endTimer(type: keyof PerformanceMetrics): number {
    const startTime = this.metrics[type]
    const endTime = performance.now()
    const duration = endTime - startTime
    this.metrics[type] = duration
    return duration
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
}
```

### 2. 性能分析

```typescript
// 性能分析工具
export function analyzePerformance(app: App): PerformanceReport {
  const report: PerformanceReport = {
    totalRenderTime: 0,
    averageRenderTime: 0,
    slowestComponents: [],
    memoryLeaks: [],
    optimizationSuggestions: [],
  }

  // 分析渲染性能
  const components = getAllComponents(app)
  for (const component of components) {
    const renderTime = getComponentRenderTime(component)
    report.totalRenderTime += renderTime

    if (renderTime > 16) {
      // 超过16ms的组件
      report.slowestComponents.push({
        name: component.type.name,
        renderTime,
        suggestions: getOptimizationSuggestions(component),
      })
    }
  }

  report.averageRenderTime = report.totalRenderTime / components.length

  // 分析内存使用
  const memoryUsage = getMemoryUsage()
  if (memoryUsage > 50 * 1024 * 1024) {
    // 超过50MB
    report.memoryLeaks.push({
      type: 'high_memory_usage',
      usage: memoryUsage,
      suggestions: ['检查内存泄漏', '优化数据结构', '使用WeakMap'],
    })
  }

  return report
}
```

## 🎯 优化建议

### 1. 编译时优化建议

```typescript
// 1. 使用静态提升
const staticNode = /*#__PURE__*/ createVNode('div', { class: 'static' })

// 2. 合理使用补丁标志
const dynamicProps = { class: computedClass, style: computedStyle }

// 3. 块级优化
const blockNode = createElementBlock('div', null, [
  createElementVNode('span', null, toDisplayString(message), 1),
])

// 4. 缓存优化
const cachedValue = _cache(1, () => expensiveComputation())
```

### 2. 运行时优化建议

```typescript
// 1. 使用快速路径
if (patchFlag > 0) {
  // 优化更新
} else {
  // 全量更新
}

// 2. 批量更新
startBatch()
// 多个状态更新
endBatch()

// 3. 合理使用缓存
const computedValue = computed(() => expensiveCalculation())

// 4. 避免不必要的响应式
const staticData = markRaw({ static: true })
```

### 3. 内存优化建议

```typescript
// 1. 使用WeakMap
const cache = new WeakMap()

// 2. 及时清理引用
onUnmounted(() => {
  // 清理引用
})

// 3. 避免闭包陷阱
function createHandler() {
  const data = ref(0)
  return () => {
    // 使用data
  }
}

// 4. 使用shallowRef
const largeData = shallowRef({
  /* 大量数据 */
})
```

## 🎯 总结

Vue3的性能优化展现了现代前端框架的设计精髓：

1. **编译时优化** - 静态提升、补丁标志、块级优化
2. **运行时优化** - 快速路径、批量更新、缓存机制
3. **内存优化** - WeakMap、自动GC、依赖清理
4. **性能监控** - 指标收集、性能分析、优化建议
5. **最佳实践** - 优化建议、性能指南、最佳实践

这套性能优化体系不仅为Vue3提供了卓越的性能表现，也为其他前端项目提供了优秀的设计参考。
