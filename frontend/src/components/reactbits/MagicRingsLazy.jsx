import { lazy, Suspense } from 'react';
const MagicRings = lazy(() => import('./MagicRings'));

export default function MagicRingsLazy(props) {
  return (
    <Suspense fallback={<div className={props.className} style={props.style} />}>
      <MagicRings {...props} />
    </Suspense>
  );
}
