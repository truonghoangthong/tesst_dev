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
    content: 'Join us for a cozy evening by the campfire at Sunset Ridge Park. Nestled in the heart of the forest, this picturesque location offers the perfect setting to relax, enjoy great company, and create unforgettable memories.',
    image: '/1_bonfire_800.jpg', // Correct image path
  },
  {
    id: 2,
    title: 'Art Exhibition on 22 March',
    content: 'An art exhibition will be open from 2 PM to 6 PM on March 22nd.',
    image: '', 
  },
  {
    id: 3,
    title: 'Outdoor Concert on 25 March',
    content: 'An outdoor concert will be held on the evening of March 25th.',
    image: 'https://example.com/concert.jpg', // Replace with actual image URL
  },
];

function EventsTabs() {
  return (
    <div className="events-tabs">
      {eventsData.map(event => (
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
              <Typography>{event.content}</Typography>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default EventsTabs;
