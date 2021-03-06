import React, { Fragment } from "react";
import { pencilIcon, checkIcon } from "../../icons";
import {
  styleConfirmationStatus,
  changeConfirmationStatus
} from "../../helpers/eventHelpers";
import "./Buttons.css";

export default function MobileButtons(props) {
  // Functions to Dynamically change buttons based on Mode ---------------

  const {
    // evt,
    editMode,
    fields,
    edit,
    submit: onSubmit,
    scrollToTop,
    handleStatusChange
  } = props;
  function editButton() {
    return (
      <div
        className="Button Edit"
        onClick={() => {
          edit();
          scrollToTop();
        }}
      >
        <div className="Button--text">
          <p>Edit</p>
        </div>
        <div className="Button--icon">{pencilIcon()}</div>
      </div>
    );
  }

  // function trashCan(){
  //   if (evt) {
  //     return (
  //       <div
  //         className="Button Delete"
  //       >
  //         <div className="Button--text"><p>DELETE</p></div>
  //         <div className="Button--icon">{trashIcon()}</div>
  //       </div>
  //     )
  //   }
  // }

  function submit() {
    return (
      <div className="Button Submit" onClick={onSubmit}>
        <div className="Button--text">
          <p>SUBMIT</p>
        </div>
        <div className="Button--icon">{checkIcon()}</div>
      </div>
    );
  }

  function confirmation() {
    if (fields && fields.confirmation) {
      return (
        <div
          className="event-status Button"
          name="confirmation"
          onClick={e => {
            e.stopPropagation();
            handleStatusChange(
              "confirmation",
              changeConfirmationStatus(fields && fields.confirmation)
            );
          }}
          style={styleConfirmationStatus(fields && fields.confirmation)}
        >
          <div className="Button--text">
            <p>{fields && fields.confirmation}</p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function displayButtons() {
    if (editMode) {
      return (
        <Fragment>
          {/* {trashCan()} */}
          {submit()}
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          {confirmation()}
          {editButton()}
        </Fragment>
      );
    }
  }

  function styleButtons() {
    let style = {};
    if (!editMode) {
      style = {
        position: "sticky",
        bottom: "115px"
      };
    }
    return style;
  }
  return (
    <div className="Buttons" style={styleButtons()}>
      {displayButtons()}
    </div>
  );
}
