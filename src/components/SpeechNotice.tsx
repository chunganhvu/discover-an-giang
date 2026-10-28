'use client';

import { useEffect, useState } from 'react';
import { getSpeechStatus, type SpeechStatus } from '@/lib/speech';

/** Explains why there may be no sound (unsupported browser or no English voice installed). */
export default function SpeechNotice({ hasRecordedAudio, failed = false }: { hasRecordedAudio: boolean; failed?: boolean }) {
  const [status, setStatus] = useState<SpeechStatus>('ok');
  useEffect(() => {
    getSpeechStatus().then(setStatus);
  }, []);

  if (hasRecordedAudio || (status === 'ok' && !failed)) return null;
  return (
    <p className="speech-notice" role="alert">
      🔇{' '}
      {status === 'ok'
        ? 'The device did not play any sound. Turn up the volume, check silent mode, or install an English text-to-speech voice. · Thiết bị không phát ra tiếng: hãy tăng âm lượng, tắt chế độ im lặng hoặc cài giọng đọc tiếng Anh.'
        : status === 'unsupported'
        ? 'This browser cannot read words aloud. Open the app in Chrome or Safari (not inside Zalo/Facebook). · Trình duyệt này không đọc được âm thanh; hãy mở bằng Chrome hoặc Safari.'
        : 'No English voice found on this device. Install one in Settings › Text-to-speech. · Thiết bị chưa có giọng đọc tiếng Anh; hãy cài trong Cài đặt › Chuyển văn bản thành giọng nói.'}
    </p>
  );
}
