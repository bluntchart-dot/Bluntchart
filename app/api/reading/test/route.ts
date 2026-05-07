import { supabase } from "@/lib/supabase"

export async function GET() {
  const res = await fetch("http://localhost:3000/api/save-reading", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Ishika",
      email: "ishika@test.com",
      dob: "2000-01-01",
      birth_time: "10:30",
      city: "Delhi",
      paymentId: "test_payment_123",
    }),
  })

  const data = await res.json()

  return Response.json(data)
}