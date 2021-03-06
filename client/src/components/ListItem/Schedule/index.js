import React from "react";
import { Link } from "react-router-dom";
import { date, time } from "../../../helpers/datetime";
import { statusIcon } from "../../../icons";
import { styleWorkerStatus } from "../../../helpers/eventHelpers";
import "./index.css";

export default function Schedule(props) {
  const {
    user,
    item,
    view,
    displayColumn,
    styleItem,
    // styleMobileEventSummary,
    eventSummary: summary,
    user: { accessLevel },

    changeConfirmationStatus
  } = props;

  const leftCell = ("left", item);
  const rightCell = ("right", item);
  const eventDisplay = displayColumn("event");
  const confirmationDisplay = displayColumn("confirmation");

  let currentUser = {};
  if (item && item.staff)
    currentUser = item.staff.find(worker => {
      const email = worker.info.contact.emailAddresses.find(
        e => e.emailAddress === user.profile.email
      );
      if (email) return worker;
      return null;
    });

  return (
    <div className="List-Item" style={styleItem(item, view)}>
      {/* Event */}
      <div className="List-Item--Cell" style={{ ...eventDisplay, ...leftCell }}>
        <Link
          to={`${accessLevel}/events/${item.id}`}
          style={{
            textDecoration: "none",
            color: "black",
            height: "100%",
            width: "100%"
          }}
        >
          <div className="Schedule--event">
            <div className="Schedule--event-summary">{summary()}</div>
            {/* <div className="Schedule--event-time-until">
              <p>{item && timeUntil}</p>
            </div> */}
            <div className="Schedule--event-time">
              <p>{date(item, true, true)}</p>
              <p>{time(item)}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Confirmation */}
      <div
        className="List-Item--Cell"
        style={{ ...confirmationDisplay, ...rightCell }}
      >
        <div
          className="Schedule--confirmation"
          style={styleWorkerStatus(currentUser.confirmation)}
          onClick={e => {
            e.stopPropagation();
            changeConfirmationStatus(item.id, currentUser.id);
          }}
        >
          {statusIcon(currentUser.confirmation, "2x")}
        </div>
      </div>
    </div>
  );
}
