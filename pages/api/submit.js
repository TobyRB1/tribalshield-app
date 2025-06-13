import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { officer_id, officer_name, incident_type, location, data } = req.body

  const { error } = await supabase.from('reports').insert([
    { officer_id, officer_name, incident_type, location, data }
  ])

  if (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to submit report' })
  }

  return res.status(200).json({ message: 'Report submitted successfully' })
}
