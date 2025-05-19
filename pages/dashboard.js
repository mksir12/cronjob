import { useEffect, useState } from 'react';
import Router from 'next/router';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    const res = await fetch('/api/jobs', {
      headers: { email, password },
    });

    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  };

  const deleteJob = async (jobId) => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    await fetch('/api/jobs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', email, password },
      body: JSON.stringify({ jobId }),
    });

    fetchJobs();
  };

  useEffect(() => {
    if (!localStorage.getItem('email')) Router.push('/');
    else fetchJobs();
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Cron Jobs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div className="job" key={job.jobId}>
              <h4>{job.title || job.url}</h4>
              <p>Next: {new Date(job.nextExecution * 1000).toLocaleString()}</p>
              <button onClick={() => deleteJob(job.jobId)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
