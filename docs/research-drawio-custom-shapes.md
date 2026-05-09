# draw.io 自定义图标与形状调研报告

> 调研目标：为 fireworks-drawio-graph（纯 TS+Node draw.io XML 生成器）扩展自定义图标和形状支持。
> 项目背景：不使用浏览器 DOM，不依赖 draw.io 编辑器 API，通过拼接 XML 字符串生成 `.drawio` 文件。

---

## 1. draw.io 形状系统架构

draw.io (mxGraph) 的形状有三种实现机制，从简单到复杂：

| 机制 | 实现方式 | 适用场景 |
|------|---------|---------|
| **Core Shapes** | mxGraph 内置，JavaScript 定义 | 矩形、椭圆、菱形、圆柱等基本几何 |
| **JavaScript Shapes** | `src/main/webapp/js/Shapes.js` 中定义 | 云形、callout、step、hexagon、cylinder3 等扩展形状 |
| **Stencil XML** | `.xml` 文件定义路径 | 复杂图标库（AWS、Azure、企业 Logo） |

三种机制在 `mxCell` 的 `style` 属性中通过不同的 key 引用：

```
style="shape=<name>;..."           ← 核心或 JS 扩展形状
style="shape=mxgraph.<lib>.<name>" ← Stencil 库中的形状
style="image=<url>"                ← 图片作为形状容器
style="image=data:image/svg+xml;base64,..." ← 内嵌 SVG
```

---

## 2. mxGraph Core 内置形状（无需任何引用）

这些形状通过 `shape=<name>` 直接引用，是最可靠的跨版本保证。

### 2.1 基础几何

```
shape=rectangle      # 矩形
shape=rounded        # 圆角矩形（需 + rounded=1）
shape=ellipse        # 椭圆
shape=rhombus        # 菱形（decision 形状）
shape=diamond        # 同 rhombus
shape=triangle       # 三角形
shape=pentagon       # 五边形
shape=hexagon        # 六边形
shape=octagon        # 八边形
shape=cylinder3      # 圆柱（数据库）
shape=cylinder       # 旧版圆柱
shape=document       # 折叠角文档
shape=note           # 便签/注释
shape=cloud          # 云形
shape=arrow          # 箭头（direction 属性控制方向）
shape=line           # 直线
shape=polyline       # 折线
shape=cross          # 十字
shape=plus           # 加号
shape=star           # 星形
shape=ticket         # 票据形状
shape=parallelogram  # 平行四边形（I/O 框）
shape=trapezoid      # 梯形
shape=step           # 步骤形状
shape=hexagram       # 六芒星
shape=can             # 罐头形状
shape=spring         # 弹簧形状
```

### 2.2 带参数的形状

```xml
<!-- 圆角矩形：arcSize 控制圆角大小 -->
<mxCell style="rounded=1;arcSize=12;..." vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
</mxCell>

<!-- 圆柱：size=10 控制顶部椭圆高度 -->
<mxCell style="shape=cylinder3;boundedLbl=1;size=10;..." vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="80" as="geometry"/>
</mxCell>

<!-- 云形 -->
<mxCell style="shape=cloud;..." vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="160" height="100" as="geometry"/>
</mxCell>
```

### 2.3 Swimlane（泳道）/Table

```xml
<!-- Swimlane 容器 -->
<mxCell id="1" value="Swimlane" style="swimlane;horizontal=0;startSize=26;..." vertex="1" parent="0">
  <mxGeometry x="0" y="0" width="600" height="400" as="geometry"/>
</mxCell>

<!-- Swimlane 内部分区（child cells，parent="1"） -->
<mxCell id="2" value="Header" style="swimlane;horizontal=1;..." vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="600" height="40" relative="1" as="geometry"/>
</mxCell>
```

---

## 3. JavaScript 扩展形状（Shapes.js）

这些形状在 draw.io 的 `Shapes.js` 中定义，形状名为下述形式。

### 3.1 常用扩展形状

