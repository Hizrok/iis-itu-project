// @author Petr Teichgrab

export default interface FilterProps {
    onFilterChange: (attribute: string, isDescending: boolean) => void;
  }