import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const eventsData = [
  { id: 1, title: 'Event 1', content: 'A technology conference will take place at 10 AM on March 20th.' },
  { id: 2, title: 'Event 2', content: 'An art exhibition will be open from 2 PM to 6 PM on March 22nd.' },
  { id: 3, title: 'Event 3', content: 'An outdoor concert will be held on the evening of March 25th.' },
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
            <Typography>{event.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default EventsTabs;
