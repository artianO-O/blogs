# Vue3响应式系统详解

## 🎯 响应式系统概述

Vue3的响应式系统是框架的核心，它基于Proxy实现了精确的依赖追踪和高效的更新机制。

### 系统架构图

```
┌─────────────────────────────────────┐
│        响应式API层 (API Layer)      │
│  reactive() | ref() | computed()   │
├─────────────────────────────────────┤
│        依赖追踪层 (Tracking Layer)  │
│      track() | trigger() | effect() │
├─────────────────────────────────────┤
│        代理层 (Proxy Layer)         │
│  baseHandlers | collectionHandlers │
└─────────────────────────────────────┘
```

## 🔄 核心概念

### 1. 三大核心函数

```typescript
// 依赖收集 - 当访问响应式数据时调用
track(target: object, type: TrackOpTypes, key: unknown): void

// 依赖触发 - 当响应式数据变化时调用
trigger(target: object, type: TriggerOpTypes, key?: unknown): void

// 副作用函数 - 创建响应式副作用
effect<T = any>(fn: () => T, options?: ReactiveEffectOptions): ReactiveEffectRunner<T>
```

### 2. 核心数据结构

```typescript
// 全局依赖映射表
export const targetMap: WeakMap<object, Map<any, Dep>> = new WeakMap()

// 依赖类
export class Dep {
  version = 0 // 版本号
  activeLink?: Link // 当前活跃链接
  subs?: Link // 订阅者链表
  sc: number = 0 // 订阅者计数
}

// 链接节点
export class Link {
  version: number // 版本号
  nextDep?: Link // 依赖链表指针
  prevDep?: Link // 依赖链表指针
  nextSub?: Link // 订阅者链表指针
  prevSub?: Link // 订阅者链表指针
  prevActiveLink?: Link // 前一个活跃链接
}
```

## 🎛️ 响应式API

### 1. reactive() - 深度响应式

```typescript
// 创建深度响应式对象
export function reactive<T extends object>(target: T): Reactive<T>

// 使用示例
const state = reactive({
  count: 0,
  user: {
    name: 'Vue',
    age: 25,
  },
})

// 所有嵌套属性都是响应式的
state.count++ // 触发更新
state.user.name = 'Vue3' // 触发更新
```

### 2. ref() - 响应式引用

```typescript
// 创建响应式引用
export function ref<T>(value: T): Ref<UnwrapRef<T>>

// RefImpl实现
class RefImpl<T> {
  _value: T
  private _rawValue: T
  dep: Dep = new Dep()

  get value() {
    this.dep.track() // 访问时收集依赖
    return this._value
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = toReactive(newValue)
      this.dep.trigger() // 变化时触发更新
    }
  }
}
```

### 3. computed() - 计算属性

```typescript
// 创建计算属性
export function computed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRef<T>

// ComputedRefImpl实现
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
```

### 4. watch() - 侦听器

```typescript
// 创建侦听器
export function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions,
): WatchStopHandle

// 使用示例
watch(
  () => state.count,
  (newValue, oldValue) => {
    console.log(`count changed: ${oldValue} -> ${newValue}`)
  },
  { immediate: true, deep: true },
)
```

## 🔧 依赖追踪机制

### 1. 依赖收集流程

```typescript
// 依赖收集完整流程
export function track(target: object, type: TrackOpTypes, key: unknown): void {
  if (shouldTrack && activeSub) {
    // 1. 获取或创建target的依赖映射
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    // 2. 获取或创建key的依赖
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Dep()))
      dep.map = depsMap
      dep.key = key
    }

    // 3. 建立依赖关系
    dep.track()
  }
}
```

### 2. 依赖触发流程

```typescript
// 依赖触发完整流程
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
): void {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const run = (dep: Dep | undefined) => {
    if (dep) {
      dep.trigger()
    }
  }

  startBatch()

  if (type === TriggerOpTypes.CLEAR) {
    // 清空操作：触发所有依赖
    depsMap.forEach(run)
  } else {
    // 普通属性变化
    if (key !== void 0) {
      run(depsMap.get(key))
    }

    // 特殊键值处理
    switch (type) {
      case TriggerOpTypes.ADD:
        run(depsMap.get(ITERATE_KEY))
        break
      case TriggerOpTypes.DELETE:
        run(depsMap.get(ITERATE_KEY))
        break
    }
  }

  endBatch()
}
```

## 🎯 Effect生命周期

### 1. Effect运行流程

