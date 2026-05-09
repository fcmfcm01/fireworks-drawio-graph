export type {
  StencilShapeVariant,
  StencilShapeDef,
  StencilGroupDef,
  StencilLibraryDef,
  StencilNodeInput,
  StencilGroupInput,
} from './types.js';

export {
  registerLibrary,
  getLibrary,
  getLibraryOrThrow,
  getLibraryIds,
  getAllLibraries,
  resolveStencilStyle,
  resolveGroupStyle,
  getStencilShapeNames,
  getStencilCategories,
} from './registry.js';

export { buildRawStencilStyle } from '../builder/stencil-node.js';

// Register all built-in stencil libraries
import '../stencils/catalogs/aws4.js';
import '../stencils/catalogs/azure.js';
import '../stencils/catalogs/gcp.js';
import '../stencils/catalogs/alibaba.js';
import '../stencils/catalogs/kubernetes.js';
import '../stencils/catalogs/cisco.js';
import '../stencils/catalogs/uml.js';
import '../stencils/catalogs/bpmn.js';
