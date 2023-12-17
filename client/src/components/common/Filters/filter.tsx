import {
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import React, { useState } from "react";
import FilterProps from "./FilterProps";
import { Margin } from "@mui/icons-material";


const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedAttribute, setSelectedAttribute] = useState<string>("name");
  const [isDescending, setIsDescending] = useState<boolean>(false);


  const handleAttributeChange = (event: any) => {
    const selectedValue = event.target.value as string;
    setSelectedAttribute(selectedValue);
    onFilterChange(selectedValue, isDescending);
  };

  const handleToggleisDescending = () => {
    setIsDescending((previsDescending) => !previsDescending);
    onFilterChange(selectedAttribute, isDescending);
  };

  return (
    <div style={{ display: "flex" }}>
      <Select
        type="text"
        value={selectedAttribute}
        onChange={handleAttributeChange}>
        <MenuItem value="id">Zkratka</MenuItem>
        <MenuItem value="name">Název</MenuItem>
      </Select>
      <div className="descArrowIcon">
        {isDescending ? (<ArrowDownwardIcon onClick={handleToggleisDescending} />) : (
          <ArrowUpwardIcon onClick={handleToggleisDescending} />
        )}
      </div>
    </div>
  );
};

export default Filter;


