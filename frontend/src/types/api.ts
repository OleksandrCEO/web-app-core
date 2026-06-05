// All API TypeScript interfaces live here. Group by entity.
// Convention: mirror backend Pydantic schemas — `*Read`, `*Create`, `*Update`.

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}

// Example — uncomment and adapt as you add entities:
// export interface UserRead {
//   id: string
//   email: string
//   created_at: string
// }
