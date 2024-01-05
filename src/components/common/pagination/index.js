/* eslint-disable no-else-return */
/* eslint-disable react/button-has-type */
import React from 'react';
import './style.css';

const PaginationComponent = (props) => {
  const {
    users,
    itemsPerPage,
    maxPageNumberLimit,
    minPageNumberLimit,
    handleClick,
    currentPage,
    lastPageNumber,
  } = props;

  const pages = [];
  for (
    let i = lastPageNumber;
    i <= Math.ceil(users?.length / itemsPerPage);
    i++
  ) {
    pages.push(i);
  }

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={() => handleClick(number)}
          className={currentPage == number ? 'active' : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });
  return (
    <>
      <ul className="pageNumbers">{renderPageNumbers}</ul>
    </>
  );
};

export default React.memo(PaginationComponent);