```
shape=callout          # 带指针气泡
shape=bulb             # 电灯泡
shape=xor              # XOR 逻辑门
shape=or               # OR 逻辑门
shape=and              # AND 逻辑门
shape=sumEllipse       # 求和椭圆
shape=process          # 流程框
shape=dataStorage      # 数据存储
shape=datastore        # 同上
shape=display          # 显示框
shape=loopLimit        # 循环限制
shape=offPageConnector # 页连接器
shape=delay             # 延迟
shape=requiredForSetup # 设置框
shape=teq              # TEQ 形状
shape=corner          # 角落形状
shape=isoTrough        # ISO 槽
shape=isoDocument       # ISO 文档
shape=isoProcurementToPayment  # ISO Procure
shape=hexagon          # 六边形（同 core）
shape=singleArrow      # 单箭头
shape=doubleArrow      # 双箭头
shape=switch           # 交换机
shape=term             # 终端
shape=rect1 ~ rect3     # 矩形变体
shape=ellipse1~ellipse3  # 椭圆变体
shape=triangle1~triangle3 # 三角变体
shape=lineEllipse      # 线椭圆
shape=moveTap          # 移动箭头
shape=cornerRadius     # 圆角框
shape=folder           # 文件夹
shape=frame            # 框架
shape=tape             # 磁带
shape=dateInput        # 日期输入
shape=partialArc       # 部分弧
shape=isoDecision2     # ISO 决策
shape=manualInput      # 手动输入
shape=manualOperation  # 手动操作
shape=collate          # 整理
shape=transmittal      # 发送
shape=receive          # 接收
shape=isoReserve1~isoReserve4  # ISO 储备
shape=isoDelay         # ISO 延迟
shape=internalStorage  # 内部存储
shape=crossbar         # 横杆
shape=isoProcess       # ISO 流程
shape=isoDelay2        # ISO 延迟2
shape=isoManualInput   # ISO 手动输入
shape=isoConnector     # ISO 连接器
shape=isoOr           # ISO OR
shape=isoAnd          # ISO AND
shape=isoStart1        # ISO 开始
shape=isoEnd1          # ISO 结束
shape=isoFlowTriggered # ISO 流程触发
shape=isoAutomated      # ISO 自动化
shape=isoManualOperation # ISO 手动操作
shape=isoData          # ISO 数据
shape=isoDocument1      # ISO 文档1
shape=isoDocument2      # ISO 文档2
shape=isoStoredData     # ISO 存储数据
shape=isoSequentialData # ISO 顺序数据
shape=isoDirectData     # ISO 直接数据
shape=isoMagneticTape   # ISO 磁带
shape=isoDelay3        # ISO 延迟3
shape=textBox          # 文本框
shape=corner2          # 角落2
shape=corner3          # 角落3
shape=corner4          # 角落4
shape=rect            # 同 rectangle
shape=box              # 同 rect
shape=rhombus2         # 菱形2
shape=loopLimit2       # 循环限制2
shape=trapezoid2       # 梯形2
shape=parallelogram2    # 平行四边形2
shape=singleArrow2~singleArrow4 # 箭头变体
shape=doubleArrow2~doubleArrow4 # 双箭头变体
shape=swimLane        # 泳道（同 swimlane）
shape=group           # 分组框
shape=inform           # 信息框
shape=warning         # 警告框
shape=error           # 错误框
shape=critical        # 关键框
shape=decision2       # 决策2
shape=actor           # 角色/小人
shape=umlLifeline     # UML 生命线
shape=messageArrow     # 消息箭头
shape=returnArrow     # 返回箭头
shape=activation      # 激活条
```

---

## 4. Stencil 库引用（shape=mxgraph.xxx）

Stencil 是 `.xml` 文件定义的路径形状，通过 `mxgraph.<lib>.<name>` 引用。

### 4.1 draw.io 内置 Stencil 库

draw.io 桌面版在 `etc draw.io.app/Contents/Resources/app/stencils/` 下包含大量 stencil 文件。常见库：

```
mxgraph.basic        # 基本电气符号
mxgraph.flowchart    # 流程图符号
mxgraph.arrows2      # 箭头变体
mxgraph.aws          # AWS 云图标
mxgraph.azure        # Azure 图标
mxgraph.ios          # iOS 控件
mxgraph.gcp          # Google Cloud
mxgraph.ecs          # ECS 图标
mxgraph.office       # Office 符号
mxgraph.mscae        # MS CAE
mxgraph.mockup       # 线框图
mxgraph.ucmc         # UMC
mxgraph.rack         # 机架图
```

