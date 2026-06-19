import React from 'react';
import InnerHero from '../components/InnerHero';
import JobForm from '../components/JobForm';

function JobApply() {
    const breadcrumbSteps = [
        { label: 'Job', path: '/jobs' },
        { label: 'Apply Job' }
    ];
    return (
        <>
            <InnerHero title="Apply Job" breadcrumbs={breadcrumbSteps} />
            <JobForm />
        </>
    );
}

export default JobApply;