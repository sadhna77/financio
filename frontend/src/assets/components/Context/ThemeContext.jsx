import { useContext, createContext,useState,useEffect, Children } from "react";

const ThemeContext = createContext();


import React from 'react'

export const ThemeContextProvider = ({children}) => {
    const [ theme , setTheme ] = useState("light")
    useEffect(() => {

        const savedTheme = localStorage.getItem("theme")
        if (savedTheme) {
            setTheme(savedTheme)
            
        }

    }, [])

    useEffect(() => {

        document.documentElement.setAttribute("bg-theme", theme)
        localStorage.setItem("bg-theme", theme)


 
    }, [theme])

    const toggleTheme = ()=>{
        setTheme(prev=>(
            prev==="light"? 'dark': "light"
        ))

    }
    
    
  return (

    <ThemeContext.Provider value={{theme, toggleTheme}}>
        {children}

    </ThemeContext.Provider>
  
    
  )
}

export const useTheme =()=> useContext(ThemeContext)
