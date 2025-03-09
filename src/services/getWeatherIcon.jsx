// src/utils/getWeatherIcon.js

import { Icon } from '@iconify/react';

const getWeatherIcon = (weather) => {
  const iconMap = {
    Clear: 'twemoji:sunny',
    Cloudy: 'twemoji:cloud',
    'Mostly clear': 'twemoji:sunny',
    'Partly cloudy': 'twemoji:cloud',
    'Light rain': 'twemoji:cloud-with-rain',
    Rain: 'twemoji:cloud-with-rain',
    Thunderstorm: 'twemoji:cloud-with-lightning',
    'Light snow': 'twemoji:snowflake',
    Flurries: 'twemoji:snowflake',
  };

  return <Icon icon={iconMap[weather] || 'twemoji:sunny'} className="weather-icon" />;
};

export default getWeatherIcon;
