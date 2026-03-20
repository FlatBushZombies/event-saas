export interface Event {
  id: string
  user_id: string
  title: string
  description?: string
  location?: string
  event_date: string
  created_at: string
  updated_at: string
}

export interface Invite {
  id: string
  event_id: string
  invite_code: string
  attendee_name?: string
  attendee_email?: string
  status: "pending" | "accepted" | "scanned"
  qr_code_data?: string
  accepted_at?: string
  scanned_at?: string
  created_at: string
}

export interface Media {
  id: string
  event_id: string
  uploaded_by: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  caption?: string
  created_at: string
}

export interface Poll {
  id: string
  event_id: string
  question: string
  options: string[]
  is_active: boolean
  created_at: string
}

export interface PollWithVotes extends Poll {
  votes: number[]
  total_votes: number
  user_vote?: number | null
}

export interface PollVote {
  id: string
  poll_id: string
  invite_id: string
  option_index: number
  created_at: string
}

export interface GuestbookEntry {
  id: string
  event_id: string
  invite_id: string
  attendee_name?: string | null
  attendee_email?: string | null
  message: string
  photo_path?: string | null
  created_at: string
  updated_at?: string
}

export interface SeatingTable {
  id: string
  event_id: string
  name: string
  capacity: number
  order_index: number
  pos_x_percent: number
  pos_y_percent: number
  created_at: string
  updated_at?: string
}

export interface SeatingAssignment {
  table_id: string
  invite_id: string
}

export interface SeatingGuest {
  id: string
  invite_code: string
  attendee_name?: string | null
  attendee_email?: string | null
  status: "accepted" | "scanned" | string
  accepted_at?: string | null
  scanned_at?: string | null
  created_at: string
}

export interface SeatingOverviewTable {
  id: string
  name: string
  capacity: number
  pos_x_percent: number
  pos_y_percent: number
  assignedCount: number
}
