import React from 'react';
import InnerHero from '../components/InnerHero';
import JobCategories from '../components/JobCategories';
import Careers from '../components/Careers';

function JobCategory() {
    const breadcrumbSteps = [
        { label: 'Job', path: '/jobs' },
        { label: 'Categories' }
    ];
    return (
        <>
            <InnerHero title="Job Categories" breadcrumbs={breadcrumbSteps} />
            <JobCategories />
            <Careers />
        </>
    );
}

export default JobCategory;