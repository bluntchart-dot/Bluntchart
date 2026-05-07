import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, dob, birth_time, city } = body

    const { data, error } = await supabase
      .from("pending_readings")
      .insert([
        {
          name,
          email,
          dob,
          birth_time,
          city,
        },
      ])
      .select()

    if (error) {
      return Response.json({ error: error.message })
    }

    return Response.json({ success: true, data })
  } catch (err) {
    return Response.json({ error: "Something went wrong" })
  }
}