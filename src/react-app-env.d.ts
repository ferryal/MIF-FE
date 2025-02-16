/// <reference types="react-scripts" />

declare module "*.module.scss";
declare module "*.module.css";

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
