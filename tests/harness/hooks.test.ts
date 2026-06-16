import { describe, expect, it } from 'vitest';
import { isLocalOnlyPath } from '../../scripts/hooks/local_only_guard.js';
import { isProtectedPath } from '../../scripts/hooks/protected_path_guard.js';

describe('hook guard helpers', () => {
  it('识别受保护路径', () => {
    expect(isProtectedPath('src/components/atoms/PageTitle.ts')).toBe(true);
    expect(isProtectedPath('AGENTS.md')).toBe(true);
    expect(isProtectedPath('examples/decks/basic.deck.yaml')).toBe(false);
  });

  it('识别 local-only 路径', () => {
    expect(isLocalOnlyPath('.env')).toBe(true);
    expect(isLocalOnlyPath('.claude/settings.local.json')).toBe(true);
    expect(isLocalOnlyPath('tmp/agent_logs/local/session.json')).toBe(true);
    expect(isLocalOnlyPath('env/.env.example')).toBe(false);
  });
});
