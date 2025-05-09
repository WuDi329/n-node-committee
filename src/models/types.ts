//types.ts
// PBFT消息类型枚举
export enum MessageType {
  PrePrepare = 'prePrepare',
  Prepare = 'prepare',
  Commit = 'commit',
  StatusUpdate = 'statusUpdate',
  SupplementaryReady = 'SupplementaryReady', // 新增：补充证明就绪消息
  SupplementaryAck = 'SupplementaryAck', // 新增：补充证明确认消息
}

export enum ConsensusType {
  Normal = 'normal',
  Conflict = 'conflict',
}

// 节点状态枚举
export enum NodeState {
  Normal = 'normal',
  ViewChange = 'viewChange',
}

// 共识状态枚举
export enum ConsensusState {
  Idle = 0,
  PrePrepared = 1,
  Prepared = 2,
  Committed = 3,
}

// 任务处理状态枚举
export enum TaskProcessingState {
  Pending = 'PENDING', // 待处理
  Validating = 'VALIDATING', // 验证进行中
  Verified = 'VERIFIED', // 验证通过
  Consensus = 'CONSENSUS', // 已达成共识
  Rejected = 'REJECTED', // 快速验证失败
  Conflict = 'CONFLICT', // 验证冲突
  Expired = 'EXPIRED', // 已过期
  Finalized = 'FINALIZED', // 共识完成且已上链
  AwaitingSupplementary = 'AWAITING_SUPPLEMENTARY', // 等待补充验证
  NeedsManualReview = 'NEEDS_MANUAL_REVIEW', // 需要人工审核
  Validated = 'VALIDATED',
  Failed = 'FAILED', // 补充验证失败
}

// 任务状态接口
export interface TaskStatus {
  taskId: string; // 任务ID
  state: TaskProcessingState; // 当前状态
  proofCount: number; // 已收到的证明数量
  verifierIds: string[]; // 提交证明的验证者ID列表
  createdAt: string; // 首次收到证明的时间
  updatedAt: string; // 最后更新时间
  isSupplementaryVerification?: boolean; // 是否处于补充验证阶段
  supplementaryVerifierIds?: string[]; // 补充验证者ID列表
  validationInfo?: {
    // 验证信息(可选)
    quickValidationPassed?: boolean; // 快速验证是否通过
    deepValidationPassed?: boolean; // 深度验证是否通过
    conflictType?: 'structural' | 'score' | 'none'; // 冲突类型
    conflictDetails?: any; // 冲突详情(如果有)
    resolvedResult?: ValidationResult; // 冲突解决结果

    supplementaryRequestTime?: string; // 补充验证请求的时间
    supplementaryRequested?: boolean; // 是否已发送补充验证请求
    timeoutReason?: string; // 超时或失败原因（如果有）
    supplementaryResult?: any; // 补充验证的结果信息
    errorMessage?: string;
  };
  result?: {
    // 结果信息(可选)
    reason?: string; // 结果原因(尤其是拒绝原因)
    consensusTimestamp?: string; // 共识达成时间
    txHash?: string; // 上链交易哈希
  };
}

// PBFT消息接口
export interface PBFTMessage {
  type: MessageType;
  consensusType: ConsensusType;
  viewNumber?: number;
  sequenceNumber?: number;
  nodeId: string;
  taskId: string;
  data?: any; // QoS证明数据
  digest?: string; // 数据哈希
  signature: string; // 节点签名
}

// 添加新的消息接口结构（如果需要）
export interface SupplementaryReadyMessage {
  type: 'SupplementaryReady';
  taskId: string;
  supplementaryProofId: string; // 补充证明的ID
  nodeId: string; // 发送节点ID
  timestamp: number; // 时间戳
  signature: string; // 签名
}

export interface SupplementaryAckMessage {
  type: 'SupplementaryAck';
  taskId: string;
  supplementaryProofId: string; // 确认的补充证明ID
  nodeId: string; // 发送节点ID
  timestamp: number; // 时间戳
  signature: string; // 签名
}

// QoS验证结果接口
// 在 ValidationResult 接口中添加 conflictType 和其他必要字段
export interface ValidationResult {
  isValid: boolean;
  hasConflict?: boolean; // 是否存在验证冲突
  conflictingVerifiers?: string[]; // 冲突验证者ID列表
  conflictType?: 'structural' | 'score' | 'none'; // 冲突类型
  needsManualReview?: boolean; // 是否需要人工审核
  resolvedBy?: 'majority' | 'statistical' | 'manual'; // 冲突解决方式
  details?: any;
}