### 4.2 使用方法

```xml
<!-- 在 .drawio 文件中使用 stencil -->
<mxCell style="shape=mxgraph.aws.compute;aspect=fixed;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="64" height="64" as="geometry"/>
</mxCell>

<!-- 常见 AWS EC2 -->
<mxCell style="shape=mxgraph.aws.ec2_instance;aspect=fixed;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="48" height="48" as="geometry"/>
</mxCell>

<!-- 带标签的 stencil -->
<mxCell value="EC2" style="shape=mxgraph.aws.ec2_instance;aspect=fixed;labelBackgroundColor=#ffffff;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="48" height="48" as="geometry"/>
</mxCell>
```

**注意**：Stencil 引用在独立的 `.drawio` 文件中可能不渲染（需要 draw.io 加载对应 stencil 文件）。自包含 XML 建议使用下面的 image 方式。

---

## 5. 自定义 SVG 图标嵌入

这是最灵活的方式，不依赖任何外部文件。

### 5.1 三种嵌入方式对比

| 方式 | 语法 | 自包含 | 渲染一致性 | 文件大小 |
|------|------|--------|-----------|---------|
| base64 内嵌 SVG | `image=data:image/svg+xml;base64,...` | ✅ | ✅ | 中等 |
| 原始 SVG 内嵌 | `image=data:image/svg+xml;utf8,<svg>...</svg>` | ✅ | ✅ | 小（无 base64 开销） |
| URL 引用 | `image=https://...` | ❌ | ❌ | N/A |

### 5.2 SVG base64 内嵌（推荐用于 TS 项目）

```xml
<!-- SVG 作为 image 嵌入 mxCell -->
<mxCell id="2" value="LLM" style="image;image=data:image/svg+xml;base64,..." vertex="1" parent="1">
  <mxGeometry x="200" y="100" width="48" height="48" as="geometry"/>
</mxCell>
```

**TS 生成代码示例**：

```typescript
import { DiagramBuilder } from '../builder/diagram-builder.js';

function svgToBase64(svg: string): string {
  const encoded = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

const llmSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <circle cx="24" cy="24" r="20" fill="#6366f1" stroke="#4f46e5" stroke-width="2"/>
  <text x="24" y="28" text-anchor="middle" fill="white" font-size="12" font-weight="bold">LLM</text>
</svg>`;

