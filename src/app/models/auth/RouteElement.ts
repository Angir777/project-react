/**
 * Model od elementu routingu
 */
export class RouteElement {
  path!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element: any | null = null;
  permissions: string[] = [];
}
