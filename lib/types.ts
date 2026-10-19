/** 프로필 */
export interface Profile {
  id: string;
  display_name: string;
}

/** 이벤트 목록/카드용 */
export interface EventSummary {
  id: string;
  host_id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  capacity: number | null;
  host_name: string;
  participant_count: number;
}

/** 참여자 */
export interface Participant {
  user_id: string;
  display_name: string;
  joined_at: string;
}

/** 이벤트 상세 */
export interface EventDetail extends EventSummary {
  participants: Participant[];
}

/** Server Action 결과 */
export interface ActionState {
  error?: string;
  message?: string;
}