const builder = new DiagramBuilder({ style: 1 });
// Add as image-type node (no shape key, just image=)
builder.addNode({
  type: 'raw',
  label: 'LLM',
  x: 200, y: 100,
  width: 48, height: 48,
  styleOverrides: {
    shape: 'image',
    image: svgToBase64(llmSvg),
    // Override base style
    strokeColor: 'none',
    fillColor: 'none',
  },
});
```

### 5.3 SVG UTF-8 直接内嵌（推荐，更小）

```typescript
// SVG 内嵌（无需 base64，适合纯 XML 生成）
function svgToInlineDataUri(svg: string): string {
  // URL-encode < > " 等字符
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

const icon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
  <circle cx='24' cy='24' r='20' fill='%236366f1'/>
  <text x='24' y='29' text-anchor='middle' fill='white' font-size='12'>AI</text>
</svg>`;

const builder = new DiagramBuilder({ style: 1 });
builder.addNode({
  type: 'raw',
  label: 'LLM',
  x: 200, y: 100,
  width: 64, height: 64,
  styleOverrides: {
    shape: 'image',
    image: svgToInlineDataUri(icon),
    fillColor: 'none',
    strokeColor: 'none',
  },
});
```

### 5.4 完整 mxCell XML 示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxGraphModel dx="960" dy="600" grid="1" gridSize="10" guides="1"
  tooltips="1" connect="1" arrows="1" fold="1" page="1"
  pageScale="1" pageWidth="960" pageHeight="600">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>

    <!-- 自定义 SVG LLM 图标节点 -->
    <mxCell id="2"
      value="LLM"
      style="image;image=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iIzYzNjZmMSIgc3Ryb2tlPSIjNGY0NmU1IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyNCIgeT0iMjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCI+TExNPC90ZXh0Pjwvc3ZnPg==;fillColor=none;strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;fontColor=#6366f1;fontSize=11;"
      vertex="1" parent="1">
      <mxGeometry x="200" y="100" width="64" height="64" as="geometry"/>
    </mxCell>

    <!-- 普通 process 节点 -->
    <mxCell id="3" value="Agent"
      style="rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#1e293b;strokeColor=#475569;fontColor=#e2e8f0;fontSize=14;"
      vertex="1" parent="1">
      <mxGeometry x="400" y="100" width="120" height="60" as="geometry"/>
    </mxCell>

    <!-- 连接边 -->
    <mxCell id="4"
      style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#475569;fontColor=#94a3b8;endArrow=classic;endFill=1;"
      edge="1" parent="1" source="2" target="3">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>

  </root>
</mxGraphModel>
```

---

## 6. Stencil XML 格式（进阶）

Stencil 用于定义可通过 `shape=mxgraph.<lib>.<name>` 引用的路径形状。

### 6.1 Stencil 文件结构

```xml
<?xml version="1.0" encoding="UTF-8"?>
<shapes name="My Library" href="https://example.com">
  <shape name="my-icon" aspect="variable" strokewidth="inherit">
    <background>
      <!-- 背景层（可省略） -->
      <path>
        <move x="0" y="0"/>
        <rect x="0" y="0" w="100" h="100"/>
      </path>
    </background>
    <foreground>
      <!-- 绘制指令 -->
      <fillcolor color="#6366f1"/>
      <strokecolor color="#4f46e5"/>
      <path>
        <move x="10" y="10"/>
        <line x1="90" y1="10"/>
        <line x1="90" y1="90"/>
        <line x1="10" y1="90"/>
        <close/>
        <!-- 圆形 -->
        <ellipse x="30" y="30" w="40" h="40"/>
        <!-- 圆角矩形 -->
        <roundrect x="20" y="20" w="60" h="40" r="5"/>
      </path>
    </foreground>
  </shape>
</shapes>
```

### 6.2 绘制指令参考

```
<shape> 属性:
  name          形状名称（唯一标识）
  w/h           默认宽高
  aspect        "variable"（可变比例）或 "fixed"（固定比例）
  strokewidth   "inherit"（继承样式）或数值

路径指令:
  <move x=".." y=".."/>           移动画笔
  <line x1=".." y1=".."/>         画线到
  <quadratic>                     二次贝塞尔曲线
  <cubic>                         三次贝塞尔曲线
  <arc>                           圆弧
  <rect x=".." y=".." w=".." h=".." r=".."/>  矩形（r=圆角）
  <roundrect>                     同 rect
  <ellipse x=".." y=".." w=".." h=".."/>    椭圆
  <close/>                        闭合路径

样式指令:
  <fillcolor color="..."/>         填充色
  <strokecolor color="..."/>       描边色
  <fillstroke/>                    填充+描边
  <stroke/>                        仅描边
  <nofill/>                        无填充
```

### 6.3 在 .drawio 文件中加载自定义 Stencil

```xml
<mxfile>
  <mxLibrary>
    <!-- 内联 Stencil 定义 -->
    <shapes>
      <shape name="custom-server" aspect="variable">
        <foreground>
          <fillcolor color="#1e293b"/>
          <rect x="10" y="5" w="80" h="90" r="5"/>
          <rect x="25" y="0" w="50" h="10" r="3"/>
          <ellipse cx="50" cy="75" rx="20" ry="20"/>
        </foreground>
      </shape>
    </shapes>
  </mxLibrary>
  <diagram name="Page-1">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Server"
          style="shape=custom-server;image=custom-server;"
          vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="100" height="100" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 7. fireworks-drawio-graph 项目集成方案

### 7.1 当前 shape 映射（已有）

项目 `node-builder.ts` 已支持 28 种形状类型，映射到 draw.io 的 core/JS shapes。

### 7.2 扩展方案

新增两类支持：

**方案 A：自定义 SVG 图标节点（推荐）**

在 `node-builder.ts` 添加新类型：

```typescript
// node-builder.ts
export type NodeShapeType =
  | 'svg-icon'     // 自定义 SVG 内嵌（新增）
  | 'raw'           // 已有
  // ... 现有类型

function shapeTypeToBaseStyle(type: NodeShapeType): string {
  switch (type) {
    case 'svg-icon':
      return 'image;image=${SVG_PLACEHOLDER};'; // 运行时替换
    // ...
  }
}
```

在 `diagram-builder.ts` 中处理 SVG 替换：

```typescript
// diagram-builder.ts
addSvgNode(params: {
  label: string;
  svgContent: string;     // 原始 SVG 字符串
  x: number; y: number;
  width: number; height: number;
  encoding: 'base64' | 'utf8' = 'utf8';
}): string {
  const imageData = this.encodeSvg(params.svgContent, params.encoding);
  const style = `image;image=${imageData};fillColor=none;strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;`;
  return this.addNode({ type: 'raw', label: params.label, x: params.x, y: params.y,
    width: params.width, height: params.height, styleOverrides: { shape: undefined, image: undefined } });
  // 需要直接构建 XML — 暂时搁置
}
```

**方案 B：专用 Icon Node 类（更清晰）**

创建 `icon-node.ts`：

```typescript
// src/builder/icon-node.ts
import { escapeAttrValue } from '../utils/xml-escape.js';

export interface IconNodeOptions {
  label: string;
  svgContent: string;
  x: number;
  y: number;
  width: number;
  height: number;
  encoding?: 'base64' | 'utf8';
  /** 相对 x 偏移（百分比，0-1） */
  labelX?: number;
  labelY?: number;
}

export function encodeSvg(svg: string, encoding: 'base64' | 'utf8'): string {
  if (encoding === 'base64') {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}`;
}

