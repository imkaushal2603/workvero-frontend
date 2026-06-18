import React from 'react';
import InnerHero from '../components/InnerHero';
import JobListings from '../components/JobListings';

function JobListing() {
    const breadcrumbSteps = [
        { label: 'Job Listing' }
    ];
    return (
        <>
            <InnerHero title="Job Listing" breadcrumbs={breadcrumbSteps} />
            <JobListings />
        </>
    );
}

export default JobListing;