import { type Node, type NodeProps } from '@xyflow/react';
 
export const SLIDE_WIDTH = 500;
export const SLIDE_HEIGHT = 300;
 
export type SlideNode = Node<SlideData, 'slide'>;
 
export type SlideData = {
    source: string;
    left?: string;
    up?: string;
    down?: string;
    right?: string;
};
 
const style = {
  width: `${SLIDE_WIDTH}px`,
  height: `${SLIDE_HEIGHT}px`,
} satisfies React.CSSProperties;
 
export function Slide({ data }: NodeProps<SlideNode>) {
  return (
    <article className="slide nodrag" style={style}>
      <div>Hello, React Flow!</div>
    </article>
  );
}