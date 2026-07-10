import { lazy, Suspense } from 'react';
const Orb = lazy(() => import('./Orb'));

export default function OrbLazy(props) {
  return (
    <Suspense fallback={<div className={props.className} style={props.style} />}>
      <Orb {...props} />
    </Suspense>
  );
}
