import React, { useState, useRef } from 'react';

function JobCategories() {
    const sectionRef = useRef(null);
    const jobCategories = [
        {
            "title": "Graphic & Art Design",
            "jobsCount": 200,
            "icon": "Graphic & Art Design.svg"
        },
        {
            "title": "Software Engineering",
            "jobsCount": 500,
            "icon": "Software Engineering.svg"
        },
        {
            "title": "Human Resources",
            "jobsCount": 300,
            "icon": "Human Resources.svg"
        },
        {
            "title": "Production Jobs",
            "jobsCount": 100,
            "icon": "Production Jobs.svg"
        },
        {
            "title": "Sales Executive",
            "jobsCount": 700,
            "icon": "Sales Executive.svg"
        },
        {
            "title": "UI/UX Design",
            "jobsCount": 200,
            "icon": "UIUX Design.svg"
        },
        {
            "title": "Data Entry",
            "jobsCount": 500,
            "icon": "Data Entry.svg"
        },
        {
            "title": "SEO Specialist",
            "jobsCount": 300,
            "icon": "SEO Specialist.svg"
        },
        {
            "title": "Accounting & Finance",
            "jobsCount": 100,
            "icon": "Accounting & Finance.svg"
        },
        {
            "title": "Business Development",
            "jobsCount": 700,
            "icon": "Business Development.svg"
        },
        {
            "title": "IT Support",
            "jobsCount": 100,
            "icon": "IT Support.svg"
        },
        {
            "title": "Content Writing",
            "jobsCount": 200,
            "icon": "Content Writing.svg"
        },
        {
            "title": "Networking",
            "jobsCount": 400,
            "icon": "Networking.svg"
        },
        {
            "title": "Healthcare",
            "jobsCount": 700,
            "icon": "Healthcare.svg"
        },
        {
            "title": "Content Writing",
            "jobsCount": 600,
            "icon": "Content Writings.svg"
        },
        {
            "title": "Graphic & Art Design",
            "jobsCount": 200,
            "icon": "Graphic & Art Design.svg"
        },
        {
            "title": "Software Engineering",
            "jobsCount": 500,
            "icon": "Software Engineering.svg"
        },
        {
            "title": "Human Resources",
            "jobsCount": 300,
            "icon": "Human Resources.svg"
        },
        {
            "title": "Production Jobs",
            "jobsCount": 100,
            "icon": "Production Jobs.svg"
        },
        {
            "title": "Sales Executive",
            "jobsCount": 700,
            "icon": "Sales Executive.svg"
        },
        {
            "title": "UI/UX Design",
            "jobsCount": 200,
            "icon": "UIUX Design.svg"
        },
        {
            "title": "Data Entry",
            "jobsCount": 500,
            "icon": "Data Entry.svg"
        },
        {
            "title": "SEO Specialist",
            "jobsCount": 300,
            "icon": "SEO Specialist.svg"
        },
        {
            "title": "Accounting & Finance",
            "jobsCount": 100,
            "icon": "Accounting & Finance.svg"
        },
        {
            "title": "Business Development",
            "jobsCount": 700,
            "icon": "Business Development.svg"
        },
        {
            "title": "IT Support",
            "jobsCount": 100,
            "icon": "IT Support.svg"
        },
        {
            "title": "Content Writing",
            "jobsCount": 200,
            "icon": "Content Writing.svg"
        },
        {
            "title": "Networking",
            "jobsCount": 400,
            "icon": "Networking.svg"
        },
        {
            "title": "Healthcare",
            "jobsCount": 700,
            "icon": "Healthcare.svg"
        },
        {
            "title": "Content Writing",
            "jobsCount": 600,
            "icon": "Content Writings.svg"
        }
    ]
    const [visibleCount, setVisibleCount] = useState(15);
    const visibleCategories = jobCategories.slice(0, visibleCount);
    const isAllExpanded = visibleCount >= jobCategories.length;
    const handleToggleClick = () => {
        if (isAllExpanded) {
            setVisibleCount(15);

            if (sectionRef.current) {
                sectionRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            setVisibleCount((prevCount) => prevCount + 5);
        }
    };

    return (
        <div className='job_categories' ref={sectionRef}>
            <div className='content-wrapper'>
                <div className='job_categories_title'>
                    <h2>Explore Jobs By Categories</h2>
                    <p>Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide.</p>
                </div>
                <div className='job_categories_section'>
                    {visibleCategories.map((item, index) => (
                        <div className='job_categories_content' key={index}>
                            <div className='job_categories_card'>
                                <div className='job_categories_img'>
                                    <img src={`../src/assets/${item.icon}`} alt={`${item.title} Icon`} />
                                </div>
                                <div className='job_categories_description'>
                                    <h6>{item.title}</h6>
                                    <p>{item.jobsCount} jobs</p>
                                </div>
                            </div>
                        </div>))}
                </div>
                {jobCategories.length > 15 && (
                    <div className='job_categories_actions'>
                        <button className='load_more_btn' onClick={handleToggleClick}>
                            {isAllExpanded ? 'Show Less Categories' : 'Load More Categories'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobCategories;