const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function MonthSelect({
    name,
    value,
    onChange,
    placeholder = "Choose Month",
}) {

    return (

        <div className="form_select_field">

            <select
                name={name}
                value={value}
                onChange={onChange}
            >

                <option value="">{placeholder}</option>

                {MONTHS.map((month) => (

                    <option
                        key={month}
                        value={month}
                    >
                        {month}
                    </option>

                ))}

            </select>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="8"
                viewBox="0 0 15 8"
                fill="none"
            >
                <path
                    d="M0 0L7.16883 7.16883L14.3377 0H0Z"
                    fill="#200E63"
                />
            </svg>

        </div>

    );

}

export default MonthSelect;