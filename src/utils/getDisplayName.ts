import React from 'react';

export default function getDisplayName(Component: React.ComponentType) {
  return Component.displayName || Component.name || null;
}
