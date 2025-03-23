import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './tv.css';

const eventsData = [
  {
    id: 1,
    title: 'Campfire Gathering at Sunset Ridge on 9 March',
    content: '<p>Join us for a cozy evening by the campfire at <strong>Sunset Ridge Park</strong>. Nestled in the heart of the forest, this picturesque location offers the perfect setting to relax, enjoy great company, and create unforgettable memories.</p>',
    image: '/1_bonfire_800.jpg',
  },
  {
    id: 2,
    title: 'Art Exhibition on 22 March',
    content: '<p>An art exhibition will be open from <em>2 PM to 6 PM</em> on March 22nd. Featuring works from local artists, this event is a must-visit for art enthusiasts.</p>',
    image: '',
  },
  {
    id: 3,
    title: 'Outdoor Concert on 25 March',
    content: '<p>An outdoor concert will be held on the evening of March 25th. Enjoy live music from top bands and artists under the stars.</p>',
    image: 'https://example.com/concert.jpg',
  },
  {
    id: 4,
    title: 'Summer Camping Trip 2023',
    content: '<p>Join us for a fun camping trip at <strong>XYZ National Park</strong>! We\'ll have BBQ, games, and more.</p>',
    image: 'https://example.com/camping.jpg',
  },
];

function EventsTabs() {
  return (
    <div className="events-tabs">
      {eventsData.map((event) => (
        <Accordion key={event.id} disableGutters elevation={0} square>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${event.id}-content`}
            id={`panel${event.id}-header`}
          >
            <Typography>{event.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="event-details-content">
              {event.image && event.image !== '' ? (
                <img src={event.image} alt={event.title} className="event-image" />
              ) : null}
              <div
                className="event-content"
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default EventsTabs;