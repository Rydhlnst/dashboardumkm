declare module "react-simple-maps" {
  import * as React from "react";

  export interface ComposableMapProps extends React.SVGProps<SVGSVGElement> {
    projection?: string | ((...args: unknown[]) => unknown);
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
      parallels?: [number, number];
    };
    width?: number;
    height?: number;
  }
  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface GeographyLike {
    rsmKey: string;
    properties: Record<string, unknown>;
  }
  export interface GeographiesProps {
    geography: string | object;
    children: (args: { geographies: GeographyLike[] }) => React.ReactNode;
  }
  export const Geographies: React.FC<GeographiesProps>;

  export interface GeographyProps extends Omit<React.SVGProps<SVGPathElement>, "style"> {
    geography: GeographyLike;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }
  export const Geography: React.FC<GeographyProps>;

  export interface MarkerProps extends React.SVGProps<SVGGElement> {
    coordinates: [number, number];
  }
  export const Marker: React.FC<MarkerProps>;

  export interface ZoomableGroupProps extends React.SVGProps<SVGGElement> {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
  }
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
}
