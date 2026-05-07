"use client"

import { useState } from "react"

export default function Form() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState("")
  const [birth_time, setBirthTime] = useState("")
  const [city, setCity] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/save-pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          dob,
          birth_time,
          city,
        }),
      })

      const data = await res.json()

      console.log(data)

      if (data.success) {
        alert("Saved successfully!")
      } else {
        alert("Something went wrong")
      }
    } catch (error) {
      console.error(error)
      alert("Error submitting form")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />

      <input
        placeholder="Birth Time (HH:MM)"
        value={birth_time}
        onChange={(e) => setBirthTime(e.target.value)}
      />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button type="submit">
        Continue to Payment
      </button>
    </form>
  )
}