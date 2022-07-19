/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

function setup() {
    const app = render(<App />);
    return { app };
}

describe('App', () => {
  it('renders without crashing', () => {
    setup();
  });
});