export function buildIconCell(
  id: string,
  opts: IconNodeOptions,
  theme: StyleTheme,
): string {
  const imageUri = encodeSvg(opts.svgContent, opts.encoding ?? 'utf8');
  const fontColor = opts.theme?.textPrimary ?? theme.textPrimary;

  return [
    `    <mxCell id="${id}" value="${escapeAttrValue(opts.label)}"`,
    `      style="image;image=${imageUri};fillColor=none;strokeColor=none;`,
    `verticalLabelPosition=bottom;verticalAlign=top;align=center;`,
    `fontColor=${fontColor};fontSize=${theme.fontSize};"`,
    `      vertex="1" parent="1">`,
    `      <mxGeometry x="${opts.x}" y="${opts.y}" width="${opts.width}" height="${opts.height}" as="geometry"/>`,
    `    </mxCell>`,
  ].join('\n');
}
```

### 7.3 推荐的 icon 图标集合（SVG 源码）

```typescript
// src/icons/ai-icons.ts
// 预定义的 AI/LLM 相关 SVG 图标，可直接嵌入

export const ICONS = {
  llm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="28" fill="url(#g1)"/>
  <circle cx="32" cy="28" r="8" fill="white" opacity="0.9"/>
  <rect x="20" y="38" width="24" height="14" rx="4" fill="white" opacity="0.9"/>
</svg>`,

  agent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="8" y="8" width="48" height="48" rx="8" fill="#1e293b"/>
  <circle cx="24" cy="24" r="4" fill="#22d3ee"/>
  <circle cx="40" cy="24" r="4" fill="#22d3ee"/>
  <path d="M20 40 Q32 50 44 40" stroke="#22d3ee" stroke-width="2" fill="none"/>
</svg>`,

  database: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <ellipse cx="32" cy="16" rx="20" ry="8" fill="#3b82f6"/>
  <path d="M12 16 L12 48 Q12 56 32 56 Q52 56 52 48 L52 16" fill="#3b82f6"/>
  <path d="M12 32 Q12 40 32 40 Q52 40 52 32" fill="none" stroke="white" stroke-opacity="0.5" stroke-width="1"/>
  <ellipse cx="32" cy="16" rx="20" ry="8" fill="none" stroke="#1d4ed8" stroke-width="1"/>
  <ellipse cx="32" cy="32" rx="20" ry="8" fill="none" stroke="white" stroke-opacity="0.5" stroke-width="1"/>
</svg>`,

  tool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="26" fill="none" stroke="#f59e0b" stroke-width="4"/>
  <circle cx="32" cy="32" r="10" fill="#f59e0b"/>
  <rect x="28" y="2" width="8" height="12" rx="2" fill="#f59e0b"/>
  <rect x="28" y="50" width="8" height="12" rx="2" fill="#f59e0b"/>
  <rect x="2" y="28" width="12" height="8" rx="2" fill="#f59e0b"/>
  <rect x="50" y="28" width="12" height="8" rx="2" fill="#f59e0b"/>
</svg>`,

  vectorStore: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="8" y="8" width="48" height="48" rx="4" fill="#10b981"/>
  <line x1="8" y1="20" x2="56" y2="20" stroke="white" stroke-width="2"/>
  <line x1="8" y1="32" x2="56" y2="32" stroke="white" stroke-width="2"/>
  <line x1="8" y1="44" x2="56" y2="44" stroke="white" stroke-width="2"/>
  <line x1="20" y1="8" x2="20" y2="56" stroke="white" stroke-width="2"/>
  <line x1="32" y1="8" x2="32" y2="56" stroke="white" stroke-width="2"/>
  <line x1="44" y1="8" x2="44" y2="56" stroke="white" stroke-width="2"/>
  <circle cx="26" cy="26" r="3" fill="white"/>
  <circle cx="38" cy="38" r="3" fill="white"/>
</svg>`,

  api: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"/>
  <text x="32" y="38" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="monospace">API</text>
</svg>`,

  memory: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="8" y="16" width="48" height="36" rx="4" fill="#ec4899" stroke="#db2777" stroke-width="2"/>
  <rect x="20" y="8" width="24" height="10" rx="3" fill="#db2777"/>
  <line x1="8" y1="26" x2="56" y2="26" stroke="white" stroke-width="1.5" opacity="0.5"/>
  <line x1="8" y1="34" x2="56" y2="34" stroke="white" stroke-width="1.5" opacity="0.5"/>
  <line x1="8" y1="42" x2="56" y2="42" stroke="white" stroke-width="1.5" opacity="0.5"/>
</svg>`,

  cloud: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <path d="M16 44 Q4 44 4 32 Q4 20 16 20 Q18 8 32 8 Q46 8 48 20 Q60 20 60 32 Q60 44 48 44 Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/>
  <circle cx="22" cy="32" r="3" fill="white" opacity="0.8"/>
  <circle cx="32" cy="28" r="3" fill="white" opacity="0.8"/>
  <circle cx="42" cy="32" r="3" fill="white" opacity="0.8"/>
</svg>`,

  function: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="8" y="12" width="48" height="40" rx="4" fill="#f97316" stroke="#ea580c" stroke-width="2"/>
  <text x="32" y="38" text-anchor="middle" fill="white" font-size="11" font-family="monospace">fn()</text>
</svg>`,
} as const;
```

---

## 8. 总结与推荐

### 8.1 方案对比

| 方案 | 复杂度 | 自包含 | 渲染稳定性 | 适用场景 |
|------|--------|--------|-----------|---------|
| 现有 shape 映射 | 低 | ✅ | ✅ | 通用节点（process、decision、database 等） |
| JS 扩展形状 (shape=callout等) | 低 | ✅ | ✅ | 特定语义形状 |
| Stencil 库引用 | 低 | ❌ | ⚠️ | 需要 draw.io 加载对应库 |
| SVG base64 内嵌 | 中 | ✅ | ✅ | 自定义图标（AI/云服务等） |
| Stencil XML 内联 | 高 | ✅ | ⚠️ | 高度定制复用形状 |

### 8.2 最佳实践（针对 TS+Node 项目）

1. **优先使用现有 shape 映射** — 28 种已覆盖绝大多数场景
2. **自定义图标用 SVG UTF-8 内嵌** — 无需 base64 开销，XML 更可读
3. **避免 Stencil URL 引用** — 依赖外部文件，无法保证自包含
4. **图标存储为 TypeScript 常量** — SVG 源码直接嵌入，便于修改主题色
5. **支持主题色替换** — SVG 中使用占位符 `{{COLOR}}`，生成时替换为当前主题色

### 8.3 后续建议

- 新增 `svg-icon` shape type 到 `node-builder.ts`
- 创建 `src/icons/` 目录存放 SVG 图标常量
- 在 `DiagramBuilder` 添加 `addSvgNode()` 方法
- 考虑支持 SVG 占位符替换机制（主题色适配）

---

*调研完成时间: 2025-05-09*
*数据来源: mxGraph 源码分析、draw.io 文档、GitHub jgraph/drawio 仓库*
