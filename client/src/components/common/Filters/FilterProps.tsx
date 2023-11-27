import React from "react";

  export default interface FilterProps {
    onFilterChange: (attribute: string, isDescending: boolean) => void;
  }