```typescript
class ReactiveEffect<T = any> {
  run(): T {
    if (!(this.flags & EffectFlags.ACTIVE)) {
      return this.fn()
    }

    this.flags |= EffectFlags.RUNNING

    // 1. 清理之前的依赖
    cleanupEffect(this)

    // 2. 准备依赖追踪
    prepareDeps(this)

    // 3. 设置当前活跃的effect
    const prevEffect = activeSub
    const prevShouldTrack = shouldTrack
    activeSub = this
    shouldTrack = true

    try {
      // 4. 执行effect函数（期间会收集依赖）
      return this.fn()
    } finally {
      // 5. 清理未使用的依赖
      cleanupDeps(this)

      // 6. 恢复之前的上下文
      activeSub = prevEffect
      shouldTrack = prevShouldTrack
      this.flags &= ~EffectFlags.RUNNING
    }
  }
}
```

### 2. 依赖清理机制

```typescript
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

## 🎛️ 版本控制优化

### 1. 版本号机制

```typescript
// 全局版本号
export let globalVersion = 0

// 依赖版本号
class Dep {
  version = 0

  trigger() {
    this.version++ // 每次触发时递增
    globalVersion++ // 全局版本号也递增
    this.notify()
  }
}

// 链接版本号
class Link {
  version: number

  constructor(sub: Subscriber, dep: Dep) {
    this.version = dep.version // 初始化为dep的版本号
  }
}
```

### 2. 快速路径检查

```typescript
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
```

## 📦 批量更新机制

### 1. 批量处理

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
```

### 2. 任务队列

```typescript
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

## 🔧 集合类型支持

### 1. 集合处理器

```typescript
// 集合类型处理器
const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(false, false),
}

// 创建集合方法重写
function createInstrumentations(readonly: boolean, shallow: boolean) {
  return {
    get(key: unknown) {
      return get(this, key, readonly, shallow)
    },
    get size() {
      return size(this, readonly, shallow)
    },
    has(key: unknown) {
      return has(this, key, readonly, shallow)
    },
    add(value: unknown) {
      return add(this, value, readonly, shallow)
    },
    set(key: unknown, value: unknown) {
      return set(this, key, value, readonly, shallow)
    },
    delete(key: unknown) {
      return deleteEntry(this, key, readonly, shallow)
    },
    clear() {
      return clear(this, readonly, shallow)
    },
    forEach(callback: Function, thisArg?: unknown) {
      return forEach(this, callback, thisArg, readonly, shallow)
    },
  }
}
```

### 2. 特殊键值处理

```typescript
// 特殊键值
export const ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Object iterate' : '',
)
export const MAP_KEY_ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Map keys iterate' : '',
)
export const ARRAY_ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Array iterate' : '',
)

// 操作类型
export enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate',
}

export enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear',
}
```

## 🐛 调试支持

### 1. 开发钩子

```typescript
// 调试钩子接口
export interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

// 调试事件
export type DebuggerEvent = {
  effect: Subscriber
} & DebuggerEventExtraInfo

export type DebuggerEventExtraInfo = {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### 2. 错误处理

```typescript
// 递归限制
const RECURSION_LIMIT = 100

// 递归检查
function checkRecursiveUpdates(seen: CountMap, fn: SchedulerJob) {
  if (!seen.has(fn)) {
    seen.set(fn, 1)
  } else {
    const count = seen.get(fn)!
    if (count > RECURSION_LIMIT) {
      throw new Error(
        'Maximum recursive updates exceeded. ' +
          'This means you have a reactive effect that is mutating its own ' +
          'dependencies, thus causing the effect to run infinitely.',
      )
    } else {
      seen.set(fn, count + 1)
    }
  }
}
```

## 📊 性能优化

### 1. 内存优化

```typescript
// WeakMap避免内存泄漏
export const targetMap: WeakMap<object, Map<any, Dep>> = new WeakMap()

// 双向链表O(1)操作
class Link {
  nextDep?: Link
  prevDep?: Link
  nextSub?: Link
  prevSub?: Link
}
```

### 2. 计算优化

```typescript
// 懒计算
class ComputedRefImpl<T> {
  get value(): T {
    this.dep.track()
    refreshComputed(this) // 只在需要时重新计算
    return this._value
  }
}

// 版本控制快速路径
if (computed.globalVersion === globalVersion) {
  return computed._value // 跳过计算
}
```

## 🎯 总结

Vue3的响应式系统展现了现代响应式框架的设计精髓：

1. **精确追踪** - 只追踪实际使用的依赖
2. **高效数据结构** - WeakMap + 双向链表
3. **智能版本控制** - 避免不必要的重新计算
4. **优雅批量更新** - 批量处理提高性能
5. **完善内存管理** - WeakMap自动GC
6. **强大调试支持** - 完整的开发工具集成

这套响应式系统不仅为Vue3提供了强大的响应式能力，也为其他需要响应式功能的项目提供了优秀的设计参考。
