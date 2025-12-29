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