export interface ValidationConflict {
  metric: string;
  values: {
    verifierId: string;
    value: any;
  }[];
  maxDifference: number;
  threshold: number;
  conflictReason: string;
}

// QoS证明数据结构
export interface QoSProof {
  id?: string; // 证明唯一标识符（添加这个字段）
  taskId: string; // 任务标识符
  verifierId: string; // 验证者标识符
  timestamp: number; // 时间戳
  mediaSpecs: any; // 媒体规格（编码格式、分辨率、码率等）
  videoQualityData: {
    // 视频质量数据
    overallScore: number; // 总体评分
    gopScores: GopScore[];
    // 其他可能的视频质量字段
  };
  audioQualityData?: any; // 音频质量数据（可选）
  syncQualityData?: any; // 音视频同步性数据（可选）
  signature: string; // 签名
}

// 通用补充证明消息类型
export type SupplementaryMessage = SupplementaryReadyMessage | SupplementaryAckMessage;

// 以下为日志数据及相关类型枚举

// 在 models/types.ts 中添加

// 事件类型枚举
export enum EventType {
  // 系统事件
  SYSTEM_START = 'system_start',
  SYSTEM_STOP = 'system_stop',

  // 任务事件
  TASK_CREATED = 'task_created',
  TASK_STARTED = 'task_started',
  TASK_COMPLETED = 'task_completed',
  TASK_FAILED = 'task_failed',

  // 证明相关事件
  PROOF_RECEIVED = 'proof_received',
  PROOF_VALIDATED = 'proof_validated',
  PROOF_REJECTED = 'proof_rejected',
  PROOF_CONFLICT = 'proof_conflicted',

  // PBFT共识事件
  PREPREPARE_SENT = 'preprepare_sent',
  PREPREPARE_RECEIVED = 'preprepare_received',
  PREPARE_SENT = 'prepare_sent',
  PREPARE_RECEIVED = 'prepare_received',
  COMMIT_SENT = 'commit_sent',
  COMMIT_RECEIVED = 'commit_received',

  // 共识状态事件
  CONSENSUS_STARTED = 'consensus_started',
  CONSENSUS_REACH_NORMAL = 'normal_consensus_reached',
  CONSENSUS_REACH_CONFLICT = 'conflict_consensus_reached',
  CONSENSUS_REACH_FINAL = 'final_consensus_reached',
  CONSENSUS_START_FINAL = 'final_consensus_started',
  CONSENSUS_FAILED = 'consensus_failed',

  // 冲突处理事件
  CONFLICT_DETECTED = 'conflict_detected',
  SUPPLEMENTARY_PROOF_REQUESTED = 'supplementary_proof_requested',
  SUPPLEMENTARY_PROOF_RECEIVED = 'supplementary_proof_received',
}

// 事件数据接口
export interface BaseEventData {
  id?: string;
  taskId?: string;
  nodeId?: string;
  timestamp: number;
  eventType: EventType;
  metadata?: Record<string, any>; // 通用元数据，保持灵活性
}

// 验证相关事件接口
export interface ValidationEventData extends BaseEventData {
  eventType: EventType.PROOF_VALIDATED | EventType.PROOF_REJECTED | EventType.PROOF_CONFLICT;
  validationResult: {
    isValid: boolean;
    hasConflict?: boolean;
    conflictType?: string;
    details?: any;
    proofCount?: number;
    verifierIds?: string[];
  };
}

export interface ConsensusEventData extends BaseEventData {
  eventType:
    | EventType.CONSENSUS_STARTED
    | EventType.CONSENSUS_FAILED
    | EventType.CONSENSUS_REACH_NORMAL
    | EventType.CONSENSUS_REACH_CONFLICT
    | EventType.CONSENSUS_REACH_FINAL
    | EventType.CONSENSUS_START_FINAL;
  ConsensusResult: {
    // hasConflict: boolean;
  };
}

