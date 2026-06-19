import React from 'react';
import { useLocation } from 'react-router-dom';
import InnerHero from '../components/InnerHero';
import JobDetails from '../components/JobDetails';
import Process from '../components/Process';

function JobDetail() {
    const location = useLocation();
    const jobData = location.state?.job;
    const allJobsData = location.state?.allJobs || [];
    const breadcrumbSteps = [
        { label: 'Job', path: '/jobs' },
        { label: jobData?.Title || "Job Details" }
    ];
    return (
        <>
            <InnerHero title={jobData?.Title || "Job Details"} breadcrumbs={breadcrumbSteps} />
            <JobDetails job={jobData} allJobs={allJobsData} />
            <Process />
        </>
    );
}

export default JobDetail;