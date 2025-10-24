@echo off
setlocal enabledelayedexpansion

:: Get the current directory path
set "current_dir=%~dp0"

:: Generate directory list and process to show only relative paths
dir "%current_dir%" /S /B > "%current_dir%temp_folders.txt"

:: Open the output file for writing
(
    :: Process the file to show only relative paths
    for /F "delims=" %%a in (temp_folders.txt) do (
        set "fullpath=%%a"
        set "relpath=!fullpath:%current_dir%=!"
        
        :: Remove the merged folder and trim spaces
        set "trimpath=!relpath:neoforge-21.1.200-merged\=!"
        set "trimpath=!trimpath: =!"
        
        :: Only output non-empty paths
        if not "!trimpath!"=="" echo.!trimpath!
    )
) > "%current_dir%folder_tree.txt"

:: Clean up temporary file
del "%current_dir%temp_folders.txt"

:: Optional: Display a confirmation message
echo Folder structure has been saved to folder_tree.txt in the current directory.

pause
