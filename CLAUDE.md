# svg-icon-baker

svg-icon-baker 是一个在svg sprite场景，构建工具dev/build过程中，基于svgo（v4+）实现将svg转换为symbol并优化的专职工具。

## 用途

- 在svg sprite场景，构建工具dev/build过程中，基于svgo（v4+）实现将svg转换为symbol并优化。
- 转换后的内容，将会被其他编写的vite/webpack等插件工具的处理，将内容注入到html中，以便作为sprite使用。

## 文件

1. `index.ts`：入口文件，导出`bakeIcon`和`Options, BakeSource, BakeResult`类型。
2. `types.ts`：定义`Options, BakeSource, BakeResult`类型。
3. `baker.ts`：功能逻辑实现。

## 函数

1. `bakeIcon`：入口函数，调用配置项处理和svg转换，返回结果。
2. `mergeUserOptions`: 合并用户配置项和默认配置项，返回合并后的配置项。
3. `createSvgoConfig`: 将合并后的配置项转换为svgo配置，返回svgo配置。
4. `convertToSymbol`: 基于svgo配置，将svg转换为symbol，返回转换后的symbol。

## 功能逻辑

1. ID前缀化(prefixIds)：必要。将所有类型的id及其引用，前缀上传入的唯一性名称。
2. viewBox推断(removeDimensions)：必要。推断svg的viewBox，并移除width/height属性。
3. 优化：使用svgo默认的插件预设配置加个别自定义配置，优化svg体积。
4. 将`<svg></svg>`包裹的svg转换为`<symbol></symbol>`，必要。
