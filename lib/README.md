# 简历编辑器三层架构

本项目采用三层架构设计，将简历编辑功能分为数据编辑层、数据中间层和数据导出层，确保代码的可维护性、可扩展性和类型安全性。

## 架构概览

```
┌─────────────────────┐
│    数据编辑层        │  ← 用户界面和数据输入
│  (data-edit-layer)  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    数据中间层        │  ← 数据转换和样式应用
│(data-transform-layer)│
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    数据导出层        │  ← PDF生成和导出
│ (data-export-layer) │
└─────────────────────┘
```

## 层级说明

### 1. 数据编辑层 (data-edit-layer)

**职责**: 提供可复用的数据编辑组件，处理用户输入和表单验证。

**主要功能**:
- 动态表单生成
- 字段验证和错误处理
- 多种编辑器组件（文本、选择、日期、数组等）
- 预设表单配置

**核心组件**:
```typescript
import {
  DynamicForm,
  FormBuilder,
  FieldPresets,
  FormPresets
} from './data-edit-layer';

// 创建表单配置
const formConfig = FormPresets.personalInfo();

// 渲染动态表单
<DynamicForm
  config={formConfig}
  data={formData}
  onChange={handleChange}
/>
```

### 2. 数据中间层 (data-transform-layer)

**职责**: 根据预设模板将原始数据转换为带样式的结构化数据。

**主要功能**:
- 简历模板管理
- 数据验证和转换
- 样式配置应用
- 多种预设模板（现代、经典、创意等）

**核心组件**:
```typescript
import {
  ResumeDataTransformer,
  modernTemplate,
  getTemplateById
} from './data-transform-layer';

// 创建转换器
const transformer = new ResumeDataTransformer();

// 转换数据
const result = await transformer.transform(
  resumeData,
  'modern',
  { optimize: true }
);
```

### 3. 数据导出层 (data-export-layer)

**职责**: 将样式化数据转换为符合PDFMake规则的文档定义并生成PDF。

**主要功能**:
- PDF文档生成
- 异步导出队列
- 缓存管理
- 多种导出选项

**核心组件**:
```typescript
import {
  exportToPDF,
  exportToPDFAsync,
  ExportPresets
} from './data-export-layer';

// 同步导出
const result = await exportToPDF(styledData, ExportPresets.highQuality);

// 异步导出
const taskId = await exportToPDFAsync(styledData);
```

## 快速开始

### 1. 基本使用

```typescript
import { ResumeEditor } from './integration-example';

// 创建编辑器实例
const editor = new ResumeEditor('modern');

// 准备表单数据
const formData = {
  fullName: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  // ... 其他字段
};

// 导出PDF
const result = await editor.exportToPDF(formData);

if (result.success) {
  console.log('PDF导出成功');
  // 处理导出结果
} else {
  console.error('导出失败:', result.errors);
}
```

### 2. React组件使用

```typescript
import { ResumeEditorComponent } from './integration-example';

function App() {
  const handleExport = (result) => {
    if (result.success) {
      // 下载PDF或显示成功消息
      const blob = new Blob([result.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url);
    }
  };

  const handleAsyncExport = (taskId) => {
    console.log('异步导出任务ID:', taskId);
    // 可以定期检查任务状态
  };

  return (
    <ResumeEditorComponent
      onExport={handleExport}
      onAsyncExport={handleAsyncExport}
      templateId="modern"
    />
  );
}
```

### 3. 自定义表单配置

```typescript
import { FormBuilder, FieldPresets } from './data-edit-layer';

// 创建自定义表单
const builder = new FormBuilder('custom-form', '自定义简历表单');

builder.addSection('basic', '基本信息', [
  FieldPresets.text('name', '姓名', { required: true }),
  FieldPresets.email('email', '邮箱', { required: true }),
  FieldPresets.textarea('bio', '个人简介', { rows: 4 })
]);

const customConfig = builder.build();
```

### 4. 自定义模板

