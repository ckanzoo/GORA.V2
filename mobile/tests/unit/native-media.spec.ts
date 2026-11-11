import { afterEach, expect, test, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { mediaError, requestMedia } from '@/utils/live-media';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test('requests only the microphone for voice calls and adds camera only when requested', async () => {
  const stream = {} as MediaStream;
  const getUserMedia = vi.fn().mockResolvedValue(stream);
  vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
  expect(await requestMedia({ audio: true, video: false })).toBe(stream);
  expect(getUserMedia).toHaveBeenLastCalledWith({ audio: true, video: false });
  await requestMedia({ audio: true, video: true });
  expect(getUserMedia).toHaveBeenLastCalledWith({ audio: true, video: true });
});

test('preserves a denied native permission and directs the user to app permissions', async () => {
  vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
  const denied = new DOMException('Denied', 'NotAllowedError');
  vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockRejectedValue(denied) } });
  await expect(requestMedia({ audio: true })).rejects.toBe(denied);
  expect(mediaError(denied)).toContain('Settings > Apps > GORA > Permissions');
});

test('explains missing media support on native devices and insecure web origins', async () => {
  vi.stubGlobal('navigator', {});
  const native = vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
  await expect(requestMedia({ audio: true })).rejects.toThrow('Update Android System WebView');
  native.mockReturnValue(false);
  await expect(requestMedia({ video: true })).rejects.toThrow('HTTPS or localhost');
  expect(mediaError(new DOMException('Denied', 'NotAllowedError'))).toContain('browser settings');
});
