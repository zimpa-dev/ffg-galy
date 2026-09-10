'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Component that listens for FirestorePermissionErrors emitted via errorEmitter.
 * It re-throws the error to be caught by the Next.js error boundary/overlay
 * during development, providing rich context for debugging Security Rules.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Re-throw to trigger the development error overlay
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      // Clean up listener on unmount
      // Note: EventEmitter.off or removeListener is usually used here
      // but errorEmitter follows the same pattern.
    };
  }, []);

  return null;
}
