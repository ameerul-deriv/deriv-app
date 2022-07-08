export const getFormattedDateString = (date_obj, is_local = false, has_seconds = false) => {
    if (!(date_obj instanceof Date)) {
        throw Error('getFormattedDateString argument needs an instance of Date');
    }

    const date_string = is_local ? date_obj.toString().split(' ') : date_obj.toUTCString().split(' ');
    const [, month, day, year, time] = date_string;
    const times = time.split(':');

    // Return time in the format "HH:mm:ss". e.g.: "01 Jan 1970 21:01:11"
    if (!has_seconds) {
        times.pop();
    }

    const time_without_sec = times.join(':');

    // Return in the format "DD MMM YYYY HH:mm". e.g.: "01 Jan 1970 21:01"
    return `${day} ${month} ${year}, ${time_without_sec}`;
};

export const getExpiryTime = epoch_string => {
    if (typeof epoch_string !== 'string') {
        throw Error('getExpiryTime argument needs a string');
    }

    // get current date, minus with order purchased date to get total
    // hours since the order was created to current date
    const expiryTime = Math.abs(new Date() - new Date(epoch_string)) / 36e5;

    return expiryTime;
};

export const convertToMillis = epoch => {
    if (typeof epoch !== 'number') {
        throw Error('getLocalEpoch argument needs a number');
    }

    const milliseconds = epoch * 1000;
    return milliseconds;
};

// add 0 and slice(-2) to get a 0 in front if it's a single digit so we can maintain double digits
// otherwise it will slice off the 0 and still result in double digits
const toDoubleDigits = number => `0${number}`.slice(-2);

export const secondsToTimer = distance => {
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${toDoubleDigits(hours)}:${toDoubleDigits(minutes)}:${toDoubleDigits(seconds)}`;
};