```typescript
import { createCustomTemplate, TemplateUtils } from './data-transform-layer';

// 创建自定义模板
const customTemplate = createCustomTemplate({
  id: 'my-template',
  name: '我的模板',
  description: '自定义简历模板',
  style: {
    fonts: {
      primary: 'Arial',
      sizes: { h1: 24, h2: 18, body: 12 }
    },
    colors: {
      primary: '#2c3e50',
      secondary: '#3498db',
      text: '#2c3e50'
    }
  },
  layout: {
    type: 'single-column',
    sections: ['personal', 'experience', 'education', 'skills']
  }
});

// 注册模板
registerTemplate(customTemplate);
```

## 配置选项

### 导出选项

```typescript
const exportOptions = {
  format: 'pdf',
  pageSize: 'A4',
  pageOrientation: 'portrait',
  compress: true,
  optimizeForPrint: true,
  quality: 'high'
};
```

### 转换选项

```typescript
const transformOptions = {
  optimize: true,
  includeMetadata: true,
  customStyles: {
    // 自定义样式覆盖
  }
};
```

## 错误处理

所有层级都提供统一的错误处理机制：

```typescript
const result = await editor.exportToPDF(formData);

if (!result.success) {
  result.errors?.forEach(error => {
    console.error(`错误 [${error.code}]: ${error.message}`);
    
    switch (error.type) {
      case 'validation':
        // 处理验证错误
        break;
      case 'processing':
        // 处理处理错误
        break;
      case 'system':
        // 处理系统错误
        break;
    }
  });
}
```

## 性能优化

### 1. 缓存机制

```typescript
import { getExportManager } from './data-export-layer';

// 配置缓存
const manager = getExportManager({
  enableCache: true,
  cacheSize: 100,
  cacheTTL: 5 * 60 * 1000 // 5分钟
});
```

### 2. 异步导出

```typescript
// 对于大型简历，使用异步导出
const taskId = await editor.exportToPDFAsync(formData);

// 监听任务状态
const checkStatus = () => {
  const status = editor.getExportTaskStatus(taskId);
  
  if (status?.status === 'completed') {
    console.log('导出完成');
  } else if (status?.status === 'processing') {
    console.log(`进度: ${status.progress}%`);
    setTimeout(checkStatus, 1000);
  }
};

checkStatus();
```

### 3. 数据验证

```typescript
// 在导出前验证数据
const validation = editor.validateFormData(formData);

if (!validation.isValid) {
  console.error('数据验证失败:', validation.errors);
  return;
}
```

## 扩展指南

### 1. 添加新的编辑器组件

```typescript
// 在 data-edit-layer/components.tsx 中添加
export const CustomFieldEditor: React.FC<FieldEditorProps> = ({
  config,
  value,
  onChange,
  error
}) => {
  // 自定义编辑器实现
};
```

### 2. 创建新的模板

```typescript
// 在 data-transform-layer/templates.ts 中添加
export const newTemplate: ResumeTemplate = {
  id: 'new-template',
  name: '新模板',
  // ... 模板配置
};
```

### 3. 扩展导出格式

```typescript
// 在 data-export-layer/core.ts 中扩展
export class CustomRenderer implements PDFRenderer {
  // 实现自定义渲染器
}
```

## 类型安全

项目全程使用TypeScript，确保类型安全：

```typescript
// 所有接口都有完整的类型定义
interface ResumeData {
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  // ...
}

// 编译时类型检查
const data: ResumeData = {
  // TypeScript会检查所有必需字段
};
```

## 测试

```bash
# 运行构建测试
npm run build

# 检查类型
npm run type-check
```

## 故障排除

### 常见问题

1. **构建错误**: 确保所有依赖已安装且版本兼容
2. **类型错误**: 检查导入路径和类型定义
3. **PDF生成失败**: 验证数据格式和模板配置
4. **性能问题**: 使用异步导出和缓存机制

### 调试技巧

```typescript
// 启用详细日志
const manager = getExportManager({
  enableLogging: true,
  logLevel: 'debug'
});

// 验证数据
const validation = validateResumeData(data);
console.log('数据验证结果:', validation);
```

## 贡献指南

1. 遵循现有的代码风格和架构模式
2. 添加适当的类型定义
3. 编写单元测试
4. 更新相关文档
5. 确保构建通过

## 许可证

[项目许可证信息]