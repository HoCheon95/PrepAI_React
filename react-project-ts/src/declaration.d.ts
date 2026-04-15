// src/declaration.d.ts
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
// src/declaration.d.ts
declare module "*.js" {
  const content: { [className: string]: string };
  export default content;
}