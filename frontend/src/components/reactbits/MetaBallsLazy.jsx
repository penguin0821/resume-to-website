import { lazy, Suspense } from 'react';
const MetaBalls = lazy(() => import('./MetaBalls'));

export default function MetaBallsLazy(props) {
  return (
    <Suspense fallback={<div className={props.className} style={props.style} />}>
      <MetaBalls {...props} />
    </Suspense>
  );
}
