import React from 'react';
import Banner from '../components/Banner';
import Counter from '../components/Counter';
import Columns from '../components/Columns';
import FeaturedJobs from '../components/FeaturedJobs';
import Process from '../components/Process';
import Careers from '../components/Careers';
import Testimonials from '../components/Testimonials';

function Home() {
    return (
        <>
            <Banner />
            <Counter />
            <Columns />
            <FeaturedJobs />
            <Process />
            <Careers />
            <Testimonials />
        </>
    );
}

export default Home;