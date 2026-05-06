import { useRef, useCallback } from 'react';
import { useDrag } from '@use-gesture/react';

interface ScratchGestureOptions {
  onScratchForward: () => void;
  onScratchBackward: () => void;
  onScratchStart: () => void;
  onScratchEnd: () => void;
  onAngleChange: (angleDelta: number) => void;
}

/**
 * useScratchGesture — Tracks circular drag on the vinyl record to calculate
 * angular displacement. Clockwise = forward, counter-clockwise = backward.
 */
export function useScratchGesture(
  containerRef: React.RefObject<HTMLElement | null>,
  options: ScratchGestureOptions
) {
  const lastAngleRef = useRef(0);
  const cumulativeRef = useRef(0);
  const thresholdDeg = 30; // degrees before triggering forward/backward

  const getAngle = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    },
    [containerRef]
  );

  const bind = useDrag(
    ({ first, last, xy: [x, y], memo }) => {
      const angle = getAngle(x, y);

      if (first) {
        lastAngleRef.current = angle;
        cumulativeRef.current = 0;
        options.onScratchStart();
        return angle;
      }

      // Calculate delta (handle wraparound at ±180)
      let delta = angle - lastAngleRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      cumulativeRef.current += delta;
      lastAngleRef.current = angle;

      // Notify of angle change for audio pitch
      options.onAngleChange(delta);

      // Check thresholds for photo navigation
      if (cumulativeRef.current > thresholdDeg) {
        options.onScratchForward();
        cumulativeRef.current = 0;
      } else if (cumulativeRef.current < -thresholdDeg) {
        options.onScratchBackward();
        cumulativeRef.current = 0;
      }

      if (last) {
        options.onScratchEnd();
        cumulativeRef.current = 0;
      }

      return memo;
    },
    {
      pointer: { touch: true },
      preventDefault: true,
      filterTaps: true,
    }
  );

  return { bind };
}
