import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email, paymentId, product_id } = body

    // 1. GET USER DATA FROM pending_readings
    const { data: pending, error: pendingError } = await supabase
      .from("pending_readings")
      .select("*")
      .eq("email", email)
      .single()

    if (pendingError || !pending) {
      return Response.json({ error: "No pending data found" })
    }

    const { name, dob, birth_time, city } = pending

    // 2. UPSERT USER (avoid duplicates)
    const { data: user } = await supabase
      .from("users")
      .upsert([{ email, name }], { onConflict: "email" })
      .select()
      .single()

    // 3. GENERATE READING (still fake for now)
    const reading_json = {
      summary: "You overthink everything and call it intuition.",
      love: "You chase people who confuse you.",
      career: "You delay decisions and blame timing.",
    }

    // 4. SAVE READING
    await supabase.from("readings").insert([
      {
        user_id: user.id,
        dob,
        birth_time,
        city,
        reading_json,
      },
    ])

    // 5. SAVE PAYMENT (GUMROAD)
    await supabase.from("payments").insert([
      {
        user_id: user.id,
        gumroad_payment_id: paymentId,
        product_id,
        amount: 1200,
        status: "paid",
      },
    ])

    // 6. DELETE FROM PENDING
    await supabase
      .from("pending_readings")
      .delete()
      .eq("email", email)

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Something went wrong" })
  }
}