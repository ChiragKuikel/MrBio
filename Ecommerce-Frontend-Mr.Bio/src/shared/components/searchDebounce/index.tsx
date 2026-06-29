import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface SearchProps {
  placeholder?: string;
  valueSetter: (value: string) => void;
  value?: string;
  sx?: CSSProperties;
}

const SearchField: FC<SearchProps> = ({
  placeholder = "Search",
  valueSetter,
  value = "",
  sx,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showReset, setShowReset] = useState(value.length > 0);

  // Fix: Provide null as initial value for the timer ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
    setShowReset(value.length > 0);
  }, [value]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowReset(newValue.length > 0);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      valueSetter(newValue);
    }, 1000);
  };

  const handleReset = () => {
    setInputValue("");
    setShowReset(false);
    valueSetter("");

    // Clear timer when resetting
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <>
      <TextField
        fullWidth
        sx={{ flexBasis: "50%", maxWidth: "400px", borderRadius: 2, ...sx }}
        size="small"
        value={inputValue}
        onChange={handleSearch}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {showReset && (
                <Tooltip title="Clear" arrow>
                  <HighlightOffIcon
                    color="error"
                    sx={{ cursor: "pointer" }}
                    onClick={handleReset}
                  />
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default SearchField;
