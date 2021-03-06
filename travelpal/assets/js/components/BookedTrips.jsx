import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import api from '../api';
import BookedCard from './BookedCard';
import BookedForm from './BookedForm.jsx';

// Renders the user's booked trips
export default function BookedTrips({bookedTrips, form, flights, hotels}) {

  let today = new Date();
  let upcoming = [];
  let future = [];

  _.map(bookedTrips, function(tt) {
    // Convert the start and end date strings to Date objects
    let startDate = new Date(tt.start_date);
    let endDate = new Date(tt.end_date);
    // Trips this month
    if ((today.getMonth() == startDate.getMonth()) &&
    (today.getFullYear() == startDate.getFullYear())) {
      upcoming.push(<BookedCard key={tt.id} form={form} trip={tt}
        flights={flights} hotels={hotels} />);
    }
    // Future trips
    else {
      future.push(<BookedCard key={tt.id} form={form} trip={tt}
        flights={flights} hotels={hotels} />);
    }
  });

  // Display appropriate message if no upcoming or future trips
  if (upcoming.length == 0) {
    upcoming = <Col><b>You have no trips this month.</b></Col>;
  }
  if (future.length == 0) {
    future = <Col><b>You have no upcoming trips.</b></Col>;
  }

  return (
    <div className="page-content" id="booked-trips">
      <h3>Trips This Month</h3>
      <Row>{upcoming}</Row>
      <br />
      <h3>Future Trips</h3>
      <Row>{future}</Row>
    </div>
  );
};

BookedTrips.propTypes = {
  bookedTrips: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  flights: PropTypes.array.isRequired,
  hotels: PropTypes.array.isRequired
};
