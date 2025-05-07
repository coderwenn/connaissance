// 路由类型 
export type Route = {
  path: string;
  component: any;
  children?: Route[];
};