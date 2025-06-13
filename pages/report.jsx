import { useState, useEffect } from 'react';

const incidentOptions = [
  "Abuse Of The Elderly",
  "Active Shooter",
  "Agency Authorized Firearms",
  "Authorized Traveling Armed",
  "Bomb Threat Recipient",
  "Bomb Emergencies",
  "Chain Of Custody",
  "Child Abuse Investigation",
  "Child Abuse Neglect",
  "Child As Offender",
  "Child Care Provider Form",
  "Child Cases",
  "Civil Disturbance",
  "DV Follow Through",
  "Custody Activities",
  "Domestic Violence",
  "Drug Detection",
  "Drug Enforcement Title 21",
  "Discrimination And Sexual Harassment",
  "Death Notification",
  "Environmental Crimes",
  "Firearms Authorized",
  "In-Custody Deaths",
  "Juvenile Curfew",
  "Mental Fitness",
  "Missing Juveniles",
  "MMIP",
  "Off-Duty Incidents",
  "Overdose",
  "Prisoner Escape",
  "Protective Custody",
  "School Related Offenses",
  "Search And Seizure",
  "Sexual Assault",
  "Suicide Threat",
  "Suspicious Activity",
  "Theft And Burglary",
  "Traffic Collision",
  "Traffic Enforcement Docs",
  "Traffic Stop",
  "Trespassing",
  "Unauthorized Weapons",
  "Use Of Force",
  "Vandalism",
  "Warrant Execution"
];

export default function ReportPage() {
  const [officerId, setOfficerId] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [data, setData] = useState('{ "notes": "" }');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!incidentType) return;
    const formatted = incidentType.replace(/ /g, '_').replace(/\//g, '').replace(/__/g, '_');
    fetch(`/templates/${formatted}.json`)
      .then(res => res.ok ? res.text() : '{ "notes": "" }')
      .then(setData)
      .catch(() => setData('{ "notes": "" }'));
  }, [incidentType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      });
      const result = await res.json();
      setMessage(result.message);
    } catch (err) {
      setMessage('Failed to submit report');
      console.error(err);
    }
  };

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
        <textarea rows={6} value={data} onChange={e => setData(e.target.value)} />
        <button type="submit">Submit Report</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
