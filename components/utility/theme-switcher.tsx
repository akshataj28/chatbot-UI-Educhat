import { FC, useEffect } from "react";
import { useTheme } from "next-themes";
import { Select, MenuItem, InputLabel, FormControl,SelectChangeEvent } from "@mui/material";

export const ThemeSwitcher: FC = () => {
  const { setTheme, theme } = useTheme();

  const handleChange = (event: SelectChangeEvent<string>) => {

    const newTheme = event.target.value; // Log the new theme
    setTheme(newTheme); // Update the theme
    // setTheme(newTheme);
  };

  useEffect(()=>{
    console.log("Switching to theme:", theme);
  },[theme])
  
  return (
    <>
     <InputLabel id="theme-label">Theme</InputLabel>
      <Select
        labelId="theme-label"
        value={theme}
        onChange={handleChange}
        style={{
          backgroundColor: '#FFF',
          borderRadius: '4px',
        }}
      >
        <MenuItem value="dark">Dark</MenuItem>
        <MenuItem value="beige">Beige</MenuItem>
        <MenuItem value="light">Light</MenuItem>
      </Select>
    </>
     
  );
};
