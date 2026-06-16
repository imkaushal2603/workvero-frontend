import React from 'react';
import InnerHero from '../components/InnerHero';
import Careers from '../components/Careers';

function JobCategory() {
    const breadcrumbSteps = [
        { label: 'Job', path: '/jobs' },
        { label: 'Categories' }
    ];
    return (
        <>
            <InnerHero title="Job Categories" breadcrumbs={breadcrumbSteps} />
            <Careers />
        </>
    );
}

export default JobCategory;