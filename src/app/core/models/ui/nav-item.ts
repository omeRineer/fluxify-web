export type NavItem = {
  title: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}