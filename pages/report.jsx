// pages/report.jsx
import { useState, useEffect } from 'react'

const incidentOptions = [
  "Abuse Of The Elderly",
  "Active Shooter / Active Threat Responders",
  "Agency Authorized Firearms",
  "Authorized Firearms, Ammunition, Traveling Armed",
  "Bomb Threat Recipient Responsibilities",
  "Bomb Threats And Bomb Emergencies",
  "Chain Of Custody",
  "Child Abuse And Neglect (Including Reporting Hotline)",
  "Child As Offender",
  "Child Care Provider Form",
  "Child Cases",
  "Civil Disturbances And Mass Arrests",
  "Conducting A Child Abuse / Neglect Investigation",
  "Confidentiality Of Child Abuse Investigations",
  "Custody Activities",
  "Death Notification",
  "Discrimination And Sexual Harassment",
  "Documentation Of Traffic Enforcement Activity",
  "Domestic Violence",
  "Drug / Narcotics Detection",
  "Encouraging Follow-Through By DV Victims",
  "Enforcement Of Title 21, Drug Abuse Prevention",
  "Environmental Crimes",
  "In-Custody Deaths",
  "Juvenile Curfew Violation",
  "Mental Fitness For Duty",
  "Missing Or Runaway Juveniles",
  "Off-Duty Incidents",
  "Overdose / Substance Abuse",
  "Prisoner Escape Or Attempted Escape",
  "Protective Custody",
  "School-Related Offenses",
  "Search And Seizure",
  "Sexual Assault",
  "Suicide Threat / Mental Health Crisis",
  "Suspicious Activity",
  "Theft And Burglary",
  "Traffic Collision",
  "Traffic Stop",
  "Trespassing",
  "Unauthorized Possession Of Weapons",
  "Use Of Force",
  "Vandalism / Property Damage",
  "Warrant Execution",
  "Witness Intimidation Or Tampering"
]

export default function ReportPage() {
  const [officerId, setOfficerId] = useState('')
  const [officerName, setOfficerName] = useState('')
  const [incidentType, setIncidentType] = useState('')
  const [location, setLocation] = useState('')
  const [data, setData] = useState('{ "notes": "" }')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadTemplate = async () => {
      if (!incidentType) return
      const filename = incidentType.replace(/\s+/g, '_').replace(/[^\w]/g, '') + '.json'
      try {
        const res = await fetch(`/templates/${filename}`)
        if (!res.ok) throw new Error('Template not found')
        const json = await res.json()
        setData(JSON.stringify(json, null, 2))
      } catch (err) {
        setData('{ "notes": "" }')
      }
    }
    loadTemplate()
  }, [incidentType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: officerId,
          officer_name: officerName,
          incident_type: incidentType,
          location,
          data: JSON.parse(data)
        })
      })
      const result = await res.json()
      setMessage(result.message)
    } catch (err) {
      setMessage('Error submitting report')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tribal Shield: Submit Report</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 600 }}>
        <input placeholder="Officer ID" value={officerId} onChange={e => setOfficerId(e.target.value)} required />
        <input placeholder="Officer Name" value={officerName} onChange={e => setOfficerName(e.target.value)} />
        <select value={incidentType} onChange={e => setIncidentType(e.target.value)} required>
          <option value="">Choose Incident Type</option>
          {incidentOptions.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <input placeholder="Location (lat,lng)" value={location} onChange={e => setLocation(e.target.value)} />
        <textarea rows={8} value={data} onChange={e => setData(e.target.value)} placeholder='{"notes": ""}' />
        <button type="submit">Submit Report</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  )
}
