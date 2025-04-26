// src/utils/proof-utils.ts

import { GopScore, QoSProof, VerifierQosProof } from '../models/types';

// 生成测试证明
export function generateTestProof(taskId: string, verifierId: string): VerifierQosProof {
  let gopexample: GopScore = {
    timestamp: '0.00',
    vmaf_score: 92,
    hash: 'aivoianvioahnvoavboaiu',
  };
  return {
    id: 'lalal1',
    gop_scores: [gopexample],
    task_id: taskId,
    verifier_id: verifierId,
    timestamp: Date.now(),
    video_specs: {
      codec: 'H.264',
      resolution: '1920x1080',
      bitrate: 5000,
      framerate: 30,
    },
    video_score: 92,
    audio_score: 4.3,
    sync_score: 0.0,
    signature: 'test-signature-' + verifierId,
  };
}

// 生成冲突证明
export function generateConflictingProof(
  taskId: string,
  verifierId: string,
  conflictType: 'codec' | 'score'
): VerifierQosProof {
  const proof = generateTestProof(taskId, verifierId);

  if (conflictType === 'codec') {
    proof.video_specs.codec = 'H.265'; // 不同的编码格式
  } else if (conflictType === 'score') {
    proof.video_score = 76; // 相差超过阈值
  }

  return proof;
}
