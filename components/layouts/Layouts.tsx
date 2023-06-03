import MainLayout from "./MainLayout";
import StackedLayout from "./StackedLayout";
export const Layouts = {
  Main: MainLayout,
  Stacked: StackedLayout,
};
export type LayoutKeys = keyof typeof Layouts;
