import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";
import { chevronRightIcon, chevronLeftIcon } from "../../icons";
import moment from "moment";
import {
  calendar,
  isDate,
  isMonth,
  isSameDay,
  isSameMonth,
  getDateISO,
  getNextMonth,
  getPreviousMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS
} from "../../helpers";

class Calendar extends Component {
  state = { ...this.resolveStateFromProp(), today: new Date() };

  resolveStateFromDate(date) {
    const isDateObject = isDate(date);
    const _date = isDateObject ? date : new Date();

    return {
      current: isDateObject ? date : null,
      month: +_date.getMonth() + 1,
      year: _date.getFullYear()
    };
  }

  resolveStateFromProp() {
    return this.resolveStateFromDate(this.props.date);
  }

  getCalendarDates = () => {
    const { current, month, year } = this.state;
    const calendarMonth = month || +current.getMonth() + 1;
    const calendarYear = year || current.getFullYear();

    return calendar(calendarMonth, calendarYear);
  };

  gotoDate = date => evt => {
    evt && evt.preventDefault();
    const { current } = this.state;
    const { onDateChanged } = this.props;

    !(current && isSameDay(date, current)) &&
      this.setState(this.resolveStateFromDate(date), () => {
        typeof onDateChanged === "function" && onDateChanged(date, "day");
      });
  };

  gotoPreviousMonth = () => {
    const { month, year } = this.state;
    const { onDateChanged } = this.props;
    this.setState(getPreviousMonth(month, year), () => {
      const { month, year } = this.state;
      const date = moment()
        .month(month - 1)
        .year(year);
      typeof onDateChanged === "function" && onDateChanged(date, "month");
    });
  };

  gotoNextMonth = () => {
    const { month, year } = this.state;
    const { onDateChanged } = this.props;
    this.setState(getNextMonth(month, year), () => {
      const { month, year } = this.state;
      const date = moment()
        .month(month - 1)
        .year(year);
      typeof onDateChanged === "function" && onDateChanged(date, "month");
    });
  };

  gotoPreviousYear = () => {
    const { year } = this.state;
    const { onDateChanged } = this.props;
    this.setState({ year: year - 1 }, () => {
      const { month, year } = this.state;
      const date = moment()
        .month(month - 1)
        .year(year);
      typeof onDateChanged === "function" && onDateChanged(date, "month");
    });
  };

  gotoNextYear = () => {
    const { year } = this.state;
    const { onDateChanged } = this.props;
    this.setState({ year: year + 1 }, () => {
      const { month, year } = this.state;
      const date = moment()
        .month(month - 1)
        .year(year);
      typeof onDateChanged === "function" && onDateChanged(date, "month");
    });
  };

  handlePressure = fn => {
    if (typeof fn === "function") {
      fn();
      this.pressureTimeout = setTimeout(() => {
        this.pressureTimer = setInterval(fn, 100);
      }, 500);
    }
  };

  clearPressureTimer = () => {
    this.pressureTimer && clearInterval(this.pressureTimer);
    this.pressureTimeout && clearTimeout(this.pressureTimeout);
  };

  clearDayTimeout = () => {
    this.dayTimeout && clearTimeout(this.dayTimeout);
  };

  handlePrevious = evt => {
    evt && evt.preventDefault();
    const fn = evt.shiftKey ? this.gotoPreviousYear : this.gotoPreviousMonth;
    this.handlePressure(fn);
  };

  handleNext = evt => {
    evt && evt.preventDefault();
    const fn = evt.shiftKey ? this.gotoNextYear : this.gotoNextMonth;
    this.handlePressure(fn);
  };

  renderMonthAndYear = () => {
    const { month, year } = this.state;
    const { onDateChanged } = this.props;
    const monthname = Object.keys(CALENDAR_MONTHS)[
      Math.max(0, Math.min(month - 1, 11))
    ];

    return (
      <Styled.CalendarHeader>
        <Styled.ArrowLeft
          onMouseDown={this.handlePrevious}
          onMouseUp={this.clearPressureTimer}
          title="Previous Month"
        >
          {chevronLeftIcon("1x")}
        </Styled.ArrowLeft>
        <Styled.CalendarMonth
          onClick={() => {
            const date = moment()
              .month(month - 1)
              .year(year);
            typeof onDateChanged === "function" && onDateChanged(date, "month");
          }}
        >
          {monthname} {year}
        </Styled.CalendarMonth>
        <Styled.ArrowRight
          onMouseDown={this.handleNext}
          onMouseUp={this.clearPressureTimer}
          title="Next Month"
        >
          {chevronRightIcon("1x")}
        </Styled.ArrowRight>
      </Styled.CalendarHeader>
    );
  };

  renderDayLabel = (day, index) => {
    const daylabel = WEEK_DAYS[day].toUpperCase();
    return (
      <Styled.CalendarDay key={daylabel} index={index}>
        {daylabel}
      </Styled.CalendarDay>
    );
  };

  renderCalendarDate = (date, index) => {
    const { current, month, year, today } = this.state;
    const _date = new Date(date.join("-"));

    const isToday = isSameDay(_date, today);
    const isCurrent = current && isSameDay(_date, current);
    const inMonth =
      month && year && isSameMonth(_date, new Date([year, month, 1].join("-")));
    const onClick = this.gotoDate(_date);

    const props = { index, inMonth, onClick, title: _date.toDateString() };

    const DateComponent =
      isCurrent && !isMonth(current)
        ? Styled.HighlightedCalendarDate
        : isToday
        ? Styled.TodayCalendarDate
        : Styled.CalendarDate;

    return (
      <DateComponent key={getDateISO(_date)} {...props}>
        {_date.getDate()}
      </DateComponent>
    );
  };

  componentDidMount() {
    const now = new Date();
    const tomorrow = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
    const ms = tomorrow - now;

    this.dayTimeout = setTimeout(() => {
      this.setState({ today: new Date() }, this.clearDayTimeout);
    }, ms);
  }

  componentDidUpdate(prevProps) {
    const { date, onDateChanged } = this.props;
    const { date: prevDate } = prevProps;
    const dateMatch = date === prevDate || isSameDay(date, prevDate);

    !dateMatch &&
      this.setState(this.resolveStateFromDate(date), () => {
        typeof onDateChanged === "function" && onDateChanged(date);
      });
  }

  componentWillUnmount() {
    this.clearPressureTimer();
    this.clearDayTimeout();
  }

  render() {
    return (
      <Styled.CalendarContainer>
        {this.renderMonthAndYear()}

        <Styled.CalendarGrid>
          <Fragment>{Object.keys(WEEK_DAYS).map(this.renderDayLabel)}</Fragment>

          <Fragment>
            {this.getCalendarDates().map(this.renderCalendarDate)}
          </Fragment>
        </Styled.CalendarGrid>
      </Styled.CalendarContainer>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};

export default Calendar;