// 联合类型 - 所有可能的事件类型
export type EventData = BaseEventData | ValidationEventData | ConsensusEventData;
// export interface EventData {
//   id?: string; // 事件ID (自动生成)
//   taskId?: string; // 相关任务ID (可选)
//   nodeId?: string; // 节点ID (可选)
//   timestamp: number; // 精确时间戳
//   eventType: EventType; // 事件类型
//   metadata?: any; // 附加信息
// }

// 时间点数据接口 (兼容旧API)
export interface TimePoints {
  [key: string]: number;
}

// 任务指标接口 (兼容旧API)
export interface TaskMetrics {
  taskId: string;
  taskType: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timePoints: TimePoints;
  error?: string;
  taskResults?: any;
}

// near 相关结构体

// 任务数据结构
export interface TaskData {
  task_id: string;
  broadcaster_id: string;
  source_ipfs: string;
  requirements: TranscodingRequirement;
  status: TaskStatus;
  assigned_worker?: string;
  assignment_time?: number;
  result_ipfs?: string;
  completion_time?: number;
  assigned_verifiers: string[];
  qos_proof_id?: string;
  publish_time: number;
  hw_acceleration_preferred: boolean;

  keyframe_timestamps?: string[];
  selected_gops?: string[];

  video_duration?: number;
  frame_count?: number;
}

// 转码要求结构
export interface TranscodingRequirement {
  target_codec: string;
  target_resolution: string;
  target_bitrate: string;
  target_framerate: string;
  additional_params: string;
}

// 验证者质量证明
export interface VerifierQosProof {
  id: string;
  task_id: string;
  verifier_id: string;
  timestamp: number;
  video_specs: VideoSpecification;
  video_score: number;
  gop_scores: GopScore[];
  audio_score?: number;
  sync_score?: number;
  signature: string;
}

// 视频规格
export interface VideoSpecification {
  codec: string;
  resolution: string;
  bitrate: number;
  framerate: number;
}

// GOP分数
export interface GopScore {
  timestamp: string;
  vmaf_score: number;
  hash: string;
}

// 任务验证状态
export interface TaskVerificationStatus {
  task_id: string;
  verified_by: string[];
  verification_timestamps: number[];
}

// 共识QoS质量证明结构
export interface ConsensusQosProof {
  // 基本信息
  task_id: string; // 任务ID
  worker_id: string; // 工作节点ID
  timestamp: number; // 时间戳

  // 委员会信息
  // committee_members: string[]; // 参与共识的委员会成员
  committee_leader: string; // 提交共识结果的委员会leader

  // 质量分数
  video_score: number; // VMAF分数
  audio_score: number; // PESQ分数
  sync_score: number; // 同步性分数

  // 视频信息
  encoding_start_time: number; // 编码开始时间
  encoding_end_time: number; // 编码结束时间
  video_specs: VideoSpecification; // 视频规格
  frame_count: number;

  // GOP验证
  specified_gop_scores: GopScore[]; // 特定GOP分数
  gop_verification: GopVerificationResult; // GOP验证结果

  // 状态
  status: QosProofStatus; // 状态（可以保留，虽然默认是已验证）
}

export enum GopVerificationResult {
  Verified = 'Verified',
  ScoreMismatch = 'ScoreMismatch',
  GopMismatch = 'GopMismatch',
  UndeterminedError = 'UndeterminedError',
}

// export enum GopVerificationResult {
//   Verified = 0, // 已验证
//   ScoreMismatch = 1, // 分数不匹配
//   GopMismatch = 2, // GOP不匹配
//   UndeterminedError = 3, // 无法确定错误
// }

// export enum QosProofStatus {
//   Pending = 0, // 待处理
//   Normal = 1, // 正常
//   Conflict = 2, // 冲突
//   Manual = 3, // 人工审核
// }
export enum QosProofStatus {
  Pending = 'Pending',
  Normal = 'Normal',
  Conflict = 'Conflict',
  Manual = 'Manual',
}

// committee相关配置
export interface CommitteeConfig {
  nearConfig: {
    networkId: string;
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
    explorerUrl: string;
  };
  contractId: string;
  leaderAccountId: string;
  credentialsPath: string;
  ipfsConfig: {
    host: string;
    port: number;
    protocol: string;
  };
  proxyUrl: string;
  pollingInterval: number;
  consensusTimeout: number;
  supplementaryTimeout: number;
  logLevel: string;
}
