// @author Petr Teichgráb

export default interface FilterProps {
    onFilterChange: (attribute: string, isDescending: boolean) => void;
  }